export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { rconInit } from '@/app/lib/rcon';

export async function POST(request: NextRequest) {
	const rcon = await rconInit();
	const body = await request.json();
	if (!body.command || body.command.trim().length === 0) {
		return new Response('Command is required', { status: 400 });
	}

	const res = await rcon.exec(body.command);
	return new Response(res, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
