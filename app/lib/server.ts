import { Server } from '@fabricio-191/valve-server-query';

//TODO: Is this really the best way to do this?
export const csServerInit = async () => {
	return await Server({
		ip: process.env.SERVER_IP || '127.0.0.1',
		port: parseInt(process.env.RCON_PORT as string) || 27015
	});
};
