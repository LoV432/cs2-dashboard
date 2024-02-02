'use server';
import { rconInit } from '@/app/lib/rcon';
import { getServersConfig } from './configParse';
const servers = getServersConfig().servers;

export async function execRcon(command: string, serverIndex: number) {
	const rcon = await rconInit(
		servers[serverIndex].serverIp,
		servers[serverIndex].rconPort,
		servers[serverIndex].rconPassword
	);
	if ('err' in rcon) {
		console.log(rcon.err);
		//TODO: Handle this on frontend
		return false;
	}
	const res = await rcon.exec(command);
	rcon.destroy();
	return res;
}
