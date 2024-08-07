'use client';

import { useEffect, useRef, useState } from 'react';
import { commandChatHistory } from './CommandBubbles';
import Suggestions from './Suggestions.server';
import { execRcon } from '../../../lib/exec-rcon';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext } from 'react';

type commandHistory = string[];

export default function SendCommand({
	setCommandChatHistory
}: {
	setCommandChatHistory: React.Dispatch<
		React.SetStateAction<commandChatHistory>
	>;
}) {
	const activeServer = useContext(ActiveServerContext);
	const [suggestionText, setSuggestionText] = useState('');
	const [commandsHistory, setCommandsHistory] = useState<commandHistory>([]);
	const commandsHistoryIndex = useRef(0);
	const sendButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const inputValueRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const suggestionsContainerRef =
		useRef() as React.MutableRefObject<HTMLDivElement>;

	async function postCommand() {
		if (sendButtonRef.current.getAttribute('disabled') == 'true') return;
		const command = inputValueRef.current.value;
		if (command.trim().length === 0) return;
		sendButtonRef.current.setAttribute('disabled', 'true');
		inputValueRef.current.value = '';
		setSuggestionText('');
		setCommandsHistory((prev) => [...prev, command]);
		commandsHistoryIndex.current = commandsHistory.length + 1;

		if (command === 'clear' || command === 'clear ') {
			setCommandChatHistory([]);
			sendButtonRef.current.removeAttribute('disabled');
			return;
		}

		setCommandChatHistory((prev) => [
			...prev,
			{
				id: Date.now(),
				text: command ? command : 'No command entered',
				type: 'chat-end',
				serverIndex: activeServer
			}
		]);
		const commandExec = await execRcon(command, activeServer);
		const commandReply =
			commandExec !== false
				? commandExec
				: 'Command failed to exec. Check server logs for more info.';
		setCommandChatHistory((prev) => [
			...prev,
			{
				id: Date.now(),
				text: commandReply,
				type: 'chat-start',
				serverIndex: activeServer
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
				postCommand();
				break;

			case 'ArrowUp': {
				e.preventDefault();
				const totalCommands = commandsHistory.length;
				const nextIndex = commandsHistoryIndex.current - 1;
				if (totalCommands < 0 || nextIndex < 0) {
					break;
				}
				setSuggestionText(commandsHistory[nextIndex]);
				inputValueRef.current.value = commandsHistory[nextIndex];
				commandsHistoryIndex.current = nextIndex;
				break;
			}

			case 'ArrowDown': {
				e.preventDefault();
				const totalCommands = commandsHistory.length;
				const nextIndex = commandsHistoryIndex.current + 1;
				if (totalCommands < 0 || nextIndex >= totalCommands) {
					break;
				}
				setSuggestionText(commandsHistory[nextIndex]);
				inputValueRef.current.value = commandsHistory[nextIndex];
				commandsHistoryIndex.current = nextIndex;
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
				commandsHistoryIndex.current = commandsHistory.length;
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
		commandsHistoryIndex.current = commandsHistory.length;
	}, [activeServer]);

	useEffect(() => {
		// Using this event listener becuase default React event object is passive.
		// Which means you can't preventDefault() or stopPropagation() on it.
		suggestionsContainerRef.current.addEventListener(
			'wheel',
			handleSuggestionScroll
		);
		window.addEventListener('keydown', focusInputWithBackTick);
		return () => {
			if (suggestionsContainerRef.current) {
				suggestionsContainerRef.current.removeEventListener(
					'wheel',
					handleSuggestionScroll
				);
			}
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
			<div className="join flex justify-center pb-1">
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
						onClick={postCommand}
						className="btn join-item w-full"
					>
						Send
					</button>
				</div>
			</div>
		</>
	);
}
