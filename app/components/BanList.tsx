'use client';
import { useEffect, useRef, useState } from 'react';
import { getBans, dbAllBansReturn } from '../lib/get-bans';

export default function BanListButton() {
	const [banList, setBanlist] = useState([] as dbAllBansReturn);
	const banListModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	async function updateBanList() {
		const banList = await getBans();
		if ('error' in banList) return;
		setBanlist(banList);
	}
	useEffect(() => {
		updateBanList();
	}, []);
	return (
		<>
			<div
				onClick={() => {
					updateBanList();
					banListModal.current.showModal();
				}}
			>
				Show all bans
			</div>
			<BanListModal
				banListModal={banListModal}
				banList={banList}
				updateBanList={updateBanList}
			/>
		</>
	);
}

function BanListModal({
	banListModal,
	banList,
	updateBanList
}: {
	banListModal: React.MutableRefObject<HTMLDialogElement>;
	banList: dbAllBansReturn;
	updateBanList: () => Promise<void>;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<
		dbAllBansReturn[0] | undefined
	>();
	const unbanPlayerModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	function closePopUp() {
		banListModal.current.close();
	}
	return (
		<dialog ref={banListModal} className="modal">
			<div className="modal-box h-3/4 w-11/12 max-w-[70rem] bg-zinc-900 md:w-2/3">
				{/*  Dummy element to remove auto focus */}
				<a href="#" className="opacity-0"></a>
				<p className="pb-5 text-xl font-bold">All Active Bans</p>
				<div className="overflow-x-auto">
					<table className="table">
						<thead className="text-slate-300">
							<tr className="border-slate-300 border-opacity-30">
								<th>Name</th>
								<th>IP</th>
								<th>Reason</th>
								<th>Ends on</th>
							</tr>
						</thead>
						<tbody>
							{banList.map((ban) => {
								return (
									<BanItemList
										key={ban.id}
										banItem={ban}
										setSelectedPlayer={setSelectedPlayer}
										unbanPlayerModal={unbanPlayerModal}
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
			<UnbanPlayerPopUp
				player={selectedPlayer}
				unbanPlayerModal={unbanPlayerModal}
				updateBanList={updateBanList}
			/>
		</dialog>
	);
}

function BanItemList({
	banItem,
	setSelectedPlayer,
	unbanPlayerModal
}: {
	banItem: dbAllBansReturn[0];
	setSelectedPlayer: (player: dbAllBansReturn[0]) => void;
	unbanPlayerModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<tr className="border-slate-300 border-opacity-30 text-base">
			<th>
				<a
					className="link link-primary"
					target={'_blank'}
					href={`https://steamcommunity.com/profiles/${banItem.player_steamid}/`}
				>
					{banItem.player_name}
				</a>
			</th>
			<td className="font-semibold">
				<a
					className="link link-primary"
					target={'_blank'}
					href={`https://whatismyipaddress.com/ip/${banItem.player_ip}/`}
				>
					{banItem.player_ip}
				</a>
			</td>
			<td className="font-semibold">{banItem.reason}</td>
			{banItem.duration == 0 ? (
				<td className="font-semibold">Permanent</td>
			) : (
				<td className="font-semibold">
					{new Date(banItem.ends).toLocaleString('en-US', {
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
						setSelectedPlayer(banItem);
						unbanPlayerModal.current.showModal();
					}}
					className="btn btn-error h-9 min-h-0"
				>
					Unban
				</button>
			</td>
		</tr>
	);
}

function UnbanPlayerPopUp({
	player,
	unbanPlayerModal,
	updateBanList
}: {
	player: dbAllBansReturn[0] | undefined;
	unbanPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	updateBanList: () => Promise<void>;
}) {
	const unbanPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (player?.player_steamid) {
			fetch('/api/rcon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					command: `css_unban ${player.player_steamid}`
				})
			});
		} else {
			fetch('/api/rcon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					command: `css_unban ${player?.player_ip}`
				})
			});
		}
		closePopUp();
		setTimeout(() => {
			updateBanList();
		}, 500);
	};

	function closePopUp() {
		unbanPlayerModal.current.close();
	}

	return (
		<dialog ref={unbanPlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Unban Player</h3>
				<p>Are you sure you want to unban "{player?.player_name}"?</p>
				<button onClick={unbanPlayer} className="btn btn-error mt-5 w-full">
					UNBAN
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
