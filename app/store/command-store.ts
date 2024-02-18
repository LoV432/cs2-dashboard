import { atom } from 'jotai';

type commandStore = {
	id: number;
	type: 'chat-start' | 'chat-end';
	text: string;
	serverIndex: number;
}[];

export const commandStore = atom([] as commandStore);
