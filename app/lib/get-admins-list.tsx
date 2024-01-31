'use server';
import { db } from '@/app/lib/db';

export type dbReturnAllAdmins = {
	id: number;
	player_steamid: string;
	player_name: string;
	immunity: number;
	flags: string;
	ends: number;
	created: string;
}[];

export async function getAdmins() {
	try {
		const allAdminsList = (
			await db.query(
				`SELECT 
					id,
					player_steamid,
					player_name,
					immunity,
					flags,
					UNIX_TIMESTAMP(ends) as ends,
					UNIX_TIMESTAMP(created) as created
				FROM 
					sa_admins 
				WHERE 
					UNIX_TIMESTAMP(ends) > UNIX_TIMESTAMP(NOW()) OR ends IS NULL
				ORDER BY
					player_steamid`
			)
		)[0] as dbReturnAllAdmins;
		// for (const admin of allAdminsList) {
		// 	const i = allAdmins.findIndex(
		// 		(e) => e.player_steamid === admin.player_steamid
		// 	);
		// 	if (i > -1) {
		// 		allAdmins[i].flags = allAdmins[i].flags + ',' + admin.flags;
		// 		allAdmins[i].immunity = allAdmins[i].immunity + ',' + admin.immunity;
		// 		allAdmins[i].ends = allAdmins[i].ends + ',' + admin.ends;
		// 	} else {
		// 		allAdmins.push(admin);
		// 	}
		// }
		return allAdminsList;
	} catch (err) {
		console.log(err);
		return { error: true };
	}
}
