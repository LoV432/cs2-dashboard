'use client';
import { useEffect, useState, useRef } from 'react';
import { Player } from '@/app/lib/parse-players';
import Image from 'next/image';

export default function ServerPlayers({
	playersPreRendered,
	maxMindIsEnabled
}: {
	playersPreRendered: Player[];
	maxMindIsEnabled: boolean;
}) {
	const [allPlayers, setAllPlayers] = useState(playersPreRendered);
	const kickPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const userDataModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

	useEffect(() => {
		const getPlayersInterval = setInterval(() => {
			fetch('/api/get-players')
				.then((res) => res.json())
				.then((data) => {
					setAllPlayers(data);
				});
		}, 5000);
		return () => clearInterval(getPlayersInterval);
	}, []);

	return (
		<div className="overflow-x-auto pt-5">
			<table className="table">
				<thead>
					<tr>
						<th>Ping</th>
						<th className="hidden sm:table-cell">Loss</th>
						<th>Name</th>
						<th className="hidden sm:table-cell">Address</th>
						{maxMindIsEnabled && <th>Geo</th>}
					</tr>
				</thead>
				<tbody>
					{allPlayers.map((player) => {
						return (
							<PlayerRow
								key={player.name}
								player={player}
								setSelectedPlayer={setSelectedPlayer}
								kickPlayerModal={kickPlayerModal}
								geoDataModal={userDataModal}
								maxMindIsEnabled={maxMindIsEnabled}
							/>
						);
					})}
				</tbody>
			</table>
			<KickPlayerPopUp
				playerId={selectedPlayer?.id || 0}
				kickPlayerModal={kickPlayerModal}
			/>
			<AllUserDataPopUp
				userDataModal={userDataModal}
				selectedPlayer={selectedPlayer}
			/>
		</div>
	);
}

function PlayerRow({
	player,
	setSelectedPlayer,
	kickPlayerModal,
	geoDataModal,
	maxMindIsEnabled
}: {
	player: Player;
	setSelectedPlayer: (player: Player) => void;
	kickPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	geoDataModal: React.MutableRefObject<HTMLDialogElement>;
	maxMindIsEnabled: boolean;
}) {
	return (
		<tr
			className="cursor-pointer"
			onClick={() => {
				setSelectedPlayer(player);
				geoDataModal.current.showModal();
			}}
		>
			<td>{player.ping}</td>
			<td className="hidden sm:table-cell">{player.loss}</td>
			<td>
				<p className="line-clamp-1">{player.name}</p>
			</td>
			<td className="hidden sm:table-cell">{player.adr.split(':')[0]}</td>
			{maxMindIsEnabled && (
				<td>
					<Image
						width={22}
						height={22}
						src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
							player.country.isoCode || 'EU'
						}.svg`}
						alt={player.country.countryName || 'Unknown Country'}
					/>
				</td>
			)}

			<td>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setSelectedPlayer(player);
						kickPlayerModal.current.showModal();
					}}
					className="btn btn-ghost btn-xs h-9 w-9"
				>
					<Image width={20} height={20} src="/trash-outline.svg" alt="Close" />
				</button>
			</td>
		</tr>
	);
}

function KickPlayerPopUp({
	playerId,
	kickPlayerModal
}: {
	playerId: number;
	kickPlayerModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const kickPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `kickid ${playerId}`
			})
		});
		closePopUp();
	};

	function closePopUp() {
		kickPlayerModal.current.close();
	}

	return (
		<dialog ref={kickPlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Kick Player</h3>
				<p>Are you sure you want to kick this player?</p>
				<button onClick={kickPlayer} className="btn btn-error mt-5 w-full">
					KICK
				</button>
				<button onClick={closePopUp} className="btn btn-ghost mt-5 w-full">
					Cancel
				</button>
				<button
					onClick={closePopUp}
					className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
				>
					✕
				</button>
			</div>
			<div className="modal-backdrop bg-zinc-700 opacity-30">
				<button onClick={closePopUp}>close</button>
			</div>
		</dialog>
	);
}

function AllUserDataPopUp({
	userDataModal,
	selectedPlayer
}: {
	userDataModal: React.MutableRefObject<HTMLDialogElement>;
	selectedPlayer: Player | null;
}) {
	function closePopUp() {
		userDataModal.current.close();
	}
	if (!selectedPlayer) {
		return (
			<dialog ref={userDataModal} className="modal">
				<div className="modal-box bg-zinc-900">
					<h3 className="pb-5 text-lg font-bold">User Data</h3>
					<p>No player selected</p>
				</div>
				<div className="modal-backdrop bg-zinc-700 opacity-30">
					<button onClick={closePopUp}>close</button>
				</div>
			</dialog>
		);
	}
	return (
		<dialog ref={userDataModal} className="modal">
			<div className="modal-box w-fit bg-zinc-900">
				<div className="overflow-x-auto">
					<table className="table">
						<tbody>
							<tr className="table-row sm:hidden">
								<th>Ping</th>
								<td>{selectedPlayer.ping}</td>
							</tr>
							<tr className="table-row sm:hidden">
								<th>Loss</th>
								<td>{selectedPlayer.loss}</td>
							</tr>
							<tr className="table-row sm:hidden">
								<th>Name</th>
								<td>{selectedPlayer.name}</td>
							</tr>
							<tr className="table-row sm:hidden">
								<th>Address</th>
								<td>{selectedPlayer.adr.split(':')[0]}</td>
							</tr>
							<tr>
								<th>Country</th>
								<td>{selectedPlayer.country.countryName}</td>
							</tr>
							<tr>
								<th>City</th>
								<td>{selectedPlayer.country.cityName}</td>
							</tr>
							<tr>
								<th>ASN</th>
								<td>{selectedPlayer.asn.autonomousSystemOrganization}</td>
							</tr>
							<tr>
								<th>ASN Number</th>
								<td>{selectedPlayer.asn.autonomousSystemNumber}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<button
					onClick={closePopUp}
					className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
				>
					✕
				</button>
			</div>
			<div className="modal-backdrop bg-zinc-700 opacity-30">
				<button onClick={closePopUp}>close</button>
			</div>
		</dialog>
	);
}
