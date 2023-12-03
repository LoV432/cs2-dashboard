export interface Player {
	id: number;
	time: string;
	ping: number;
	loss: number;
	state: string;
	rate: number;
	adr: string;
	name: string;
}

export function parsePlayerData(data: string): Player[] {
	const playerRegex =
		/(\d+)\s+((?:\d+:)?(?:\d+:)?\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(\d+\.\d+\.\d+\.\d+:\d+)\s+'(.+)'/;
	const players: Player[] = [];

	const lines = data.split('\n');
	for (const line of lines) {
		const match = line.match(playerRegex);
		if (match && match[8] !== 'unknown') {
			const player: Player = {
				id: parseInt(match[1], 10),
				time: match[2],
				ping: parseInt(match[3], 10),
				loss: parseInt(match[4], 10),
				state: match[5],
				rate: parseInt(match[6], 10),
				adr: match[7],
				name: match[8]
			};
			players.push(player);
		}
	}

	return players;
}
