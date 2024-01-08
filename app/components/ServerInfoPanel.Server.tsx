import { csServerInit } from '@/app/lib/server';
import { rconInit } from '@/app/lib/rcon';
import { parsePlayerData } from '@/app/lib/parse-players';
import ServerInfo from './ServerInfo';
import ServerPlayers from './ServerPlayers';

export default async function ServerInfoPanel() {
	const csServer = await csServerInit();
	const rcon = await rconInit();
	const serverInfo = await csServer.getInfo();
	const players = await rcon.exec('status');
	const allPlayers = await parsePlayerData(players);
	const maxMindIsEnabled = process.env.MAXMIND_LICENSE_KEY ? true : false;
	const adminPluginIsEnabled =
		process.env.ADMIN_PLUGIN_INSTALLED == 'true' ? true : false;
	const featureFlags = {
		maxMindIsEnabled,
		adminPluginIsEnabled
	};
	rcon.destroy();
	csServer.disconnect();
	return (
		<div className="m-5 h-fit rounded-md bg-zinc-800 p-4">
			<ServerInfo serverInfoPreRender={serverInfo} />
			<ServerPlayers
				playersPreRendered={allPlayers}
				featureFlags={featureFlags}
			/>
		</div>
	);
}
