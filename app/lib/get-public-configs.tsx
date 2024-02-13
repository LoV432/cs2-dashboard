'use server';
import { getServersConfig } from './configParse';

export async function getMapsList(serverIndex: number) {
	const config = getServersConfig();
	if ('err' in config) {
		return undefined;
	}
	const maps = [
		...(config.servers[serverIndex].preDefinedMaps || []),
		...(config.global.preDefinedMaps || [])
	];
	return maps;
}
