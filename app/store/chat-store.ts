import { atom } from 'recoil';

type chatStore = {
	id: number;
	type: 'chat-start' | 'chat-end';
	text: string;
}[];

export const chatStore = atom({
	key: 'chatStore',
	default: [] as chatStore
});
