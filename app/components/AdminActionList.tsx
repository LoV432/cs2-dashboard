'use client';
import { useEffect, useRef, useState } from 'react';
import {
	getBansAndMutes,
	dbReturnAllAdminAction
} from '../lib/get-bans-mutes-list';
import { ConfirmationModal } from './ConfirmationModals';
import Image from 'next/image';

export default function AdminActionListButton() {
	const [adminActionList, setAdminActionList] = useState(
		[] as dbReturnAllAdminAction
	);
	const adminActionListModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	async function updateAdminActionList() {
		const adminActionList = await getBansAndMutes();
		if ('error' in adminActionList) return;
		setAdminActionList(adminActionList);
	}
	useEffect(() => {
		updateAdminActionList();
	}, []);
	return (
		<div className="flex w-full place-content-center">
			<div
				className="btn btn-outline"
				onClick={() => {
					updateAdminActionList();
					adminActionListModal.current.showModal();
				}}
			>
				Show Active Bans / Mutes
			</div>
			<AdminActionListModal
				adminActionListModal={adminActionListModal}
				adminActionList={adminActionList}
				updateAdminActionList={updateAdminActionList}
			/>
		</div>
	);
}

function AdminActionListModal({
	adminActionListModal,
	adminActionList,
	updateAdminActionList
}: {
	adminActionListModal: React.MutableRefObject<HTMLDialogElement>;
	adminActionList: dbReturnAllAdminAction;
	updateAdminActionList: () => Promise<void>;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<
		dbReturnAllAdminAction[0] | undefined
	>();
	const removeActionModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	function closePopUp() {
		adminActionListModal.current.close();
	}
	return (
		<>
			<dialog ref={adminActionListModal} className="modal">
				<div className="modal-box h-3/4 w-11/12 max-w-[70rem] bg-zinc-900 md:w-2/3">
					{/*  Dummy element to remove auto focus */}
					<a href="#" className="opacity-0"></a>
					<p className="pb-5 text-xl font-bold">Active Bans / Mutes</p>
					<div className="overflow-x-auto">
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
								{adminActionList.map((action) => {
									return (
										<ActionItemList
											key={`${action.id}-${action.type}`}
											actionItem={action}
											setSelectedPlayer={setSelectedPlayer}
											removeActionModal={removeActionModal}
										/>
									);
								})}
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
			<RemoveAdminActionPopUp
				player={selectedPlayer}
				removeActionModal={removeActionModal}
				updateAdminActionList={updateAdminActionList}
			/>
		</>
	);
}

function ActionItemList({
	actionItem,
	setSelectedPlayer,
	removeActionModal
}: {
	actionItem: dbReturnAllAdminAction[0];
	setSelectedPlayer: (player: dbReturnAllAdminAction[0]) => void;
	removeActionModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<tr className="border-slate-300 border-opacity-30 text-base">
			<th>
				<a
					className="link underline-offset-4"
					target={'_blank'}
					href={`https://steamcommunity.com/profiles/${actionItem.player_steamid}/`}
				>
					{actionItem.player_name}
				</a>
			</th>
			<td className="font-semibold">
				<a
					className="link underline-offset-4"
					target={'_blank'}
					href={`https://whatismyipaddress.com/ip/${actionItem.player_ip}/`}
				>
					{actionItem.player_ip}
				</a>
			</td>
			<td className="font-semibold">{actionItem.type}</td>
			<td className="font-semibold">{actionItem.reason}</td>
			{actionItem.duration == 0 ? (
				<td className="font-semibold">Permanent</td>
			) : (
				<td className="font-semibold">
					{new Date(actionItem.ends).toLocaleString('en-US', {
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
						setSelectedPlayer(actionItem);
						removeActionModal.current.showModal();
					}}
					className="btn btn-error w-10 h-10 min-h-0 p-0"
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

function RemoveAdminActionPopUp({
	player,
	removeActionModal,
	updateAdminActionList
}: {
	player: dbReturnAllAdminAction[0] | undefined;
	removeActionModal: React.MutableRefObject<HTMLDialogElement>;
	updateAdminActionList: () => Promise<void>;
}) {
	const removeAdminAction = (actionType: 'MUTE' | 'GAG' | 'BAN') => {
		if (actionType == 'BAN') {
			fetch('/api/rcon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					command: `css_unban ${player?.player_steamid || player?.player_ip}`
				})
			});
		} else {
			fetch('/api/rcon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					command: `css_un${actionType.toLowerCase()} ${player?.player_steamid}`
				})
			});
		}
		removeActionModal.current.close();
		setTimeout(() => {
			updateAdminActionList();
		}, 500);
	};

	if (!player) {
		{
			/* Will never reach */
		}
		return (
			<ConfirmationModal
				modalAction={() => {
					removeAdminAction('BAN');
				}}
				modalName={``}
				modalRef={removeActionModal}
				playerName={''}
			/>
		);
	}

	return (
		<ConfirmationModal
			modalAction={() => {
				removeAdminAction(player.type);
			}}
			modalName={`Un${player.type.toLowerCase()}`}
			modalRef={removeActionModal}
			playerName={player.player_name}
		/>
	);
}
