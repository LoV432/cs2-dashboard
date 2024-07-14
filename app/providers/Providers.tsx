'use client';
import { ActiveServerContext } from './ActiveServerContext';

export default function Providers({
	children,
	activeServer
}: {
	children: React.ReactNode;
	activeServer: number;
}) {
	return (
		<ActiveServerContext.Provider value={activeServer}>
			{children}
		</ActiveServerContext.Provider>
	);
}
