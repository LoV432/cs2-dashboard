'use server';
import { csServerInit } from '@/app/lib/server';
import type { Server } from '@fabricio-191/valve-server-query';

//@ts-ignore
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// The return value of Server.getInfo() contains BigInt properties
// JSON.stringify() cannot serialize BigInts by default
BigInt.prototype.toJSON = function () {
	return this.toString();
};

let lastReqTime = 0;
let serverInfo: Server.Info;

export async function getServerInfo() {
	if (Date.now() - lastReqTime < 5000) {
		return serverInfo;
	}
	lastReqTime = Date.now();
	const csServer = await csServerInit();
	if ('err' in csServer) {
		console.log(csServer.err);
		//TODO: Handle this on frontend
		return { err: 'error' };
	}
	serverInfo = await csServer.getInfo();
	csServer.disconnect();
	return serverInfo;
}
