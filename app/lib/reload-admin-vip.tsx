'use server';
import { getServersConfig } from './configParse';
import { execRcon } from './exec-rcon';
const config = getServersConfig();

export async function reloadAllServerAdmin() {
	if ('err' in config) {
		console.log(config.err);
		return;
	}
	let index = 0;
	for (const server in config.servers) {
		await execRcon('css_reladmin', index);
		index += 1;
	}
	return true;
}

export async function reloadAllServerVip() {
	if ('err' in config) {
		console.log(config.err);
		return;
	}
	let index = 0;
	for (const server in config.servers) {
		await execRcon('css_vip_reload', index);
		index += 1;
	}
	return true;
}
