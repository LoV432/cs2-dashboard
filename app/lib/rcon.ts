import { RCON } from '@fabricio-191/valve-server-query';

export const rcon = await RCON({
	ip: process.env.SERVER_IP || '127.0.0.1',
	port: parseInt(process.env.RCON_PORT as string) || 27015,
	password: process.env.RCON_PASSWORD || 'dummypassword'
});
