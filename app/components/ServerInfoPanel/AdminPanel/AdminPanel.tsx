import { useRef } from 'react';
import { Player } from '../../../lib/parse-players';
import {
	ConfirmationModalWithInput,
	ConfirmationModal,
	ConfirmationModalVip,
	ConfirmationModalAdmin
} from '../../Misc/ConfirmationModals';
import { execRcon } from '../../../lib/exec-rcon';
import {
	searchSteamIDFromAdminPlugin,
	searchSteamIDFromNative
} from '../../../lib/get-steamid';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../../../store/active-server-store';

export default function AdminPanel({
	adminPanelModal,
	selectedPlayer,
	featureFlags
}: {
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
	selectedPlayer: Player | null;
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
	};
}) {
	const kickPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const banPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const makeVipModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const makeAdminModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const mutePlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const slayPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	function closePopUp() {
		adminPanelModal.current.close();
	}
	if (!selectedPlayer)
		return (
			<dialog ref={adminPanelModal} className="modal">
				<div className="modal-box bg-zinc-900">
					<h3 className="pb-5 text-lg font-bold">Admin Panel</h3>
					<p>No player selected</p>
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
	return (
		<>
			<dialog ref={adminPanelModal} className="modal">
				<div className="modal-box bg-zinc-900">
					<h3 className="pb-5 text-lg font-bold">Admin Panel</h3>
					<div className="flex flex-wrap justify-center gap-5">
						<button
							onClick={() => {
								kickPlayerModal.current.showModal();
							}}
							className="btn btn-outline w-1/3"
						>
							Kick
						</button>
						{featureFlags.adminPluginIsEnabled ? (
							<>
								<button
									onClick={() => {
										banPlayerModal.current.showModal();
									}}
									className="btn btn-outline w-1/3"
								>
									Ban
								</button>
								<button
									onClick={() => {
										mutePlayerModal.current.showModal();
									}}
									className="btn btn-outline w-1/3"
								>
									Mute
								</button>
								<button
									onClick={() => {
										slayPlayerModal.current.showModal();
									}}
									className="btn btn-outline w-1/3"
								>
									Slay
								</button>
								<button
									onClick={() => {
										makeAdminModal.current.showModal();
									}}
									className="btn btn-outline w-1/3"
								>
									Make ADMIN
								</button>
							</>
						) : (
							<>
								<a
									target="_blank"
									href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
									className="btn w-1/3 bg-zinc-800 hover:bg-zinc-800 active:bg-zinc-800"
								>
									Ban
								</a>
								<a
									target="_blank"
									href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
									className="btn w-1/3 bg-zinc-800 hover:bg-zinc-800 active:bg-zinc-800"
								>
									Mute
								</a>
								<a
									target="_blank"
									href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
									className="btn w-1/3 bg-zinc-800 hover:bg-zinc-800 active:bg-zinc-800"
								>
									Slay
								</a>
								<a
									target="_blank"
									href="https://github.com/LoV432/cs2-dashboard/blob/master/SimpleAdmin.md"
									className="btn w-1/3 bg-zinc-800 hover:bg-zinc-800 active:bg-zinc-800"
								>
									Make ADMIN
								</a>
							</>
						)}
						{featureFlags.vipPluginIsEnabled ? (
							<button
								onClick={() => {
									makeVipModal.current.showModal();
								}}
								className="btn btn-outline w-1/3"
							>
								Make VIP
							</button>
						) : (
							<a
								target="_blank"
								href="https://github.com/LoV432/cs2-dashboard/blob/master/VipCore.md"
								className="btn w-1/3 bg-zinc-800 hover:bg-zinc-800 active:bg-zinc-800"
							>
								Make VIP
							</a>
						)}
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
			<KickPlayerPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				kickPlayerModal={kickPlayerModal}
			/>
			<BanPlayerPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				banPlayerModal={banPlayerModal}
			/>
			<MakeVipPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				makeVipModal={makeVipModal}
				featureFlags={featureFlags}
			/>
			<MutePlayerPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				mutePlayerModal={mutePlayerModal}
			/>
			<SlayPlayerPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				slayPlayerModal={slayPlayerModal}
			/>
			<MakeAdminPopUp
				adminPanelModal={adminPanelModal}
				player={selectedPlayer}
				makeAdminModal={makeAdminModal}
			/>
		</>
	);
}

function BanPlayerPopUp({
	player,
	banPlayerModal,
	adminPanelModal
}: {
	player: Player;
	banPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const banPlayer = (time: number, reason: string) => {
		execRcon(`css_ban #${player.id} ${time} "${reason}"`, activeServer);
		banPlayerModal.current.close();
		adminPanelModal.current.close();
	};

	return (
		<ConfirmationModalWithInput
			modalAction={banPlayer}
			modalName="Ban"
			modalRef={banPlayerModal}
			playerName={player.name}
		/>
	);
}

function MakeVipPopUp({
	player,
	makeVipModal,
	adminPanelModal,
	featureFlags
}: {
	player: Player;
	makeVipModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
	};
}) {
	const activeServer = useAtomValue(activeServerStore);
	const makeVip = async (time: number, group: string) => {
		let userSteamId = '';
		if (featureFlags.adminPluginIsEnabled) {
			const playerList = (await execRcon('css_players', activeServer)) || '';
			userSteamId = searchSteamIDFromAdminPlugin(playerList, player.name);
		} else {
			const playerList = (await execRcon('status_json', activeServer)) || '';
			userSteamId = await searchSteamIDFromNative(playerList, player.name);
		}

		if (userSteamId == '' || userSteamId == '0') {
			console.error(
				'User SteamID not found. This seems to be a bug in CS2 "status_json" command where it returns empty SteamID. Restarting CS2 server usually fixes the issue'
			);
			alert(
				'User SteamID not found. This seems to be a bug in CS2 "status_json" command where it returns empty SteamID. Restarting CS2 server usually fixes the issue'
			);
			return;
		}
		execRcon(`css_vip_adduser ${userSteamId} "${group}" ${time}`, activeServer);
		execRcon('css_vip_reload', activeServer);
		makeVipModal.current.close();
		adminPanelModal.current.close();
	};

	return (
		<ConfirmationModalVip
			modalAction={makeVip}
			modalRef={makeVipModal}
			playerName={player.name}
		/>
	);
}

function MakeAdminPopUp({
	player,
	makeAdminModal,
	adminPanelModal
}: {
	player: Player;
	makeAdminModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	return (
		<ConfirmationModalAdmin
			modalRef={makeAdminModal}
			playerName={player.name}
			adminPanelModal={adminPanelModal}
		/>
	);
}

function KickPlayerPopUp({
	player,
	kickPlayerModal,
	adminPanelModal
}: {
	player: Player;
	kickPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const kickPlayer = () => {
		execRcon(`kickid ${player.id}`, activeServer);
		kickPlayerModal.current.close();
		adminPanelModal.current.close();
	};

	return (
		<ConfirmationModal
			modalAction={kickPlayer}
			modalName="kick"
			modalRef={kickPlayerModal}
			playerName={player.name}
		/>
	);
}

function SlayPlayerPopUp({
	player,
	slayPlayerModal,
	adminPanelModal
}: {
	player: Player;
	slayPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const slayPlayer = () => {
		execRcon(`css_slay #${player.id}`, activeServer);
		slayPlayerModal.current.close();
		adminPanelModal.current.close();
	};

	return (
		<ConfirmationModal
			modalAction={slayPlayer}
			modalName="slay"
			modalRef={slayPlayerModal}
			playerName={player.name}
		/>
	);
}

function MutePlayerPopUp({
	player,
	mutePlayerModal,
	adminPanelModal
}: {
	player: Player;
	mutePlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const mutePlayer = (time: number, reason: string) => {
		execRcon(`css_mute #${player.id} ${time} "${reason}"`, activeServer);
		execRcon(`css_gag #${player.id} ${time} "${reason}"`, activeServer);
		mutePlayerModal.current.close();
		adminPanelModal.current.close();
	};

	return (
		<ConfirmationModalWithInput
			modalAction={mutePlayer}
			modalName="Mute"
			modalRef={mutePlayerModal}
			playerName={player.name}
		/>
	);
}
