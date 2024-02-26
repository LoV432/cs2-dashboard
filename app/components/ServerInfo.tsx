'use client';
import { useEffect, useRef, useState } from 'react';
import { getServerInfo } from '../lib/get-server-info';
import { ConfirmationModalChangeMap } from './ConfirmationModals';
import { useSetAtom, useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';
import { loadingServerStore } from '../store/loading-store';

export default function ServerInfo({
	serverInfoPreRender,
	featureFlags
}: {
	serverInfoPreRender: { name: string; map: string };
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
	};
}) {
	const setLoading = useSetAtom(loadingServerStore);
	setLoading(false);
	const selectedServer = useAtomValue(activeServerStore);
	const lastSelectedServer = useRef(selectedServer);
	const [serverInfo, setServerInfo] = useState<
		{ name: string; map: string } | { err: string }
	>(serverInfoPreRender);
	const changeMapModalRef =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	useEffect(() => {
		if (selectedServer != lastSelectedServer.current) {
			(async () => {
				setLoading(true);
				const serverInfo = await getServerInfo(selectedServer);
				setServerInfo(serverInfo);
				setLoading(false);
			})();
		}
		lastSelectedServer.current = selectedServer;
		const serverInfoInterval = setInterval(async () => {
			const serverInfo = await getServerInfo(selectedServer);
			setServerInfo(serverInfo);
		}, 5000);
		return () => clearInterval(serverInfoInterval);
	}, [selectedServer]);

	if ('err' in serverInfo) {
		return <h1>Server connection failed</h1>;
	}
	return (
		<>
			<div className="flex flex-row justify-evenly font-bold">
				<p className="mr-3 pr-2">{serverInfo.name}</p>
				{featureFlags.adminPluginIsEnabled ? (
					<p
						onClick={() => (changeMapModalRef.current.open = true)}
						className="mr-3 cursor-pointer pr-2 underline underline-offset-4"
					>
						{serverInfo.map}
					</p>
				) : (
					<p className="mr-3 pr-2">{serverInfo.map}</p>
				)}
			</div>
			<ConfirmationModalChangeMap modalRef={changeMapModalRef} />
		</>
	);
}
