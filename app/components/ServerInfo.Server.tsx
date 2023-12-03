import { csServer } from '@/app/lib/server';
import { rcon } from '@/app/lib/rcon';
import { Player, parsePlayerData } from '../api/get-players/route';

export default async function ServerInfo() {
	const serverInfo = await csServer.getInfo();
	const players = await rcon.exec('status');
	const allPlayers = parsePlayerData(players);
	return (
		<div className="rounded-md bg-zinc-800 p-4">
			<div className="flex flex-row justify-evenly font-bold">
				<p className="mr-3 pr-2">{serverInfo.name}</p>
				<p className="mr-3 pr-2">{serverInfo.map}</p>
			</div>

			<div className="overflow-x-auto pt-5">
				<table className="table">
					<thead>
						<tr>
							<th>Ping</th>
							<th>Loss</th>
							<th>Name</th>
							<th>Address</th>
						</tr>
					</thead>
					<tbody>
						{allPlayers.map((player) => {
							return <PlayerRow key={player.name} player={player} />;
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function PlayerRow({ player }: { player: Player }) {
	return (
		<tr>
			<td>{player.ping}</td>
			<td>{player.loss}</td>
			<td>{player.name}</td>
			<td>{player.adr.split(':')[0]}</td>
		</tr>
	);
}
