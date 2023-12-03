import { Server } from '@fabricio-191/valve-server-query';

export const csServer = await Server({
	ip: process.env.SERVER_IP || '127.0.0.1',
	port: parseInt(process.env.RCON_PORT as string) || 27015
});
