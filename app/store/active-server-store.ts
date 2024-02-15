import { atomWithLocation } from 'jotai-location';
import { atom } from 'jotai';

const locationAtom = atomWithLocation();

export const activeServerStore = atom(
	(get) => Number(get(locationAtom).searchParams?.get('SelectedServer') || 0),
	(get, set, newValue: number) => {
		try {
			set(locationAtom, (prev) => ({
				...prev,
				searchParams: new URLSearchParams([
					['SelectedServer', String(newValue) || '0']
				])
			}));
		} catch {}
	}
);
