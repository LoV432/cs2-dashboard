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
export async function getServerMessages(selectedServerIndex: number) {
	if ('err' in config || config.global.simpleAdmin != true) {
		return { error: true };
	}
	try {
		const allMessages = (
			await db.query(
				`SELECT * FROM server_messages WHERE server_index=${config.servers[selectedServerIndex].serverMessagesId}`
			)
		)[0] as dbReturnAllMessages;
		return allMessages;
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
