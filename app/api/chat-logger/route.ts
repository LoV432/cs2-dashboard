import { db } from '@/app/lib/db';
import { NextRequest } from 'next/server';
import { getServersConfig } from '@/app/lib/configParse';
type discordMessage = {
	embeds?: [
		{
			type?: string;
			description?: string;
			color?: number;
			author?: {
				name?: string;
				url?: string;
				icon_url?: string;
			};
		}
	];
};
const config = getServersConfig();

if (!('err' in config) && config.global.chatLogger == true) {
	try {
		await db.execute(
			`CREATE TABLE IF NOT EXISTS server_messages (
			id INT AUTO_INCREMENT PRIMARY KEY,
			time DATETIME,
			team VARCHAR(50),
			message TEXT,
			ipAddress VARCHAR(15),
			author_name VARCHAR(255),
			author_id VARCHAR(255),
			author_icon_url VARCHAR(255),
			server_id INT
			)`
		);
	} catch {}
}

const regexPattern =
	/^\[(\d{2}-\d{2}-\d{4}) - (\d{2}:\d{2}:\d{2})\] \[(\w+)\] (.+) \(IpAddress: (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)$/;
export async function POST(request: NextRequest) {
	if ('err' in config || config.global.chatLogger != true) {
		return new Response(
			JSON.stringify({ error: 'Chat Logger is not enabled' }),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
	const invalidResponse = new Response(
		JSON.stringify({ error: 'Invalid message format' }),
		{
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	const body = (await request.json()) as discordMessage;
	if (
		!body.embeds ||
		!body.embeds[0] ||
		!body.embeds[0].description ||
		!body.embeds[0].author ||
		!body.embeds[0].author.name ||
		!body.embeds[0].author.url ||
		!body.embeds[0].author.icon_url
	) {
		return invalidResponse;
	}
	const searchParams = request.nextUrl.searchParams;
	const serverIdFromUrl = parseInt(searchParams.get('server_id') || '');
	if (isNaN(serverIdFromUrl)) {
		return invalidResponse;
	}
	const messageDescription = body.embeds[0].description;
	const match = messageDescription.match(regexPattern);
	if (!match) {
		return invalidResponse;
	}
	const [, date, time, team, message, ipAddress] = match;
	const parsedMessage = {
		time: new Date(`${date} ${time}`),
		team,
		message,
		ipAddress,
		author: body.embeds[0].author
	};
	await db.execute(
		`INSERT INTO server_messages (time, team, message, ipAddress, author_name, author_id, author_icon_url, server_id) 
    	VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			parsedMessage.time,
			parsedMessage.team,
			parsedMessage.message,
			parsedMessage.ipAddress,
			parsedMessage.author.name,
			parsedMessage.author.url?.split('/').slice(-1)[0] || '',
			parsedMessage.author.icon_url?.split('/').slice(-1)[0] || '',
			serverIdFromUrl
		]
	);
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
