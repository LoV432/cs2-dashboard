import { csServer } from '@/app/lib/server';

export async function GET() {
	const playersInfo = await csServer.getPlayers();
	if (playersInfo.length == 0)
		return new Response(JSON.stringify({ isEmpty: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	return new Response(JSON.stringify({ isEmpty: false, playersInfo }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
