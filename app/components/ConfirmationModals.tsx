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
		<dialog ref={modalRef} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold capitalize">
					{modalName} Player
				</h3>
				<p>
					Are you sure you want to {modalName} "{playerName}"?
				</p>
				<button onClick={modalAction} className="btn btn-error mt-5 w-full">
					{modalName.toUpperCase()}
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
		<dialog ref={modalRef} className="modal">
			<div className="modal-box bg-zinc-900">
				<h3 className="pb-5 text-lg font-bold capitalize">
					{modalName} Player
				</h3>
				<p>
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
