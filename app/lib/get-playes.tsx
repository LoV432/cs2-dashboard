'use server';
import { rconInit } from '@/app/lib/rcon';
import { parsePlayerData, Player } from '@/app/lib/parse-players';
import { getServersConfig, configType } from './configParse';

type cache = {
	playersInfo: Player[] | { err: string };
	lastReqTime: number;
}[];

const config = getServersConfig();
let servers: configType['servers'] = [];
let serversCache: cache = [];
if (!('err' in config)) {
	servers = config.servers;
	for (let i = 0; i < servers.length; i++) {
		serversCache.push({
			playersInfo: { err: 'error' },
			lastReqTime: 0
		});
	}
} else {
	serversCache = [];
}

export async function getPlayers(selectedServer: number, forceUpdate = false) {
	if ('err' in config) {
		console.log(config.err);
		console.log('Config error. Make sure config.toml is valid');
		console.log(
			'Make sure you have renamed config.toml.example to config.toml inside your "dashboard-config/" directory'
		);
		console.log(
			'Also make sure you restarted the web server after editing the file'
		);
		return { err: 'error' };
	}
	if (
		Date.now() - serversCache[selectedServer].lastReqTime < 5000 &&
		!forceUpdate
	) {
		return serversCache[selectedServer].playersInfo;
	}
	serversCache[selectedServer].lastReqTime = Date.now();
	const rcon = await rconInit(
		servers[selectedServer].serverIp,
		servers[selectedServer].serverPort,
		servers[selectedServer].rconPassword
	);
	if ('err' in rcon) {
		console.log(rcon.err);
		return { err: 'error' };
	}
	const rconRes = await rcon.exec('status');
	rcon.destroy();
	serversCache[selectedServer].playersInfo = await parsePlayerData(rconRes);
	return serversCache[selectedServer].playersInfo;
}
