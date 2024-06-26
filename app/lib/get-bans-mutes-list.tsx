'use server';
import { db } from '@/app/lib/db';
import { getServersConfig } from './configParse';

export type dbReturnAllPunishmentAction = {
	id: number;
	player_steamid: string;
	player_name: string;
	player_ip?: string;
	admin_steamid: string;
	admin_name: string;
	reason: string;
	duration: number;
	ends: string;
	created: string;
	type: 'MUTE' | 'GAG' | 'BAN';
	status: string;
	server_id: number;
}[];

const config = getServersConfig();
export async function getBansAndMutes(selectedServerIndex: number) {
	if ('err' in config || config.global.simpleAdmin != true) {
		return { error: true };
	}
	try {
		const allBans = (
			await db.query(
				`SELECT *, "BAN" AS type FROM sa_bans WHERE status="ACTIVE"`
			)
		)[0] as dbReturnAllPunishmentAction;
		const allMutes = (
			await db.query(`SELECT * FROM sa_mutes WHERE status="ACTIVE"`)
		)[0] as dbReturnAllPunishmentAction;
		const res = [...allBans, ...allMutes];
		res.sort(
			(a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
		);
		return JSON.parse(JSON.stringify(res));
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
