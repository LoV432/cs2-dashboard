'use server';
import { csServerInit } from '@/app/lib/server';
import type { Server } from '@fabricio-191/valve-server-query';
import { getServersConfig } from './configParse';

//@ts-ignore
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// The return value of Server.getInfo() contains BigInt properties
// JSON.stringify() cannot serialize BigInts by default
BigInt.prototype.toJSON = function () {
	return this.toString();
};

const config = getServersConfig().servers;
let lastReqTime = 0;
let serverInfo: Server.Info | { err: string };

export async function getServerInfo(serverIndex = 0, forceUpadate = false) {
	if (Date.now() - lastReqTime < 5000 && !forceUpadate) {
		return serverInfo;
	}
	lastReqTime = Date.now();
	const csServer = await csServerInit(
		config[serverIndex].serverIp,
		config[serverIndex].serverPort
	);
	if ('err' in csServer) {
		serverInfo = { err: 'error' };
		console.log(csServer.err);
		return { err: 'error' };
	}
	serverInfo = await csServer.getInfo();
	csServer.disconnect();
	return serverInfo;
}
