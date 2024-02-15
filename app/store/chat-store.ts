import { atom } from 'jotai';

type chatStore = {
	id: number;
	type: 'chat-start' | 'chat-end';
	text: string;
	serverIndex: number;
}[];

export const chatStore = atom([] as chatStore);
