import mysql from 'mysql2';
import { getServersConfig } from './configParse';

const globalConfig = getServersConfig().global;

export const db = mysql
	.createPool({
		host: globalConfig.mysqlHost,
		port: globalConfig.mysqlPort,
		user: globalConfig.mysqlUser,
		database: globalConfig.mysqlDatabase,
		password: globalConfig.mysqlPassword
	})
	.promise();
