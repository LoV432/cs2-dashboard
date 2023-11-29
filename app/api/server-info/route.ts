import { csServer } from '@/app/lib/server';

//@ts-ignore
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// The return value of Server.getInfo() contains BigInt properties
// JSON.stringify() cannot serialize BigInts by default
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export async function GET() {
	const serverInfo = await csServer.getInfo();
	return new Response(JSON.stringify(serverInfo), {
		headers: { 'Content-Type': 'application/json' }
	});
}
