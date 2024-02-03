import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';
import { number } from '@recoiljs/refine';

export const activeServerStore = atom<number>({
	key: 'activeServerStore',
	effects: [syncEffect({ refine: number() })],
	default: 0
});
