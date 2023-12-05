'use client';

import { useEffect, useRef, useState } from 'react';
import { chatStore as chatStoreImport } from '../store/chat-store';
import { useRecoilState } from 'recoil';
import Suggestions from './Suggestions.server';

export default function SendCommand() {
	const [, setChatStore] = useRecoilState(chatStoreImport);
	const [suggestionText, setSuggestionText] = useState('');
	const sendButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const inputValueRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const suggestionsDiv = useRef() as React.MutableRefObject<HTMLDivElement>;

	function positionSuggestionDiv() {
		try {
			suggestionsDiv.current.style.position = 'absolute';
			suggestionsDiv.current.style.left =
				inputValueRef.current.offsetLeft + 50 + 'px';
			suggestionsDiv.current.style.top =
				inputValueRef.current.offsetTop +
				inputValueRef.current.offsetHeight +
				'px';
		} catch {}
	}

	useEffect(() => {
		positionSuggestionDiv();
		addEventListener('resize', positionSuggestionDiv);
		return () => {
			removeEventListener('resize', positionSuggestionDiv);
		};
	}, []);

	async function postCommand(
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.KeyboardEvent<HTMLInputElement>
	) {
		if (e.currentTarget.getAttribute('disabled') == 'true') return;
		const command = inputValueRef.current.value;
		inputValueRef.current.value = '';
		setSuggestionText('');
		sendButtonRef.current.setAttribute('disabled', 'true');

		if (command === 'clear') {
			setChatStore([]);
			sendButtonRef.current.removeAttribute('disabled');
			return;
		}

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
	}

	return (
		<>
			<div className="w-4/6">
				<div>
					<input
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								postCommand(e);
							} else if (e.key === 'Escape') {
								setSuggestionText('');
							}
						}}
						onChange={(e) => {
							setSuggestionText(e.target.value);
						}}
						ref={inputValueRef}
						className="input join-item input-bordered w-full"
						placeholder="Type Command..."
					/>
					<div
						ref={suggestionsDiv}
						tabIndex={-1}
						className="absolute flex max-h-72 flex-col place-items-center overflow-scroll"
					>
						<Suggestions
							setSuggestionText={setSuggestionText}
							suggestionText={suggestionText}
							inputValueRef={inputValueRef}
						/>
					</div>
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
