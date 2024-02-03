'use client';
import { activeServerStore } from '../store/active-server-store';
import { useRecoilState } from 'recoil';

export default function ServerPicker({
	totalServers,
	serverNames
}: {
	totalServers: number;
	serverNames: string[];
}) {
	const [activeServerIndex, setActiveServerIndex] =
		useRecoilState(activeServerStore);
	if (totalServers == 1) {
		return null;
	}
	return (
		<div className="my-5 flex flex-row flex-wrap justify-center gap-5">
			{[...Array(totalServers)].map((e, index) => (
				<button
					key={index}
					className={`btn btn-outline ${activeServerIndex == index ? 'btn-success' : ''} block`}
					onClick={() => {
						setActiveServerIndex(index);
					}}
				>
					{serverNames[index] || 'Server ' + (index + 1)}
				</button>
			))}
		</div>
	);
}
