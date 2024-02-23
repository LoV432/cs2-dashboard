'use server';
import { db } from '@/app/lib/db';
import { getServersConfig } from './configParse';
import { RowDataPacket } from 'mysql2';

export type dbReturnAllMessages = {
	id: number;
	time: Date;
	team: string;
	message: string;
	ipAddress: string;
	author_name: string;
	author_id: string;
	author_icon_url: number;
	server_id: number;
}[];

const config = getServersConfig();
export async function getServerMessages(
	selectedServerIndex: number,
	olderThan = 0,
	newerThan = 0
) {
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

export async function getFirstMessageId(selectedServerIndex: number) {
	if ('err' in config || config.global.chatLogger != true) {
		return { error: true };
	}
	try {
		const firstMessageId = (await db.query(
			`SELECT id FROM server_messages WHERE server_id=${config.servers[selectedServerIndex].chatLoggerId} ORDER BY id ASC LIMIT 1`
		)) as RowDataPacket[][];
		return firstMessageId[0][0].id as number;
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
