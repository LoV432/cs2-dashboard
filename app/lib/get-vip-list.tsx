'use server';
import { db } from '@/app/lib/db';

export type dbReturnAllVipsAction = {
	id: number;
	account_id: string;
	name: string;
	group: string;
	expires: number;
}[];

export async function getVipsList() {
	try {
		const allVips = (
			await db.query(
				'SELECT * FROM vip_users WHERE expires > UNIX_TIMESTAMP(NOW()) OR expires = 0'
			)
		)[0] as dbReturnAllVipsAction;
		return allVips;
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
