import { getServerInfo } from '@/app/lib/get-server-info';

export async function GET() {
	return new Response(JSON.stringify(await getServerInfo()), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
