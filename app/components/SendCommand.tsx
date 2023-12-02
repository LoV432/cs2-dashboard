'use client';

import { useRef } from 'react';
import { chatStore as chatStoreImport } from '../store/chat-store';
import { useRecoilState } from 'recoil';

export default function SendCommand() {
	const [, setChatStore] = useRecoilState(chatStoreImport);
	const sendButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const inputValueRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	async function postCommand(e: React.MouseEvent<HTMLButtonElement>) {
		if (e.currentTarget.getAttribute('disabled') == 'true') return;
		const command = inputValueRef.current.value;
		sendButtonRef.current.setAttribute('disabled', 'true');
		setChatStore((prev) => [
			...prev,
			{
				id: Date.now(),
				text: command ? command : 'No command entered',
				type: 'chat-end'
			}
		]);
		const commandFetch = await fetch('/api/rcon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ command: command })
		});

		const commandReply = await commandFetch.text();
		setChatStore((prev) => [
			...prev,
			{
				id: Date.now(),
				text: commandReply,
				type: 'chat-start'
			}
		]);
		sendButtonRef.current.removeAttribute('disabled');
		inputValueRef.current.value = '';
	}

	return (
		<>
			<div className="w-4/6">
				<div>
					<input
						ref={inputValueRef}
						className="input join-item input-bordered w-full"
						placeholder="Type Command..."
					/>
				</div>
			</div>
			<div className="indicator w-1/5">
				<button
					ref={sendButtonRef}
					onClick={(e) => postCommand(e)}
					className="btn join-item w-full"
				>
					Send
				</button>
			</div>
		</>
	);
}
