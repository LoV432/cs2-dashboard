import mysql from 'mysql2';
import { getServersConfig } from './configParse';

const config = getServersConfig();
let globalConfig;
if ('err' in config) {
	console.log(config.err);
	globalConfig = {
		mysqlHost: 'localhost',
		mysqlPort: 3306,
		mysqlUser: 'root',
		mysqlDatabase: 'db',
		mysqlPassword: 'password'
	};
} else {
	globalConfig = config.global;
}

export const db = mysql
	.createPool({
		host: globalConfig.mysqlHost,
		port: globalConfig.mysqlPort,
		user: globalConfig.mysqlUser,
		database: globalConfig.mysqlDatabase,
		password: globalConfig.mysqlPassword
	})
	.promise();
