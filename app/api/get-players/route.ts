import { rcon } from '@/app/lib/rcon';
import { parsePlayerData } from '@/app/lib/parse-players';

export async function GET() {
	const rconRes = await rcon.exec('status');
	const playersData = parsePlayerData(rconRes);
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
