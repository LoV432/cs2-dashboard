'use server';
import { db } from '@/app/lib/db';
import { getServersConfig } from './configParse';

export type dbReturnAllVipsAction = {
	id: number;
	account_id: string;
	name: string;
	group: string;
	expires: number;
}[];

const config = getServersConfig();

export async function getVipsList(selectedServerIndex: number) {
	if ('err' in config || config.global.vipCore != true) {
		return { error: true };
	}
	try {
		const allVips = (
			await db.query(
				`SELECT * FROM vip_users WHERE (expires > UNIX_TIMESTAMP(NOW()) OR expires = 0) AND sid=${config.servers[selectedServerIndex].vipCoreId}`
			)
		)[0] as dbReturnAllVipsAction;
		return JSON.parse(JSON.stringify(allVips));
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
