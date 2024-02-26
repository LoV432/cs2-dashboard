'use client';
import { activeServerStore } from '../../store/active-server-store';
import { useHydrateAtoms } from 'jotai/utils';

export default function ActiveServerURLSync({
	children,
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
	children: React.ReactNode;
}) {
	useHydrateAtoms([
		[activeServerStore, Number(searchParams['SelectedServer']) || 0]
	]);
	return <>{children}</>;
}
