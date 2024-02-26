'use client';
import { atom, useSetAtom } from 'jotai';
import { dbReturnAllMessages } from '@/app/lib/get-server-messages';

export const prefetchedMessagesAtom = atom<dbReturnAllMessages>(
	{} as dbReturnAllMessages
);

export default function PrefetchedMessagesStore({
	children,
	prefetchedMessages
}: {
	children: React.ReactNode;
	prefetchedMessages: dbReturnAllMessages;
}) {
	const setPrefetchedMessages = useSetAtom(prefetchedMessagesAtom);
	setPrefetchedMessages(prefetchedMessages);

	return children;
}
