import { useRef } from 'react';
import { Player } from '../lib/parse-players';

export default function AdminPanel({
	adminPanelModal,
	selectedPlayer,
	adminPluginIsEnabled
}: {
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
	selectedPlayer: Player | null;
	adminPluginIsEnabled: boolean;
}) {
	const kickPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
	const banPlayerModal = useRef() as React.MutableRefObject<HTMLDialogElement>;
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
						{adminPluginIsEnabled ? (
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
								<p>
									You can enable all the options by installing{' '}
									<a
										className="link link-primary"
										target="_blank"
										href="https://github.com/daffyyyy/CS2-SimpleAdmin"
									>
										CS2-SimpleAdmin
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
							</>
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
	const banTime = useRef() as React.MutableRefObject<HTMLInputElement>;
	const banReason = useRef() as React.MutableRefObject<HTMLInputElement>;
	const banPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		const time = Number(banTime.current.value) | 0;
		const reason = String(banReason.current.value) || 'Good Reason';
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `css_ban #${player.id} ${time} "${reason}"`
			})
		});
		banTime.current.value = '';
		closePopUp();
		adminPanelModal.current.close();
	};

	function closePopUp() {
		banPlayerModal.current.close();
		banTime.current.value = '';
		banReason.current.value = '';
	}

	return (
		<dialog ref={banPlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Ban Player</h3>
				<p>Are you sure you want to ban "{player.name}"?</p>
				<input
					ref={banTime}
					className="input mt-5 w-full"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					ref={banReason}
					className="input mt-5 w-full"
					placeholder="Ban Reason"
				></input>
				<button onClick={banPlayer} className="btn btn-error mt-5 w-full">
					BAN
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

function KickPlayerPopUp({
	player,
	kickPlayerModal,
	adminPanelModal
}: {
	player: Player;
	kickPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const kickPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `kickid ${player.id}`
			})
		});
		closePopUp();
		adminPanelModal.current.close();
	};

	function closePopUp() {
		kickPlayerModal.current.close();
	}

	return (
		<dialog ref={kickPlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Kick Player</h3>
				<p>Are you sure you want to kick "{player.name}"?</p>
				<button onClick={kickPlayer} className="btn btn-error mt-5 w-full">
					KICK
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

function SlayPlayerPopUp({
	player,
	slayPlayerModal,
	adminPanelModal
}: {
	player: Player;
	slayPlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const slayPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `css_slay #${player.id}`
			})
		});
		closePopUp();
		adminPanelModal.current.close();
	};

	function closePopUp() {
		slayPlayerModal.current.close();
	}

	return (
		<dialog ref={slayPlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Slay Player</h3>
				<p>Are you sure you want to slay "{player.name}"?</p>
				<button onClick={slayPlayer} className="btn btn-error mt-5 w-full">
					SLAY
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

function MutePlayerPopUp({
	player,
	mutePlayerModal,
	adminPanelModal
}: {
	player: Player;
	mutePlayerModal: React.MutableRefObject<HTMLDialogElement>;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const muteTime = useRef() as React.MutableRefObject<HTMLInputElement>;
	const muteReason = useRef() as React.MutableRefObject<HTMLInputElement>;
	const mutePlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
		const time = Number(muteTime.current.value) | 0;
		const reason = String(muteReason.current.value) || 'Good Reason';
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `css_mute #${player.id} ${time} "${reason}"`
			})
		});
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `css_gag #${player.id} ${time} "${reason}"`
			})
		});
		closePopUp();
		adminPanelModal.current.close();
	};

	function closePopUp() {
		mutePlayerModal.current.close();
		muteTime.current.value = '';
		muteReason.current.value = '';
	}

	return (
		<dialog ref={mutePlayerModal} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold">Mute Player</h3>
				<p>Are you sure you want to mute "{player.name}"?</p>
				<input
					ref={muteTime}
					className="input mt-5 w-full"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					ref={muteReason}
					className="input mt-5 w-full"
					placeholder="Mute Reason"
				></input>
				<button onClick={mutePlayer} className="btn btn-error mt-5 w-full">
					MUTE
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
