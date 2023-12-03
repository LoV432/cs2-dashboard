import { csServer } from '@/app/lib/server';
import { rcon } from '@/app/lib/rcon';
import { parsePlayerData } from '@/app/lib/parse-players';
import ServerInfo from './ServerInfo';
import ServerPlayers from './ServerPlayers';

export default async function ServerInfoPanel() {
	const serverInfo = await csServer.getInfo();
	const players = await rcon.exec('status');
	const allPlayers = parsePlayerData(players);
	return (
		<div className="rounded-md bg-zinc-800 p-4">
			<ServerInfo serverInfoPreRender={serverInfo} />
			<ServerPlayers playersPreRendered={allPlayers} />
		</div>
	);
}
