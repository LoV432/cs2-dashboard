import { atom } from 'recoil';

type activeServerIndexStore = number;

export const activeServerStore = atom({
	key: 'activeServerStore',
	default: 0 as activeServerIndexStore
});
