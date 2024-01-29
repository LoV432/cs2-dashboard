'use server';
import { rconInit } from '@/app/lib/rcon';

export async function execRcon(command: string) {
	const rcon = await rconInit();
	if ('err' in rcon) {
		console.log(rcon.err);
		//TODO: Handle this on frontend
		return false;
	}
	const res = await rcon.exec(command);
	rcon.destroy();
	return res;
}
