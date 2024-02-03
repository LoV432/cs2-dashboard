import mysql from 'mysql2';
import { getServersConfig } from './configParse';

const config = getServersConfig();
if ('err' in config) {
	process.exit(1);
}
const globalConfig = config.global;

export const db = mysql
	.createPool({
		host: globalConfig.mysqlHost,
		port: globalConfig.mysqlPort,
		user: globalConfig.mysqlUser,
		database: globalConfig.mysqlDatabase,
		password: globalConfig.mysqlPassword
	})
	.promise();
