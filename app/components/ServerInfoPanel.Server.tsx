import ServerInfo from './ServerInfo';
import ServerPlayers from './ServerPlayers';
import AdminActionList from './AdminActionList';
import ServerPicker from './ServerPicker';
import { getPlayers } from '../lib/get-playes';
import { getServerInfo } from '../lib/get-server-info';
import { getServersConfig } from '../lib/configParse';

export default async function ServerInfoPanel({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const serverIndex = Number(searchParams['activeServerStore']) || 0;
	const allPlayers = await getPlayers(serverIndex);
	const serverInfo = await getServerInfo(serverIndex);
	const config = getServersConfig();
	if ('err' in config) {
		console.log(config.err);
		return <h1>Config error. Make sure config.toml is valid</h1>;
	}
	if ('err' in serverInfo) {
		console.log(serverInfo.err);
		return <h1>Server connection failed</h1>;
	}
	if ('err' in allPlayers) {
		console.log(allPlayers.err);
		return <h1>RCON failed</h1>;
	}
	const maxMindIsEnabled = process.env.MAXMIND_LICENSE_KEY ? true : false;
	const adminPluginIsEnabled = config.global.simpleAdmin;
	const vipPluginIsEnabled = config.global.vipCore;
	const featureFlags = {
		maxMindIsEnabled,
		adminPluginIsEnabled,
		vipPluginIsEnabled
	};
	const serverNames = config.servers.map((server) => server.serverName);
	return (
		<div>
			<ServerPicker
				totalServers={config.servers.length}
				serverNames={serverNames}
			/>
			<div className="m-5 h-fit rounded-md bg-zinc-800 p-4">
				<ServerInfo
					serverInfoPreRender={serverInfo}
					featureFlags={featureFlags}
				/>
				<ServerPlayers
					playersPreRendered={allPlayers}
					featureFlags={featureFlags}
				/>
			</div>
			{featureFlags.adminPluginIsEnabled || featureFlags.vipPluginIsEnabled ? (
				<AdminActionList featureFlags={featureFlags} />
			) : null}
		</div>
	);
}
