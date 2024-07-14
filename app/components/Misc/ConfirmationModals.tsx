import { useEffect, useRef, useState } from 'react';
import { execRcon } from '../../lib/exec-rcon';
import { searchSteamIDFromAdminPlugin } from '../../lib/get-steamid';
import { reloadAllServerAdmin } from '../../lib/reload-admin-vip';
import { getMapsList } from '../../lib/get-public-configs';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext } from 'react';
export function ConfirmationModal({
	modalName,
	modalRef,
	playerName,
	modalAction
}: {
	modalName: string;
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	playerName: string;
	modalAction: () => void;
}) {
	function closePopUp() {
		modalRef.current.close();
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">{modalName} Player</h3>
			<p className="break-all">
				Are you sure you want to {modalName} "{playerName}"?
			</p>
			<button onClick={modalAction} className="btn btn-error mt-5 w-full">
				{modalName.toUpperCase()}
			</button>
		</ConfirmationModalWrapper>
	);
}
export function DeleteVipConfirmationModal({
	modalRef,
	playerName,
	modalAction
}: {
	modalName: string;
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	playerName: string;
	modalAction: () => void;
}) {
	function closePopUp() {
		modalRef.current.close();
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Remove VIP</h3>
			<p className="break-all">
				Are you sure you want to remove "{playerName}" from VIP list?
			</p>
			<button onClick={modalAction} className="btn btn-error mt-5 w-full">
				REMOVE VIP
			</button>
		</ConfirmationModalWrapper>
	);
}

export function ConfirmationModalWithInput({
	modalName,
	modalRef,
	playerName,
	modalAction
}: {
	modalName: string;
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	playerName: string;
	modalAction: (time: number, reason: string) => void;
}) {
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const reasonRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		reasonRef.current.value = '';
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">{modalName} Player</h3>
			<p className="break-all">
				Are you sure you want to {modalName} "{playerName}"?
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					modalAction(
						Number(timeRef.current.value) | 0,
						String(reasonRef.current.value) || 'Good Reason'
					);
					timeRef.current.value = '';
					reasonRef.current.value = '';
				}}
			>
				<input
					ref={timeRef}
					className="input mt-5 w-full"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					ref={reasonRef}
					className="input mt-5 w-full"
					placeholder="Reason"
				></input>
				<button type="submit" className="btn btn-error mt-5 w-full">
					{modalName.toUpperCase()}
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function ConfirmationModalVip({
	modalRef,
	playerName,
	modalAction
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	playerName: string;
	modalAction: (time: number, group: string) => void;
}) {
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const groupRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		groupRef.current.value = '';
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Make Player VIP</h3>
			<p className="break-all">
				Are you sure you want to make "{playerName}" VIP?
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (groupRef.current.value == null || groupRef.current.value == '')
						return;
					modalAction(
						Number(timeRef.current.value) | 0,
						String(groupRef.current.value)
					);
					timeRef.current.value = '';
					groupRef.current.value = '';
				}}
			>
				<input
					ref={timeRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Time in seconds/0 perm"
				></input>
				<input
					required
					ref={groupRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="VIP Group*"
				></input>
				<button type="submit" className="btn btn-success mt-5 w-full">
					MAKE VIP
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function ConfirmationModalAdmin({
	modalRef,
	playerName,
	adminPanelModal
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	playerName: string;
	adminPanelModal: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const immunityRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const flagsRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const isGlobalRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	async function makeAdmin(
		time: number,
		adminFlags: string,
		immunity: number,
		isGlobal: boolean
	) {
		const playerList = (await execRcon('css_players', activeServer)) || '';
		const userSteamId = searchSteamIDFromAdminPlugin(playerList, playerName);
		if (userSteamId == '' || userSteamId == '0') {
			alert('SteamID not found');
		}
		await execRcon(
			`css_addadmin ${userSteamId} "${playerName}" "${adminFlags}" ${immunity} ${time} ${isGlobal ? '-g' : ''}`,
			activeServer
		);
		if (isGlobal) {
			reloadAllServerAdmin();
		} else {
			await execRcon('css_reladmin', activeServer);
		}
		closePopUp();
		adminPanelModal.current.close();
	}

	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		flagsRef.current.value = '';
		immunityRef.current.value = '';
		isGlobalRef.current.checked = false;
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Make Player ADMIN</h3>
			<p className="break-all">
				Are you sure you want to make "{playerName}" ADMIN?
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (flagsRef.current.value == null || flagsRef.current.value == '')
						return;
					makeAdmin(
						Number(timeRef.current.value) || 0,
						String(flagsRef.current.value),
						Number(immunityRef.current.value) || 0,
						isGlobalRef.current.checked
					);
				}}
			>
				<label className="label mt-5 cursor-pointer justify-start gap-5">
					<span className="label-text">Global Admin</span>
					<input
						className="checkbox-error checkbox"
						ref={isGlobalRef}
						type="checkbox"
						name="isGlobal"
					/>
				</label>
				<input
					ref={timeRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					required
					ref={flagsRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Admin flags/groups*"
				></input>
				<input
					ref={immunityRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Immunity (Defaults to 0)"
				></input>
				<button type="submit" className="btn btn-success mt-5 w-full">
					MAKE ADMIN
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function AddVipManualModal({
	modalRef,
	updateVipsList
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	updateVipsList: () => Promise<void>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const groupRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const idRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	async function addVip(time: number, groupName: string, steamId: string) {
		if (
			groupName == null ||
			groupName == '' ||
			steamId == null ||
			steamId == ''
		) {
			return;
		}
		await execRcon(
			`css_vip_adduser "${steamId}" "${groupName}" ${time}`,
			activeServer
		);
		execRcon('css_vip_reload', activeServer);
		updateVipsList();
		closePopUp();
	}
	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		groupRef.current.value = '';
		idRef.current.value = '';
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Add New VIP</h3>
			You can read more about it{' '}
			<a
				className="link link-primary"
				href="https://github.com/partiusfabaa/cs2-VIPCore"
				target="_blank"
			>
				here.
			</a>{' '}
			It uses the "css_vip_adduser" command.
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addVip(
						Number(timeRef.current.value) | 0,
						String(groupRef.current.value),
						String(idRef.current.value)
					);
				}}
			>
				<input
					required
					ref={idRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Player steamid or accountid*"
				></input>
				<input
					ref={timeRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Time in seconds/0 perm"
				></input>
				<input
					required
					ref={groupRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="VIP Group*"
				></input>
				<button type="submit" className="btn btn-success mt-5 w-full">
					MAKE VIP
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function AddAdminManualModal({
	modalRef,
	updateAdminsList
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	updateAdminsList: () => Promise<void>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const playerNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const idRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const immunityRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const adminFlagsRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const isGlobalRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	async function addAdmin(
		time: number,
		steamId: string,
		playerName: string,
		adminFlags: string,
		immunity: number,
		isGlobal: boolean
	) {
		if (
			adminFlags == null ||
			adminFlags == '' ||
			playerName == null ||
			playerName == '' ||
			steamId == null ||
			steamId == ''
		) {
			return;
		}
		await execRcon(
			`css_addadmin ${steamId} "${playerName}" "${adminFlags}" ${immunity} ${time} ${isGlobal ? '-g' : ''}`,
			activeServer
		);
		if (isGlobal) {
			reloadAllServerAdmin();
		} else {
			await execRcon('css_reladmin', activeServer);
		}
		updateAdminsList();
		closePopUp();
	}
	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		playerNameRef.current.value = '';
		idRef.current.value = '';
		immunityRef.current.value = '';
		adminFlagsRef.current.value = '';
		isGlobalRef.current.checked = false;
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Add New ADMIN</h3>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addAdmin(
						Number(timeRef.current.value) || 0,
						String(idRef.current.value),
						String(playerNameRef.current.value),
						String(adminFlagsRef.current.value),
						Number(immunityRef.current.value) || 0,
						isGlobalRef.current.checked
					);
				}}
			>
				<label className="label mt-5 cursor-pointer justify-start gap-5">
					<span className="label-text">Global Admin</span>
					<input
						className="checkbox-error checkbox"
						ref={isGlobalRef}
						type="checkbox"
						name="isGlobal"
					/>
				</label>
				<input
					required
					ref={idRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Player SteamID*"
				></input>
				<input
					required
					ref={playerNameRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Player Name*"
				></input>
				<input
					ref={timeRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					required
					ref={adminFlagsRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Admin flags/groups*"
				></input>
				<input
					ref={immunityRef}
					className="input mt-5 w-full placeholder:text-slate-500"
					placeholder="Immunity (Defaults to 0)"
				></input>
				<button type="submit" className="btn btn-success mt-5 w-full">
					MAKE ADMIN
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function ConfirmationModalChangeMap({
	modalRef
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const [mapsList, setMapsList] = useState<Array<[string, string]>>([]);
	const mapNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const mapNameSelectRef =
		useRef() as React.MutableRefObject<HTMLSelectElement>;
	function changeMap(mapName: string) {
		if (mapName == '' || mapName == 'Select Map') return;
		execRcon(`css_map ${mapName}`, activeServer);
		closePopUp();
	}
	function closePopUp() {
		modalRef.current.close();
		mapNameRef.current.value = '';
		mapNameSelectRef.current.value = 'Select Map';
	}
	useEffect(() => {
		(async () => {
			const fetchedMapsList = await getMapsList(activeServer);
			if (fetchedMapsList) {
				setMapsList(fetchedMapsList);
			}
		})();
	}, [activeServer]);
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Change Map</h3>
			<p className="">
				Use "ws:id/name" for a workshop map. You can read more about it{' '}
				<a
					href="https://github.com/daffyyyy/CS2-SimpleAdmin/"
					target="_blank"
					className="link link-primary"
				>
					here
				</a>
				. It uses the "css_map" command
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					changeMap(
						String(mapNameRef.current.value || mapNameSelectRef.current.value)
					);
				}}
			>
				{mapsList.length > 0 ? (
					<>
						<select
							defaultValue={'Select Map'}
							ref={mapNameSelectRef}
							className="select select-bordered mt-5 w-full min-w-full max-w-xs"
						>
							<option className="text-lg" value={'Select Map'} disabled>
								Select Map
							</option>
							{mapsList.map((map) => {
								return (
									<option className="text-lg" key={map[1]} value={map[0]}>
										{map[1]}
									</option>
								);
							})}
						</select>
						<h1 className="divider">OR</h1>
						<input
							ref={mapNameRef}
							className="input w-full"
							placeholder="Custom Map"
						></input>
					</>
				) : (
					<>
						<select
							defaultValue={'Select Map'}
							ref={mapNameSelectRef}
							className="hidden"
						>
							<option className="text-lg" value={'Select Map'} disabled>
								Select Map
							</option>
						</select>
						<input
							required
							ref={mapNameRef}
							className="input mt-5 w-full"
							placeholder="Map name*"
						></input>
					</>
				)}
				<button type="submit" className="btn btn-success mt-5 w-full">
					CHANGE MAP
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

export function ConfirmationModalBanMuteManual({
	modalRef,
	updatePunishmentsList
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	updatePunishmentsList: () => Promise<void>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const steamId = useRef() as React.MutableRefObject<HTMLInputElement>;
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const reasonRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const banRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const muteRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const gagRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	function addPunishment(
		steamId: string,
		time: number,
		reason: string,
		ban: boolean,
		mute: boolean,
		gag: boolean
	) {
		if ([ban, mute, gag].filter(Boolean).length === 0) return;
		if (ban)
			execRcon(`css_addban ${steamId} ${time} "${reason}"`, activeServer);
		if (mute)
			execRcon(`css_addmute ${steamId} ${time} "${reason}"`, activeServer);
		if (gag)
			execRcon(`css_addgag ${steamId} ${time} "${reason}"`, activeServer);
		updatePunishmentsList();
		closePopUp();
	}
	function closePopUp() {
		modalRef.current.close();
		steamId.current.value = '';
		timeRef.current.value = '';
		reasonRef.current.value = '';
		banRef.current.checked = false;
		muteRef.current.checked = false;
		gagRef.current.checked = false;
	}
	return (
		<ConfirmationModalWrapper modalRef={modalRef} closePopUp={closePopUp}>
			<h3 className="pb-5 text-lg font-bold capitalize">Add new punishment</h3>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addPunishment(
						String(steamId.current.value),
						Number(timeRef.current.value) | 0,
						String(reasonRef.current.value) || 'Good Reason',
						banRef.current.checked,
						muteRef.current.checked,
						gagRef.current.checked
					);
				}}
			>
				<input
					required
					ref={steamId}
					className="input mt-5 w-full"
					placeholder="SteamID*"
				></input>
				<input
					ref={timeRef}
					className="input mt-5 w-full"
					placeholder="Time in minutes/0 perm"
				></input>
				<input
					ref={reasonRef}
					className="input mt-5 w-full"
					placeholder="Reason"
				></input>
				<div className="mt-3 w-32">
					<label className="label cursor-pointer">
						<span className="label-text">Ban</span>
						<input
							ref={banRef}
							type="checkbox"
							className="toggle toggle-error"
						/>
					</label>
				</div>
				<div className="w-32">
					<label className="label cursor-pointer">
						<span className="label-text">Mute</span>
						<input
							ref={muteRef}
							type="checkbox"
							className="toggle toggle-error"
						/>
					</label>
				</div>
				<div className="w-32">
					<label className="label cursor-pointer">
						<span className="label-text">Gag</span>
						<input
							ref={gagRef}
							type="checkbox"
							className="toggle toggle-error"
						/>
					</label>
				</div>
				<button type="submit" className="btn btn-error mt-5 w-full">
					ADD
				</button>
			</form>
		</ConfirmationModalWrapper>
	);
}

function ConfirmationModalWrapper({
	modalRef,
	closePopUp,
	children
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
	closePopUp: () => void;
	children: React.ReactNode;
}) {
	return (
		<dialog ref={modalRef} className="modal">
			<div className="modal-box bg-zinc-900">
				{children}
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
