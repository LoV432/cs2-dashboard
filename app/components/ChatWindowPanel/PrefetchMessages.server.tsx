import { db } from '@/app/lib/db';
import { getServersConfig } from '@/app/lib/configParse';
import type { dbReturnAllMessages } from '@/app/lib/get-server-messages';
import PrefetchedMessagesStore from '../Misc/PrefetchedMessagesStore';

export default async function PrefetchMessages({
	searchParams,
	children
}: {
	searchParams: { [key: string]: string | string[] | undefined };
	children: React.ReactNode;
}) {
	const serverIndex = Number(searchParams['SelectedServer']) || 0;
	const allMessages = await getServerMessages(serverIndex);
	if ('error' in allMessages) {
		console.log('Error loading messages');
		return (
			<PrefetchedMessagesStore prefetchedMessages={[]}>
				{children}
			</PrefetchedMessagesStore>
		);
	}
	return (
		<PrefetchedMessagesStore prefetchedMessages={allMessages}>
			{children}
		</PrefetchedMessagesStore>
	);
}

async function getServerMessages(
	selectedServerIndex: number,
	olderThan = 0,
	newerThan = 0
) {
	const config = getServersConfig();
	if ('err' in config || config.global.chatLogger != true) {
		return { error: true };
	}
	try {
		if (olderThan === 0) {
			const allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_id=${config.servers[selectedServerIndex].chatLoggerId} AND id > ${newerThan} ORDER BY id DESC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
			return allMessages.reverse();
		} else {
			const allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_id=${config.servers[selectedServerIndex].chatLoggerId} AND id < ${olderThan} ORDER BY id DESC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
			return allMessages.reverse();
		}
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
