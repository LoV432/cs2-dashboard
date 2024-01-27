import { useRef } from 'react';

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
			<button
				onClick={() => {
					modalAction(
						Number(timeRef.current.value) | 0,
						String(reasonRef.current.value) || 'Good Reason'
					);
				}}
				className="btn btn-error mt-5 w-full"
			>
				{modalName.toUpperCase()}
			</button>
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
			<input
				ref={timeRef}
				className="input mt-5 w-full placeholder:text-slate-500"
				placeholder="Time in seconds/0 perm"
			></input>
			<input
				ref={groupRef}
				className="input mt-5 w-full placeholder:text-slate-500"
				placeholder="VIP Group*"
			></input>
			<button
				onClick={() => {
					if (groupRef.current.value == null || groupRef.current.value == '')
						return;
					modalAction(
						Number(timeRef.current.value) | 0,
						String(groupRef.current.value)
					);
				}}
				className="btn btn-success mt-5 w-full"
			>
				MAKE VIP
			</button>
		</ConfirmationModalWrapper>
	);
}

export function AddVipManualModal({
	modalRef
}: {
	modalRef: React.MutableRefObject<HTMLDialogElement>;
}) {
	const timeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const groupRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const idRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	function addVip(time: number, groupName: string, steamId: string) {
		fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				command: `css_vip_adduser "${steamId}" "${groupName}" ${time}`
			})
		});
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
			<input
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
				ref={groupRef}
				className="input mt-5 w-full placeholder:text-slate-500"
				placeholder="VIP Group*"
			></input>
			<button
				onClick={() => {
					if (
						groupRef.current.value == null ||
						groupRef.current.value == '' ||
						idRef.current.value == null ||
						idRef.current.value == ''
					)
						return;
					addVip(
						Number(timeRef.current.value) | 0,
						String(groupRef.current.value),
						String(idRef.current.value)
					);
				}}
				className="btn btn-success mt-5 w-full"
			>
				MAKE VIP
			</button>
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
