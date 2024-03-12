'use client';
import { useEffect, useRef, useState } from 'react';
import {
	getBansAndMutes,
	dbReturnAllPunishmentAction
} from '../../../lib/get-bans-mutes-list';
import PunishmentsListTable from './PunishmentsListTable';
import { dbReturnAllVipsAction, getVipsList } from '../../../lib/get-vip-list';
import { getAdmins, dbReturnAllAdmins } from '../../../lib/get-admins-list';
import VipsListTable from './VipListTable';
import AdminsListTable from './AdminsListTable';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../../../store/active-server-store';

export default function AdminActionListButton({
	featureFlags
}: {
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
	};
}) {
	const activeServer = useAtomValue(activeServerStore);
	function closePopUp() {
		adminActionListModal.current.close();
	}

	const [punishmentsList, setPunishmentsList] = useState(
		[] as dbReturnAllPunishmentAction
	);
	const [vipsList, setVipsList] = useState([] as dbReturnAllVipsAction);
	const [adminsList, setAdminsList] = useState([] as dbReturnAllAdmins);

	const adminActionListModal =
		useRef() as React.MutableRefObject<HTMLDialogElement>;
	const defaultTab = useRef() as React.MutableRefObject<HTMLInputElement>;

	async function updatePunishmentsList() {
		const punishmentsList = await getBansAndMutes(activeServer);
		if ('error' in punishmentsList) return;
		setPunishmentsList(punishmentsList);
	}
	async function updateVipsList() {
		const vipsList = await getVipsList(activeServer);
		if ('error' in vipsList) return;
		setVipsList(vipsList);
	}
	async function updateAdminsList() {
		const adminsList = await getAdmins(activeServer);
		if ('error' in adminsList) return;
		setAdminsList(adminsList);
	}

	useEffect(() => {
		//defaultTab.current.click(); // TODO: If i put "checked" directly on the HTML Input element the tabs dont switch
		updatePunishmentsList();
		updateVipsList();
		updateAdminsList();
	}, []);
	return (
		<div className="flex w-full place-content-center">
			<div
				className="btn btn-outline"
				onClick={() => {
					updatePunishmentsList();
					updateVipsList();
					updateAdminsList();
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
						<div
							role="tablist"
							className="tabs tabs-bordered grid-cols-3 grid-rows-[auto]"
						>
							<input
								defaultChecked={
									featureFlags.adminPluginIsEnabled ? true : false
								}
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="tab h-12 text-lg font-semibold transition-all after:overflow-hidden after:overflow-ellipsis checked:bg-zinc-700 hover:bg-zinc-800 checked:hover:bg-zinc-700 focus:outline-0"
								aria-label="Punishments"
								onClick={updatePunishmentsList}
							/>
							<div role="tabpanel" className="tab-content pt-5">
								{featureFlags.adminPluginIsEnabled ? (
									<PunishmentsListTable
										punishmentsList={punishmentsList}
										updatePunishmentsList={updatePunishmentsList}
									/>
								) : (
									<p>
										<a
											className="link link-primary"
											target="_blank"
											href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
										>
											How to enable this?
										</a>
									</p>
								)}
							</div>

							<input
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="tab h-12 text-lg font-semibold transition-all checked:bg-zinc-700 hover:bg-zinc-800 checked:hover:bg-zinc-700 focus:outline-0"
								aria-label="Admins"
								onClick={updateAdminsList}
							/>
							<div role="tabpanel" className="tab-content pt-5">
								{featureFlags.adminPluginIsEnabled ? (
									<AdminsListTable
										adminsList={adminsList}
										updateAdminsList={updateAdminsList}
									/>
								) : (
									<p>
										<a
											className="link link-primary"
											target="_blank"
											href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
										>
											How to enable this?
										</a>
									</p>
								)}
							</div>

							<input
								defaultChecked={
									featureFlags.adminPluginIsEnabled ? false : true
								}
								type="radio"
								name="Admin_Action_Borders"
								role="tab"
								className="tab h-12 text-lg font-semibold transition-all checked:bg-zinc-700 hover:bg-zinc-800 checked:hover:bg-zinc-700 focus:outline-0"
								aria-label="VIPs"
								onClick={updateVipsList}
							/>
							<div role="tabpanel" className="tab-content pt-5">
								{featureFlags.vipPluginIsEnabled ? (
									<VipsListTable
										vipsList={vipsList}
										updateVipsList={updateVipsList}
									/>
								) : (
									<p>
										<a
											className="link link-primary"
											target="_blank"
											href="https://github.com/LoV432/cs2-dashboard/blob/master/VipCore.md"
										>
											How to enable this?
										</a>
									</p>
								)}
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
