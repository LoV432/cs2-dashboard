'use client';
import { useEffect, useState } from 'react';
import { Player, parsePlayerData } from '@/app/lib/parse-players';

export default function ServerPlayers({
	playersPreRendered
}: {
	playersPreRendered: Player[];
}) {
	const [allPlayers, setAllPlayers] = useState(playersPreRendered);

	useEffect(() => {
		setInterval(() => {
			fetch('/api/get-players')
				.then((res) => res.json())
				.then((data) => {
					setAllPlayers(data);
				});
		}, 5000);
	}, []);

	return (
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
