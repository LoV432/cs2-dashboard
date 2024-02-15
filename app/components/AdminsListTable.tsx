import { useRef, useState } from 'react';
import { dbReturnAllAdmins } from '../lib/get-admins-list';
import { AddAdminManualModal, ConfirmationModal } from './ConfirmationModals';
import Image from 'next/image';
import { execRcon } from '../lib/exec-rcon';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';
import { reloadAllServerAdmin } from '../lib/reload-admin-vip';

export default function AdminsListTable({
	adminsList,
	updateAdminsList
}: {
	adminsList: dbReturnAllAdmins;
	updateAdminsList: () => Promise<void>;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<
		dbReturnAllAdmins[0] | undefined
	>();
	const removeAdminModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	const addAdminModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	return (
		<>
			<button
				onClick={() => addAdminModal.current.showModal()}
				className="btn btn-success float-right mr-2 h-9 min-h-0 w-28"
			>
				Add ADMIN
			</button>
			<div className="w-full overflow-x-auto">
				<table className="table">
					<thead className="text-slate-300">
						<tr className="border-slate-300 border-opacity-30">
							<th>Name</th>
							<th>Immunity</th>
							<th>Flag</th>
							<th>Ends on</th>
						</tr>
					</thead>
					<tbody>
						{adminsList.map((punishment) => {
							return (
								<AdminItemList
									key={`${punishment.id}`}
									adminItem={punishment}
									setSelectedPlayer={setSelectedPlayer}
									removeAdminModal={removeAdminModal}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
			<AddAdminManualModal
				modalRef={addAdminModal}
				updateAdminsList={updateAdminsList}
			/>
			<RemoveAdminPopUp
				player={selectedPlayer}
				removeAdminModal={removeAdminModal}
				updateAdminsList={updateAdminsList}
			/>
		</>
	);
}

function AdminItemList({
	adminItem,
	setSelectedPlayer,
	removeAdminModal
}: {
	adminItem: dbReturnAllAdmins[0];
	setSelectedPlayer: (player: dbReturnAllAdmins[0]) => void;
	removeAdminModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<tr className="border-slate-300 border-opacity-30 text-base">
			<th>
				<a
					className={`link underline-offset-4 ${adminItem.server_id == null ? 'link-error' : ''}`}
					title={`${adminItem.server_id == null ? 'Global Admin' : ''}`}
					target={'_blank'}
					href={`https://steamcommunity.com/profiles/${adminItem.player_steamid}/`}
				>
					{adminItem.player_name}
				</a>
			</th>
			<td className="font-semibold">{adminItem.immunity}</td>
			<td className="font-semibold">{adminItem.flags}</td>
			{adminItem.ends === null ? (
				<td className="font-semibold">Permanent</td>
			) : (
				<td className="font-semibold">
					{new Date(adminItem.ends * 1000).toLocaleString('en-US', {
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
						setSelectedPlayer(adminItem);
						removeAdminModal.current.showModal();
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

function RemoveAdminPopUp({
	player,
	removeAdminModal,
	updateAdminsList
}: {
	player: dbReturnAllAdmins[0] | undefined;
	removeAdminModal: React.MutableRefObject<HTMLDialogElement>;
	updateAdminsList: () => Promise<void>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const removeAdmin = () => {
		execRcon(
			`css_deladmin ${player?.player_steamid} ${player?.server_id == null ? '-g' : ''}`,
			activeServer
		);
		if (player?.server_id == null) {
			reloadAllServerAdmin();
		} else {
			execRcon('css_reladmin', activeServer);
		}
		removeAdminModal.current.close();
		setTimeout(() => {
			updateAdminsList();
		}, 500);
	};

	if (!player) {
		{
			/* Will never reach */
		}
		return (
			<ConfirmationModal
				modalAction={removeAdmin}
				modalName={``}
				modalRef={removeAdminModal}
				playerName={''}
			/>
		);
	}

	return (
		<ConfirmationModal
			modalAction={removeAdmin}
			modalName={`Remove ADMIN`}
			modalRef={removeAdminModal}
			playerName={player.player_name}
		/>
	);
}
