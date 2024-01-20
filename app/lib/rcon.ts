import { RCON } from '@fabricio-191/valve-server-query';

//TODO: Is this really the best way to do this?
export const rconInit = async () => {
	try {
		return await RCON({
			ip: process.env.SERVER_IP || '127.0.0.1',
			port: parseInt(process.env.RCON_PORT as string) || 27015,
			password: process.env.RCON_PASSWORD || 'setfromenv'
		});
	} catch (err) {
		return { err };
	}
};
