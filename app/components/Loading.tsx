'use client';
import { useRecoilState } from 'recoil';
import {
	loadingPlayersStore,
	loadingServerStore
} from '../store/loading-store';

export default function Loading() {
	const [loadingPlayersCheck] = useRecoilState(loadingPlayersStore);
	const [loadingServerCheck] = useRecoilState(loadingServerStore);
	return loadingPlayersCheck || loadingServerCheck ? (
		<div className="absolute left-0 top-0 z-50 grid h-full w-full place-items-center bg-black opacity-70">
			<span className="loading loading-ring loading-lg"></span>
		</div>
	) : (
		<></>
	);
}
