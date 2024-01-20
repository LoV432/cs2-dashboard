export const dynamic = 'force-dynamic';
import { rconInit } from '@/app/lib/rcon';
import { parsePlayerData, Player } from '@/app/lib/parse-players';

// const rcon = await rconInit();
// rcon.on('disconnect', async (reason) => {
// 	// console.log('disconnected', reason);
// 	try {
// 		await rcon.reconnect();
// 	} catch (e: any) {
// 		// console.log('reconnect failed', e.message);
// 	}
// });

let lastReqTime = 0;
let playersData: Player[] = [];

export async function GET() {
	if (Date.now() - lastReqTime < 5000) {
		return new Response(JSON.stringify(playersData), {
			headers: { 'Content-Type': 'application/json' }
		});
	}
	lastReqTime = Date.now();
	const rcon = await rconInit();
	if ('err' in rcon) {
		console.log(rcon.err);
		//TODO: Handle this on frontend
		return new Response(JSON.stringify({ err: 'error' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const rconRes = await rcon.exec('status');
	rcon.destroy();
	playersData = await parsePlayerData(rconRes);
	return new Response(JSON.stringify(playersData), {
		headers: { 'Content-Type': 'application/json' }
	});
}

// export async function GET() {
// 	const playersInfo = await csServer.getPlayers();
// 	if (playersInfo.length == 0)
// 		return new Response(JSON.stringify({ isEmpty: true }), {
// 			status: 200,
// 			headers: { 'Content-Type': 'application/json' }
// 		});
// 	return new Response(JSON.stringify({ isEmpty: false, playersInfo }), {
// 		headers: { 'Content-Type': 'application/json' }
// 	});
// }
