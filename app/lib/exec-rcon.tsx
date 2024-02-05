'use server';
import { rconInit } from '@/app/lib/rcon';
import { getServersConfig } from './configParse';
const config = getServersConfig();

export async function execRcon(command: string, serverIndex: number) {
	if ('err' in config) {
		console.log(config.err);
		console.log('Config error. Make sure config.toml is valid');
		console.log(
			'Make sure you have renamed config.toml.example to config.toml inside your "dashboard-config/" directory'
		)
		console.log('Also make sure you restarted the web server after editing the file');
		return false;
	}
	const rcon = await rconInit(
		config.servers[serverIndex].serverIp,
		config.servers[serverIndex].rconPort,
		config.servers[serverIndex].rconPassword
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
