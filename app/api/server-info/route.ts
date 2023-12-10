export const dynamic = 'force-dynamic';
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

export async function GET() {
	if (Date.now() - lastReqTime < 5000) {
		return new Response(JSON.stringify(serverInfo), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
	lastReqTime = Date.now();
	const csServer = await csServerInit();
	serverInfo = await csServer.getInfo();
	csServer.disconnect();
	return new Response(JSON.stringify(serverInfo), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
