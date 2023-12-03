'use client';
import { useEffect, useState } from 'react';

export default function ServerInfo({
	serverInfoPreRender
}: {
	serverInfoPreRender: { name: string; map: string };
}) {
	const [serverInfo, setServerInfo] = useState(serverInfoPreRender);
	useEffect(() => {
		setInterval(() => {
			fetch('/api/server-info')
				.then((res) => res.json())
				.then((data) => {
					setServerInfo(data);
				});
		}, 5000);
	}, []);
	return (
		<div className="flex flex-row justify-evenly font-bold">
			<p className="mr-3 pr-2">{serverInfo.name}</p>
			<p className="mr-3 pr-2">{serverInfo.map}</p>
		</div>
	);
}
