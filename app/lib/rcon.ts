import { RCON } from '@fabricio-191/valve-server-query';

//TODO: Is this really the best way to do this?
export const rconInit = async (ip: string, port: number, password: string) => {
	try {
		return await RCON({
			ip,
			port,
			password,
			timeout: 500
		});
	} catch (err) {
		return { err };
	}
};
