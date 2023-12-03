import { Server } from '@fabricio-191/valve-server-query';

export const csServer = await Server({
	ip: process.env.SERVER_IP,
	port: parseInt(process.env.RCON_PORT as string) || 27015
});
