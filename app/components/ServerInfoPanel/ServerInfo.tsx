'use client';
import { useEffect, useRef, useState } from 'react';
import { getServerInfo } from '../../lib/get-server-info';
import { ConfirmationModalChangeMap } from '../Misc/ConfirmationModals';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext } from 'react';

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
	const activeServer = useContext(ActiveServerContext);
	const [serverInfo, setServerInfo] = useState<
		{ name: string; map: string } | { err: string }
	>(serverInfoPreRender);
	const changeMapModalRef =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	useEffect(() => {
		const serverInfoInterval = setInterval(async () => {
			const serverInfo = await getServerInfo(activeServer);
			setServerInfo(serverInfo);
		}, 5000);
		return () => clearInterval(serverInfoInterval);
	}, [activeServer]);

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
