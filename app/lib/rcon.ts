//@ts-ignore
import { RCON } from '@fabricio-191/valve-server-query';

export const rcon = await RCON({
	ip: process.env.SERVER_IP,
	port: parseInt(process.env.RCON_PORT as string),
	password: process.env.RCON_PASSWORD as string
});
