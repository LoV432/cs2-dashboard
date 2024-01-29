'use client';
import { useEffect, useState } from 'react';
import { getServerInfo } from '../lib/get-server-info';

export default function ServerInfo({
	serverInfoPreRender
}: {
	serverInfoPreRender: { name: string; map: string };
}) {
	const [serverInfo, setServerInfo] = useState(serverInfoPreRender);
	useEffect(() => {
		const serverInfoInterval = setInterval(async () => {
			const serverInfo = await getServerInfo();
			if (!('err' in serverInfo)) setServerInfo(serverInfo);
		}, 5000);
		return () => clearInterval(serverInfoInterval);
	}, []);
	return (
		<div className="flex flex-row justify-evenly font-bold">
			<p className="mr-3 pr-2">{serverInfo.name}</p>
			<p className="mr-3 pr-2">{serverInfo.map}</p>
		</div>
	);
}
