'use server';
import { rconInit } from '@/app/lib/rcon';
import { parsePlayerData, Player } from '@/app/lib/parse-players';

let lastReqTime = 0;
let playersData: Player[] = [];

export async function getPlayers() {
	if (Date.now() - lastReqTime < 5000) {
		return playersData;
	}
	lastReqTime = Date.now();
	const rcon = await rconInit();
	if ('err' in rcon) {
		console.log(rcon.err);
		//TODO: Handle this on frontend
		return { err: 'error' };
	}
	const rconRes = await rcon.exec('status');
	rcon.destroy();
	playersData = await parsePlayerData(rconRes);
	return playersData;
}
