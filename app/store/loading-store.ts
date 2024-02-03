import { atom } from 'recoil';

type loadingStore = boolean;

export const loadingPlayersStore = atom({
	key: 'loadingPlayersStore',
	default: false as loadingStore
});

export const loadingServerStore = atom({
	key: 'loadingServerStore',
	default: false as loadingStore
});
