import { db } from '@/app/lib/db';
import { getServersConfig } from '@/app/lib/configParse';
import type { dbReturnAllMessages } from '@/app/lib/get-server-messages';

export async function prefetchMessages(
	selectedServerIndex: number,
	olderThan = 0,
	newerThan = 0
) {
	const config = getServersConfig();
	if ('err' in config || config.global.chatLogger != true) {
		return { error: true };
	}
	try {
		let allMessages: dbReturnAllMessages = [];
		if (olderThan === 0) {
			allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_id=${config.servers[selectedServerIndex].chatLoggerId} AND id > ${newerThan} ORDER BY id DESC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
		} else {
			allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_id=${config.servers[selectedServerIndex].chatLoggerId} AND id < ${olderThan} ORDER BY id DESC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
		}
		return JSON.parse(
			JSON.stringify(allMessages.reverse())
		) as dbReturnAllMessages;
	} catch (err) {
		console.log('Error loading messages: ', err);
		return { error: true };
	}
}
