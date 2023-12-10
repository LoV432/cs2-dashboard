export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { rconInit } from '@/app/lib/rcon';

// const rcon = await rconInit();
// rcon.on('disconnect', async (reason) => {
// 	// console.log('disconnected', reason);
// 	try {
// 		await rcon.reconnect();
// 	} catch (e: any) {
// 		// console.log('reconnect failed', e.message);
// 	}
// });

export async function POST(request: NextRequest) {
	const body = await request.json();
	if (!body.command || body.command.trim().length === 0) {
		return new Response('Command is required', { status: 400 });
	}

	const rcon = await rconInit();
	const res = await rcon.exec(body.command);
	rcon.destroy();
	return new Response(res, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
