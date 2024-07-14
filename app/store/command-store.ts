import { atom } from 'jotai';

type commandStore = {
	id: number;
	type: 'chat-start' | 'chat-end';
	text: string;
	serverIndex: number;
}[];

type commandHistory = {
	command: string;
	serverIndex: number;
}[];

export const commandStore = atom([] as commandStore);

const allCommandHistory = atom([] as commandHistory);
export const serverSpecificCommandHistory = atom(
	(get) => {
		const allCommands = get(allCommandHistory);
		// TODO: Temporary bypass for testing
		const serverIndex = 0;
		const filteredCommands = allCommands.filter(
			(command) => command.serverIndex === serverIndex
		);
		return filteredCommands.map((command) => command.command);
	},
	(get, set, command: string) => {
		set(allCommandHistory, [
			...get(allCommandHistory),
			{ command, serverIndex: 0 }
		]);
	}
);
