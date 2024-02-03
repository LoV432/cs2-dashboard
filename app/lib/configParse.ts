import toml from 'toml';
import fs from 'fs';

type configType = {
	global: {
		vipCore: boolean;
		simpleAdmin: boolean;
		mysqlHost: string;
		mysqlPort: number;
		mysqlUser: string;
		mysqlDatabase: string;
		mysqlPassword: string;
	};
	servers: {
		serverIp: string;
		serverPort: number;
		rconPort: number;
		rconPassword: string;
		simpleAdminId: number;
		vipCoreId: number;
	}[];
};

export function getServersConfig() {
	try {
		return JSON.parse(
			JSON.stringify(
				toml.parse(fs.readFileSync('config/config.toml', { encoding: 'utf-8' }))
			)
		) as configType;
	} catch (err) {
		console.log('Error parsing config.toml: ' + err);
		console.log('CHECK YOUR CONFIG.TOML FILE');
		return { err: 'error' };
	}
}
