'use client';
import { allCommands } from '../lib/all-commands';
//@ts-ignore
import relevancy from 'relevancy';

export default function Suggestions({
	suggestionText,
	setSuggestionText,
	inputValueRef
}: {
	suggestionText: string;
	setSuggestionText: React.Dispatch<React.SetStateAction<string>>;
	inputValueRef: React.MutableRefObject<HTMLInputElement>;
}) {
	if (!suggestionText) {
		return null;
	}
	if (suggestionText.endsWith(' ')) {
		return null;
	}

	function autoFill(command: string) {
		inputValueRef.current.value = command + ' ';
		setSuggestionText(command + ' ');
		inputValueRef.current.focus();
	}

	function moveFocus(e: React.KeyboardEvent<HTMLButtonElement>) {
		if (e.key == 'Escape') {
			setSuggestionText('');
			inputValueRef.current.focus();
			return;
		}

		const allSuggestionElements = document.querySelectorAll(
			'.suggestions'
		) as NodeListOf<HTMLButtonElement>;

		if (e.key == 'Tab') {
			e.preventDefault();
			if (e.currentTarget.nextElementSibling) {
				// @ts-ignore
				e.currentTarget.nextElementSibling.focus();
			} else {
				allSuggestionElements[0].focus();
			}
			return;
		}
		if (e.key == 'ArrowDown') {
			e.preventDefault();
			if (e.currentTarget.nextElementSibling) {
				// @ts-ignore
				e.currentTarget.nextElementSibling.focus();
			} else {
				allSuggestionElements[0].focus();
			}
			return;
		}
		if (e.key == 'ArrowUp') {
			e.preventDefault();
			if (e.currentTarget.previousElementSibling) {
				// @ts-ignore
				e.currentTarget.previousElementSibling.focus();
			} else {
				allSuggestionElements[allSuggestionElements.length - 1].focus();
			}
			return;
		}
	}

	let filterdCommands = allCommands.filter((s) => s.includes(suggestionText));
	filterdCommands = relevancy.sort(filterdCommands, suggestionText);

	return filterdCommands.slice(0, 10).map((command) => {
		return (
			<button
				key={command}
				onClick={() => autoFill(command)}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						autoFill(command);
					}
				}}
				onKeyDown={moveFocus}
				className="suggestions btn btn-active mx-3 my-1 rounded border-zinc-700 border-opacity-60 py-2 first:mt-2 last:mb-2"
				tabIndex={0}
			>
				{command}
			</button>
		);
	});
}
