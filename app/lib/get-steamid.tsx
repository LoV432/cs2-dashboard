export function searchSteamIDFromAdminPlugin(
	playerListString: string,
	playerName: string
) {
	const regex = new RegExp(
		`• \\[#\\d+\\] "${playerName}" \\(IP Address: ".+" SteamID64: "(.+)"\\)`,
		'g'
	);
	const match = regex.exec(playerListString);

	if (match && match[1]) {
		return match[1];
	} else {
		return '';
	}
}

export async function searchSteamIDFromNative(
	playerListString: string,
	playerName: string
) {
	if (playerListString == '') return '';
	let steamID = '';
	const usersList = (await JSON.parse(playerListString)).server?.clients;
	for (const user of usersList) {
		if (user.name == playerName) {
			steamID = user.steamid64 as string;
			break;
		}
	}
	return steamID;
}
