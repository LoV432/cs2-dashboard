'use server';
import { getServersConfig } from './configParse';

export async function getMapsList() {
	const config = getServersConfig();
	if ('err' in config) {
		return undefined;
	}

	return {
		maps: config.global.preDefinedMaps
	};
}
