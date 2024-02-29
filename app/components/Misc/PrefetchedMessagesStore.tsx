'use client';
import { atom, useSetAtom } from 'jotai';
import { dbReturnAllMessages } from '@/app/lib/get-server-messages';
import { useEffect } from 'react';

export const prefetchedMessagesAtom = atom<dbReturnAllMessages>(
	{} as dbReturnAllMessages
);

export const isHydrated = atom(false);

export default function PrefetchedMessagesStore({
	children,
	prefetchedMessages
}: {
	children: React.ReactNode;
	prefetchedMessages: dbReturnAllMessages;
}) {
	const setIsHydrated = useSetAtom(isHydrated);
	const setPrefetchedMessages = useSetAtom(prefetchedMessagesAtom);
	setPrefetchedMessages(prefetchedMessages);
	useEffect(() => {
		setIsHydrated(true);
	});
	return children;
}
