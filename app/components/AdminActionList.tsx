'use client';
import { useEffect, useRef, useState } from 'react';
import {
	getBansAndMutes,
	dbReturnAllPunishmentAction
} from '../lib/get-bans-mutes-list';
import PunishmentsListTable from './PunishmentsListTable';

export default function AdminActionListButton() {
	function closePopUp() {
		adminActionListModal.current.close();
	}
	const [punishmentsList, setPunishmentsList] = useState(
		[] as dbReturnAllPunishmentAction
	);
	const adminActionListModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	const defaultTab = useRef() as React.MutableRefObject<HTMLInputElement>;
	async function updatePunishmentsList() {
		const punishmentsList = await getBansAndMutes();
		if ('error' in punishmentsList) return;
		setPunishmentsList(punishmentsList);
	}
	useEffect(() => {
		defaultTab.current.click(); // TODO: If i put "checked" directly on the HTML Input element the tabs dont switch
		updatePunishmentsList();
	}, []);
	return (
		<div className="flex w-full place-content-center">
			<div
				className="btn btn-outline"
				onClick={() => {
					updatePunishmentsList();
					adminActionListModal.current.showModal();
				}}
			>
				Admin Panel
			</div>
			<dialog ref={adminActionListModal} className="modal">
				<div className="modal-box h-3/4 w-11/12 max-w-[70rem] bg-zinc-900 md:w-2/3">
					{/*  Dummy element to remove auto focus */}
					<a href="#" className="opacity-0"></a>
					<p className="pb-5 text-xl font-bold">Admin Panel</p>
					<div className="overflow-x-auto">
						<div role="tablist" className="tabs tabs-bordered grid-cols-3">
							<input
								ref={defaultTab}
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="tab transition-all checked:bg-zinc-700 hover:bg-zinc-800 checked:hover:bg-zinc-700 focus:outline-0"
								aria-label="Punishments"
							/>
							<div role="tabpanel" className="tab-content pt-5">
								<PunishmentsListTable
									punishmentsList={punishmentsList}
									updatePunishmentsList={updatePunishmentsList}
								/>
							</div>

							<input
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="tab transition-all checked:bg-zinc-700 hover:bg-zinc-800 checked:hover:bg-zinc-700 focus:outline-0"
								aria-label="VIP Members"
							/>
							<div role="tabpanel" className="tab-content pt-5">
								Coming Soon (Maybe)
							</div>

							<input
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="hover:bg-zinc-80 checked:hover:bg-zinc-7000 tab transition-all checked:bg-zinc-700 focus:outline-0"
								aria-label="Admins"
							/>
							<div role="tabpanel" className="tab-content pt-5">
								Coming Soon (Maybe)
							</div>
						</div>
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
		</div>
	);
}
