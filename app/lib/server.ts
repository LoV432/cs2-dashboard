import { Server } from '@fabricio-191/valve-server-query';

//TODO: Is this really the best way to do this?
export const csServerInit = async (ip: string, port: number) => {
	try {
		return await Server({
			ip,
			port,
			timeout: 500
		});
	} catch (err) {
		return { err };
	}
};
