'use server';
import { db } from '@/app/lib/db';
import { getServersConfig } from './configParse';

export type dbReturnAllMessages = {
	id: number;
	time: Date;
	team: string;
	message: string;
	ipAddress: string;
	author_name: string;
	author_id: string;
	author_icon_url: number;
	server_index: number;
}[];

const config = getServersConfig();
export async function getServerMessages(
	selectedServerIndex: number,
	olderThan = 0,
	newerThan = 0
) {
	if ('err' in config || config.global.simpleAdmin != true) {
		return { error: true };
	}
	try {
		if (olderThan === 0) {
			const allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_index=${config.servers[selectedServerIndex].serverMessagesId} AND id > ${newerThan} ORDER BY id DESC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
			return allMessages;
		} else {
			const allMessages = (
				await db.query(
					`SELECT * FROM server_messages WHERE server_index=${config.servers[selectedServerIndex].serverMessagesId} AND id < ${olderThan} ORDER BY id ASC LIMIT 30`
				)
			)[0] as dbReturnAllMessages;
			return allMessages;
		}
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
