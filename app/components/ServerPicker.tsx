'use client';
import { activeServerStore } from '../store/active-server-store';
import { useRecoilState } from 'recoil';

export default function ServerPicker({
	totalServers
}: {
	totalServers: number;
}) {
	const [activeServerIndex, setActiveServerIndex] =
		useRecoilState(activeServerStore);
	return (
		<div className="my-5 flex flex-row flex-wrap justify-center gap-5">
			{[...Array(totalServers)].map((e, index) => (
				<button
					className={`btn btn-circle btn-outline ${activeServerIndex == index ? 'btn-success' : ''} block`}
					onClick={() => {
						setActiveServerIndex(index);
					}}
				>
					{index + 1}
				</button>
			))}
		</div>
	);
}
