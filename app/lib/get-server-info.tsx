'use server';
import { csServerInit } from '@/app/lib/server';
import type { Server } from '@fabricio-191/valve-server-query';
import { getServersConfig, configType } from './configParse';

type cache = {
	serverInfo: Server.Info | { err: string };
	lastReqTime: number;
}[];

//@ts-ignore
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// The return value of Server.getInfo() contains BigInt properties
// JSON.stringify() cannot serialize BigInts by default
BigInt.prototype.toJSON = function () {
	return this.toString();
};

const config = getServersConfig();
let servers: configType['servers'] = [];
let serversCache: cache = [];
if (!('err' in config)) {
	servers = config.servers;
	for (let i = 0; i < servers.length; i++) {
		serversCache.push({
			serverInfo: { err: 'error' },
			lastReqTime: 0
		});
	}
} else {
	serversCache = [];
}

export async function getServerInfo(serverIndex: number, forceUpadate = false) {
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
		Date.now() - serversCache[serverIndex].lastReqTime < 5000 &&
		!forceUpadate
	) {
		return serversCache[serverIndex].serverInfo;
	}
	serversCache[serverIndex].lastReqTime = Date.now();
	const csServer = await csServerInit(
		servers[serverIndex].serverIp,
		servers[serverIndex].serverPort
	);
	if ('err' in csServer) {
		serversCache[serverIndex].serverInfo = { err: 'error' };
		console.log(csServer.err);
		return { err: 'error' };
	}
	serversCache[serverIndex].serverInfo = await csServer.getInfo();
	csServer.disconnect();
	return serversCache[serverIndex].serverInfo;
}
