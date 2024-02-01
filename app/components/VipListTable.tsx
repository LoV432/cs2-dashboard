import { useRef, useState } from 'react';
import { dbReturnAllVipsAction } from '../lib/get-vip-list';
import {
	AddVipManualModal,
	DeleteVipConfirmationModal
} from './ConfirmationModals';
import Image from 'next/image';
import { execRcon } from '../lib/exec-rcon';

export default function VipsListTable({
	vipsList,
	updateVipsList
}: {
	vipsList: dbReturnAllVipsAction;
	updateVipsList: () => Promise<void>;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<
		dbReturnAllVipsAction[0] | undefined
	>();
	const removeVipModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const addVipModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	return (
		<>
			<button
				onClick={() => addVipModal.current.showModal()}
				className="btn btn-success float-right mr-2 h-9 min-h-0 w-24"
			>
				Add VIP
			</button>
			<table className="table">
				<thead className="text-slate-300">
					<tr className="border-slate-300 border-opacity-30">
						<th>Name</th>
						<th>Group</th>
						<th>Ends on</th>
					</tr>
				</thead>
				<tbody>
					{vipsList.map((vip) => {
						return (
							<VipItemList
								key={vip.account_id}
								vipItem={vip}
								setSelectedPlayer={setSelectedPlayer}
								removeVipModal={removeVipModal}
							/>
						);
					})}
				</tbody>
			</table>
			<AddVipManualModal
				modalRef={addVipModal}
				updateVipsList={updateVipsList}
			/>
			<RemoveVipActionPopUp
				player={selectedPlayer}
				removeVipModal={removeVipModal}
				updateVipsList={updateVipsList}
			/>
		</>
	);
}

function VipItemList({
	vipItem,
	setSelectedPlayer,
	removeVipModal
}: {
	vipItem: dbReturnAllVipsAction[0];
	setSelectedPlayer: (player: dbReturnAllVipsAction[0]) => void;
	removeVipModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<tr className="border-slate-300 border-opacity-30 text-base">
			<th>{vipItem.name}</th>
			<td className="font-semibold">{vipItem.group}</td>
			{vipItem.expires == 0 ? (
				<td className="font-semibold">Permanent</td>
			) : (
				<td className="font-semibold">
					{new Date(vipItem.expires * 1000).toLocaleString('en-US', {
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
						setSelectedPlayer(vipItem);
						removeVipModal.current.showModal();
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

function RemoveVipActionPopUp({
	player,
	removeVipModal,
	updateVipsList
}: {
	player: dbReturnAllVipsAction[0] | undefined;
	removeVipModal: React.MutableRefObject<HTMLDialogElement>;
	updateVipsList: () => Promise<void>;
}) {
	const removeVipAction = () => {
		execRcon(`css_vip_deleteuser ${player?.account_id}`);
		removeVipModal.current.close();
		setTimeout(() => {
			updateVipsList();
		}, 500);
	};

	if (!player) {
		{
			/* Will never reach */
		}
		return (
			<DeleteVipConfirmationModal
				modalAction={removeVipAction}
				modalName={``}
				modalRef={removeVipModal}
				playerName={''}
			/>
		);
	}

	return (
		<DeleteVipConfirmationModal
			modalAction={removeVipAction}
			modalName={`remove`}
			modalRef={removeVipModal}
			playerName={player.name}
		/>
	);
}
