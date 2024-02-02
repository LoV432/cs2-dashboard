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
	}[];
};

export function getServersConfig() {
	return JSON.parse(
		JSON.stringify(
			toml.parse(fs.readFileSync('config.toml', { encoding: 'utf-8' }))
		)
	) as configType;
}
