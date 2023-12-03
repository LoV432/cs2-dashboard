import { csServer } from '@/app/lib/server';

export default async function ServerInfo() {
	const serverInfo = await csServer.getInfo();
	return (
		<div className="rounded-md bg-zinc-800 p-4">
			<h2 className="mb-3 border-b-2 border-white border-opacity-25 pb-2 text-xl font-bold">
				Server Information
			</h2>
			<p className="mb-3 border-b-2 border-white border-opacity-25 pb-2">
				Name: {serverInfo.name}
			</p>
			<p className="mb-3 border-b-2 border-white border-opacity-25 pb-2">
				Map: {serverInfo.map}
			</p>
			<p className="mb-3 border-b-2 border-white border-opacity-25 pb-2">
				Total Players: {serverInfo.players.online}
			</p>
		</div>
	);
}
