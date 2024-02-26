'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { execRcon } from '../../../lib/exec-rcon';
import { activeServerStore } from '../../../store/active-server-store';
import { addConsoleMessage } from '../../../lib/get-server-messages';

export default function SendMessage({
	updateChat
}: {
	updateChat: () => Promise<void>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const sendButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const inputValueRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	async function sendMessaage(
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.KeyboardEvent<HTMLInputElement>
	) {
		if (e.currentTarget.getAttribute('disabled') == 'true') return;
		const message = inputValueRef.current.value;
		if (message.trim().length === 0) return;
		sendButtonRef.current.setAttribute('disabled', 'true');
		inputValueRef.current.value = '';

		const commandExec = await execRcon(`say ${message}`, activeServer);

		if (commandExec) {
			await addConsoleMessage(activeServer, message);
			await updateChat();
		}
		sendButtonRef.current.removeAttribute('disabled');
	}

	function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
		switch (e.key) {
			case 'Enter':
				sendMessaage(e);
				break;

			default:
				break;
		}
	}

	function focusInputWithBackTick(e: Event) {
		const event = e as unknown as React.KeyboardEvent<HTMLInputElement>;
		if (event.key == '`') {
			// This is a hacky solution to prevent ` from being added into the input value.
			setTimeout(() => {
				inputValueRef.current.focus();
			}, 1);
		}
	}

	useEffect(() => {
		// Using this event listener becuase default React event object is passive.
		// Which means you can't preventDefault() or stopPropagation() on it.
		window.addEventListener('keydown', focusInputWithBackTick);
		return () => {
			window.removeEventListener('keydown', focusInputWithBackTick);
		};
	}, []);

	return (
		<>
			<div className="join mt-2 flex justify-center pb-1">
				<div className="w-4/6">
					<div>
						<input
							onKeyDown={handleInput}
							ref={inputValueRef}
							className="input join-item input-bordered w-full"
							placeholder="Type Message..."
						/>
					</div>
				</div>
				<div className="indicator w-1/5">
					<button
						ref={sendButtonRef}
						onClick={(e) => sendMessaage(e)}
						className="btn join-item w-full"
					>
						Send
					</button>
				</div>
			</div>
		</>
	);
}
