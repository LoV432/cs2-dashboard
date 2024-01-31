import { useRef } from 'react';
import { execRcon } from '../lib/exec-rcon';
import { searchSteamIDFromAdminPlugin } from '../lib/get-steamid';

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
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const immunityRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const flagsRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	async function makeAdmin(time: number, adminFlags: string, immunity: number) {
		const playerList = (await execRcon('css_players')) || '';
		const userSteamId = searchSteamIDFromAdminPlugin(playerList, playerName);
		if (userSteamId == '' || userSteamId == '0') {
			alert('SteamID not found');
		}
		await execRcon(
			`css_addadmin ${userSteamId} "${playerName}" "${adminFlags}" ${immunity} ${time}`
		);
		await execRcon('css_reladmin');
		closePopUp();
		adminPanelModal.current.close();
	}

	function closePopUp() {
		modalRef.current.close();
		timeRef.current.value = '';
		flagsRef.current.value = '';
		immunityRef.current.value = '';
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
						Number(immunityRef.current.value) || 0
					);
				}}
			>
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
		await execRcon(`css_vip_adduser "${steamId}" "${groupName}" ${time}`);
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
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const playerNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const idRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const immunityRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const adminFlagsRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	async function addAdmin(
		time: number,
		steamId: string,
		playerName: string,
		adminFlags: string,
		immunity: number
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
			`css_addadmin ${steamId} "${playerName}" "${adminFlags}" ${immunity} ${time}`
		);
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
						Number(immunityRef.current.value) || 0
					);
				}}
			>
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
