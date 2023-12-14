'use client';

import { useEffect, useRef, useState } from 'react';
import { chatStore as chatStoreImport } from '../store/chat-store';
import { useRecoilState } from 'recoil';
import Suggestions from './Suggestions.server';

export default function SendCommand() {
	const [, setChatStore] = useRecoilState(chatStoreImport);
	const [suggestionText, setSuggestionText] = useState('');
	const [commandsHistory, setCommandsHistory] = useState<string[]>([]);
	const [commandsHistoryIndex, setCommandsHistoryIndex] = useState(0);
	const sendButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const inputValueRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const suggestionsContainerRef =
		useRef() as React.MutableRefObject<HTMLDivElement>;

	async function postCommand(
		e:
			| React.MouseEvent<HTMLButtonElement>
			| React.KeyboardEvent<HTMLInputElement>
	) {
		if (e.currentTarget.getAttribute('disabled') == 'true') return;
		const command = inputValueRef.current.value;
		if (command.trim().length === 0) return;
		sendButtonRef.current.setAttribute('disabled', 'true');
		inputValueRef.current.value = '';
		setSuggestionText('');
		setCommandsHistory([...commandsHistory, command]);
		setCommandsHistoryIndex(commandsHistory.length + 1);

		if (command === 'clear' || command === 'clear ') {
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

	function handleSuggestionScroll(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		const element = e as unknown as React.WheelEvent<HTMLDivElement>;
		if (element.deltaY > 0) element.currentTarget.scrollLeft += 100;
		else element.currentTarget.scrollLeft -= 100;
	}

	function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
		switch (e.key) {
			case 'Enter':
				postCommand(e);
				break;

			case 'ArrowUp': {
				e.preventDefault();
				const totalCommands = commandsHistory.length;
				const nextIndex = commandsHistoryIndex - 1;
				if (totalCommands < 0 || nextIndex < 0) {
					break;
				}
				setSuggestionText(commandsHistory[nextIndex]);
				inputValueRef.current.value = commandsHistory[nextIndex];
				setCommandsHistoryIndex(nextIndex);
				break;
			}

			case 'ArrowDown': {
				e.preventDefault();
				const totalCommands = commandsHistory.length;
				const nextIndex = commandsHistoryIndex + 1;
				if (totalCommands < 0 || nextIndex >= totalCommands) {
					break;
				}
				setSuggestionText(commandsHistory[nextIndex]);
				inputValueRef.current.value = commandsHistory[nextIndex];
				setCommandsHistoryIndex(nextIndex);
				break;
			}

			case 'Escape':
				setSuggestionText('');
				break;

			case 'Tab':
				e.preventDefault();
				const suggestionsElements = document.querySelectorAll(
					'.suggestions'
				) as NodeListOf<HTMLButtonElement>;
				if (suggestionsElements[0]) {
					suggestionsElements[0].focus();
				} else {
					sendButtonRef.current.focus();
				}
				break;

			default:
				setCommandsHistoryIndex(commandsHistory.length);
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
		suggestionsContainerRef.current.addEventListener(
			'wheel',
			handleSuggestionScroll
		);
		window.addEventListener('keydown', focusInputWithBackTick);
		return () => {
			suggestionsContainerRef.current.removeEventListener(
				'wheel',
				handleSuggestionScroll
			);
			window.removeEventListener('keydown', focusInputWithBackTick);
		};
	}, []);

	return (
		<>
			<div
				tabIndex={-1}
				ref={suggestionsContainerRef}
				className="no-scrollbar my-2 mt-auto flex min-h-[3.5rem] w-full flex-row overflow-x-scroll"
			>
				<Suggestions
					setSuggestionText={setSuggestionText}
					suggestionText={suggestionText}
					inputValueRef={inputValueRef}
				/>
			</div>
			<div className="join flex justify-center">
				<div className="w-4/6">
					<div>
						<input
							onKeyDown={handleInput}
							onChange={(e) => {
								setSuggestionText(e.target.value);
							}}
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
			</div>
		</>
	);
}
