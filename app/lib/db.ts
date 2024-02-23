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

if (!('err' in config) && config.global.chatLogger == true) {
	try {
		db.execute(
			`CREATE TABLE IF NOT EXISTS server_messages (
				id INT AUTO_INCREMENT PRIMARY KEY,
				time DATETIME,
				team VARCHAR(50),
				message TEXT,
				ipAddress VARCHAR(15),
				author_name VARCHAR(255),
				author_id VARCHAR(255),
				author_icon_url VARCHAR(255),
				server_id INT
				)`
		);
	} catch {}
}
