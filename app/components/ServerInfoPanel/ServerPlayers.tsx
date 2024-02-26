'use client';
import { useEffect, useState, useRef } from 'react';
import { Player } from '@/app/lib/parse-players';
import Image from 'next/image';
import AdminPanel from './AdminPanel/AdminPanel';
import { getPlayers } from '../../lib/get-playes';
import { useSetAtom, useAtomValue } from 'jotai';
import { activeServerStore } from '../../store/active-server-store';
import { loadingPlayersStore } from '../../store/loading-store';

export default function ServerPlayers({
	playersPreRendered,
	featureFlags
}: {
	playersPreRendered: Player[];
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
	};
}) {
	const selectedServer = useAtomValue(activeServerStore);
	const setLoading = useSetAtom(loadingPlayersStore);
	setLoading(false);
	const [allPlayers, setAllPlayers] = useState<Player[] | { err: string }>(
		playersPreRendered
	);
	const lastSelectedServer = useRef(selectedServer);
	const userDataModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const adminPanelModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

	useEffect(() => {
		if (selectedServer != lastSelectedServer.current) {
			(async () => {
				setLoading(true);
				const players = await getPlayers(selectedServer);
				setAllPlayers(players);
				setLoading(false);
			})();
		}
		lastSelectedServer.current = selectedServer;
		const getPlayersInterval = setInterval(async () => {
			const players = await getPlayers(selectedServer);
			setAllPlayers(players);
		}, 5000);
		return () => clearInterval(getPlayersInterval);
	}, [selectedServer]);

	if ('err' in allPlayers) {
		return (
			<div>
				<p>RCON Failed</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto pt-5">
			<table className="table">
				<thead>
					<tr>
						<th>Ping</th>
						<th className="hidden sm:table-cell">Loss</th>
						<th>Name</th>
						<th className="hidden sm:table-cell">Address</th>
						{featureFlags.maxMindIsEnabled && <th>Geo</th>}
					</tr>
				</thead>
				<tbody>
					{allPlayers.map((player) => {
						return (
							<PlayerRow
								key={player.id}
								player={player}
								selectedPlayer={selectedPlayer}
								setSelectedPlayer={setSelectedPlayer}
								adminPanelModal={adminPanelModal}
								geoDataModal={userDataModal}
								maxMindIsEnabled={featureFlags.maxMindIsEnabled}
							/>
						);
					})}
				</tbody>
			</table>
			<AllUserDataPopUp
				userDataModal={userDataModal}
				selectedPlayer={selectedPlayer}
			/>
			<AdminPanel
				adminPanelModal={adminPanelModal}
				selectedPlayer={selectedPlayer}
				featureFlags={featureFlags}
			/>
		</div>
	);
}

function PlayerRow({
	player,
	selectedPlayer,
	setSelectedPlayer,
	adminPanelModal,
	geoDataModal,
	maxMindIsEnabled
}: {
	player: Player;
	selectedPlayer: Player | null;
	setSelectedPlayer: (player: Player) => void;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
	geoDataModal: React.MutableRefObject<HTMLDialogElement>;
	maxMindIsEnabled: boolean;
}) {
	useEffect(() => {
		if (selectedPlayer && selectedPlayer.id == player.id) {
			setSelectedPlayer(player);
		}
	}, [player.ping, player.loss]);
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
				<p className="line-clamp-1 break-all">{player.name}</p>
			</td>
			<td className="hidden sm:table-cell">{player.adr.split(':')[0]}</td>
			{maxMindIsEnabled && (
				<td>
					<Image
						loading="eager"
						width={22}
						height={22}
						src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${
							player.country.isoCode || 'AQ'
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
						adminPanelModal.current.showModal();
					}}
					className="btn btn-ghost btn-xs h-9 w-9"
				>
					<Image
						loading="eager"
						width={20}
						height={20}
						src="/admin-action.svg"
						alt="Close"
					/>
				</button>
			</td>
		</tr>
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
			<div className="modal-box bg-zinc-900">
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
							<tr className="table-row break-all sm:hidden">
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
