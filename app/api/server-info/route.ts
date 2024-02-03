import { getServerInfo } from '@/app/lib/get-server-info';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const serverIndex = Number(searchParams.get('serverIndex')) || 0;
	return new Response(JSON.stringify(await getServerInfo(serverIndex)), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
