'use server';
import { rconInit } from '@/app/lib/rcon';
import { parsePlayerData, Player } from '@/app/lib/parse-players';
import { getServersConfig } from './configParse';

type cache = {
	playersInfo: Player[] | { err: string };
	lastReqTime: number;
}[];

const config = getServersConfig();
if ('err' in config) {
	process.exit(1);
}
const servers = config.servers;
let serversCache: cache = [];
for (let i = 0; i < servers.length; i++) {
	serversCache.push({
		playersInfo: { err: 'error' },
		lastReqTime: 0
	});
}

export async function getPlayers(selectedServer: number, forceUpdate = false) {
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
