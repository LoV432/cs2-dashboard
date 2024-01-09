'use server';
import { db } from '@/app/lib/db';

export type dbAllBansReturn = {
	id: number;
	player_steamid: string;
	player_name: string;
	player_ip: string;
	admin_steamid: string;
	admin_name: string;
	reason: string;
	duration: number;
	ends: string;
	created: string;
	status: string;
}[];

export async function getBans() {
	try {
		const dbRes = await db.query('SELECT * FROM sa_bans WHERE status="ACTIVE"');
		const res = dbRes[0] as dbAllBansReturn;
		return res;
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
