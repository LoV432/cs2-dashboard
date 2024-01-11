import mysql from 'mysql2';

export const db = mysql
	.createPool({
		host: process.env.SQL_HOST,
		port: Number(process.env.SQL_PORT),
		user: process.env.SQL_USER,
		database: process.env.SQL_DB,
		password: process.env.SQL_PASSWORD
	})
	.promise();