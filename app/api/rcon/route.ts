import { NextRequest } from 'next/server';
import { rcon } from '@/app/lib/rcon';

export async function POST(request: NextRequest) {
	const body = await request.json();
	if (!body.command && body.command == '')
		return new Response('Command is required', { status: 400 });

	const res = await rcon.exec(body.command);
	return new Response(res, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
