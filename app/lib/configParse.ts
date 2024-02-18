import toml from 'toml';
import fs from 'fs';

export type configType = {
	global: {
		vipCore: boolean;
		simpleAdmin: boolean;
		serverMessages: boolean;
		mysqlHost: string;
		mysqlPort: number;
		mysqlUser: string;
		mysqlDatabase: string;
		mysqlPassword: string;
		preDefinedMaps?: Array<[string, string]>;
	};
	servers: {
		serverName: string;
		serverIp: string;
		serverPort: number;
		rconPort: number;
		rconPassword: string;
		simpleAdminId: number;
		vipCoreId: number;
		preDefinedMaps?: Array<[string, string]>;
	}[];
};

export function getServersConfig() {
	try {
		// console.log(
		// 	JSON.parse(
		// 		JSON.stringify(
		// 			toml.parse(
		// 				fs.readFileSync('config/config.toml', { encoding: 'utf-8' })
		// 			)
		// 		)
		// 	)
		// );
		return JSON.parse(
			JSON.stringify(
				toml.parse(fs.readFileSync('config/config.toml', { encoding: 'utf-8' }))
			)
		) as configType;
	} catch (err) {
		console.log('Error parsing config.toml: ' + err);
		console.log(
			'CHECK YOUR CONFIG.TOML FILE. NAKE SURE YOU HAVE RENAMED config.toml.example TO config.toml'
		);
		console.log(
			'ALSO MAKE SURE YOU RESTARTED THE WEB SERVER AFTER EDITING THE FILE'
		);
		return { err };
	}
}
