import { useRef, useState } from 'react';
import { dbReturnAllPunishmentAction } from '../lib/get-bans-mutes-list';
import {
	ConfirmationModal,
	ConfirmationModalBanMuteManual
} from './ConfirmationModals';
import Image from 'next/image';
import { execRcon } from '../lib/exec-rcon';
import { activeServerStore } from '../store/active-server-store';
import { useAtomValue } from 'jotai';

export default function PunishmentsListTable({
	punishmentsList,
	updatePunishmentsList
}: {
	punishmentsList: dbReturnAllPunishmentAction;
	updatePunishmentsList: () => Promise<void>;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<
		dbReturnAllPunishmentAction[0] | undefined
	>();
	const removePunishmentModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	const addPunishmentModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	return (
		<>
			<button
				onClick={() => addPunishmentModal.current.showModal()}
				className="btn btn-error float-right mr-2 h-9 min-h-0 w-32"
			>
				Add Ban/Mute
			</button>
			<div className="w-full overflow-x-auto">
				<table className="table">
					<thead className="text-slate-300">
						<tr className="border-slate-300 border-opacity-30">
							<th>Name</th>
							<th>IP</th>
							<th>Type</th>
							<th>Reason</th>
							<th>Ends on</th>
						</tr>
					</thead>
					<tbody>
						{punishmentsList.map((punishment) => {
							return (
								<PunishmentItemList
									key={`${punishment.id}-${punishment.type}`}
									punishmentItem={punishment}
									setSelectedPlayer={setSelectedPlayer}
									removePunishmentModal={removePunishmentModal}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
			<ConfirmationModalBanMuteManual
				modalRef={addPunishmentModal}
				updatePunishmentsList={updatePunishmentsList}
			/>
			<RemovePunishmentActionPopUp
				player={selectedPlayer}
				removePunishmentModal={removePunishmentModal}
				updatePunishmentsList={updatePunishmentsList}
			/>
		</>
	);
}

function PunishmentItemList({
	punishmentItem,
	setSelectedPlayer,
	removePunishmentModal
}: {
	punishmentItem: dbReturnAllPunishmentAction[0];
	setSelectedPlayer: (player: dbReturnAllPunishmentAction[0]) => void;
	removePunishmentModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<tr className="border-slate-300 border-opacity-30 text-base">
			<th>
				<a
					className="link underline-offset-4"
					target={'_blank'}
					href={`https://steamcommunity.com/profiles/${punishmentItem.player_steamid}/`}
				>
					{punishmentItem.player_name || punishmentItem.player_steamid}
				</a>
			</th>
			<td className="font-semibold">
				<a
					className="link underline-offset-4"
					target={'_blank'}
					href={`https://whatismyipaddress.com/ip/${punishmentItem.player_ip}/`}
				>
					{punishmentItem.player_ip}
				</a>
			</td>
			<td className="font-semibold">{punishmentItem.type}</td>
			<td className="font-semibold">{punishmentItem.reason}</td>
			{punishmentItem.duration == 0 ? (
				<td className="font-semibold">Permanent</td>
			) : (
				<td className="font-semibold">
					{new Date(punishmentItem.ends).toLocaleString('en-US', {
						day: '2-digit',
						month: 'short',
						hour: 'numeric',
						minute: '2-digit'
					})}
				</td>
			)}

			<td>
				<button
					onClick={() => {
						setSelectedPlayer(punishmentItem);
						removePunishmentModal.current.showModal();
					}}
					className="btn btn-error h-10 min-h-0 w-10 p-0"
				>
					<Image
						src={'/trash-outline.svg'}
						width={20}
						height={20}
						alt="Delete"
						aria-label="Delete"
					/>
				</button>
			</td>
		</tr>
	);
}

function RemovePunishmentActionPopUp({
	player,
	removePunishmentModal,
	updatePunishmentsList
}: {
	player: dbReturnAllPunishmentAction[0] | undefined;
	removePunishmentModal: React.MutableRefObject<HTMLDialogElement>;
	updatePunishmentsList: () => Promise<void>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const removePunishmentAction = (actionType: 'MUTE' | 'GAG' | 'BAN') => {
		if (actionType == 'BAN') {
			execRcon(
				`css_unban ${player?.player_steamid || player?.player_ip}`,
				activeServer
			);
		} else {
			execRcon(
				`css_un${actionType.toLowerCase()} ${player?.player_steamid}`,
				activeServer
			);
		}
		removePunishmentModal.current.close();
		setTimeout(() => {
			updatePunishmentsList();
		}, 500);
	};

	if (!player) {
		{
			/* Will never reach */
		}
		return (
			<ConfirmationModal
				modalAction={() => {
					removePunishmentAction('BAN');
				}}
				modalName={``}
				modalRef={removePunishmentModal}
				playerName={''}
			/>
		);
	}

	return (
		<ConfirmationModal
			modalAction={() => {
				removePunishmentAction(player.type);
			}}
			modalName={`Un${player.type.toLowerCase()}`}
			modalRef={removePunishmentModal}
			playerName={player.player_name || player.player_steamid}
		/>
	);
}
