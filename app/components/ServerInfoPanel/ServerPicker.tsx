'use client';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext } from 'react';
import Link from 'next/link';

export default function ServerPicker({
	serverNames
}: {
	serverNames: string[];
}) {
	if (serverNames.length == 1) {
		return null;
	}
	const activeServer = useContext(ActiveServerContext);
	return (
		<div className="my-5 flex flex-row flex-wrap justify-center gap-5">
			{serverNames.map((serverName, index) => (
				<Link href={`/server/${index}`} key={index}>
					<button
						key={index}
						className={`btn btn-outline ${activeServer == index ? 'btn-success' : ''} block`}
					>
						{serverName || 'Server ' + (index + 1)}
					</button>
				</Link>
			))}
		</div>
	);
}
