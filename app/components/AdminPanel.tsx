import { useRef } from 'react';
import { Player } from '../lib/parse-players';
import {
	ConfirmationModalWithInput,
	ConfirmationModal,
	ConfirmationModalVip
} from './ConfirmationModals';
import { execRcon } from '../lib/exec-rcon';

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
							</>
						) : (
							<>
								<button className="btn btn-disabled btn-outline w-1/3">
									Ban
								</button>
								<button className="btn btn-disabled btn-outline w-1/3">
									Mute
								</button>
								<button className="btn btn-disabled btn-outline w-1/3">
									Slay
								</button>
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
							<button className="btn btn-disabled btn-outline w-1/3">
								Make VIP
							</button>
						)}
						{!featureFlags.vipPluginIsEnabled ||
						!featureFlags.adminPluginIsEnabled ? (
							<p>
								You can enable all the options by installing{' '}
								<a
									className="link link-primary"
									target="_blank"
									href="https://github.com/daffyyyy/CS2-SimpleAdmin"
								>
									CS2-SimpleAdmin
								</a>{' '}
								and{' '}
								<a
									className="link link-primary"
									target="_blank"
									href="https://github.com/partiusfabaa/cs2-VIPCore"
								>
									cs2-VIPCore
								</a>{' '}
								and then setting the{' '}
								<a
									className="link link-primary"
									target="_blank"
									href="https://github.com/LoV432/cs2-dashboard/blob/master/examples/docker-compose.yml"
								>
									ENV
								</a>{' '}
								to true in your docker_compose.
							</p>
						) : null}
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
	const banPlayer = (time: number, reason: string) => {
		execRcon(`css_ban #${player.id} ${time} "${reason}"`);
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
	adminPanelModal
}: {
	player: Player;
	makeVipModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const makeVip = async (time: number, group: string) => {
		const statusJson = await execRcon('status_json');
		if (!statusJson) return;
		const usersList = (await JSON.parse(statusJson)).server?.clients;
		let userSteamId = '';
		for (const user of usersList) {
			if (user.name == player.name) {
				userSteamId = user.steamid64 as string;
				break;
			}
		}
		if (userSteamId == '' || userSteamId == '0') {
			console.error(
				'User SteamID not found. This seems to be a bug in CS2 "status_json" command where it returns empty SteamID. Restarting CS2 server usually fixes the issue'
			);
			return;
		}
		execRcon(`css_vip_adduser ${userSteamId} "${group}" ${time}`);
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

function KickPlayerPopUp({
	player,
	kickPlayerModal,
	adminPanelModal
}: {
	player: Player;
	kickPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const kickPlayer = () => {
		execRcon(`kickid ${player.id}`);
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
	const slayPlayer = () => {
		execRcon(`css_slay #${player.id}`);
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
	const mutePlayer = (time: number, reason: string) => {
		execRcon(`css_mute #${player.id} ${time} "${reason}"`);
		execRcon(`css_gag #${player.id} ${time} "${reason}"`);
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
