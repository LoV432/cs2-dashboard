import ServerInfo from './ServerInfo';
import ServerPlayers from './ServerPlayers';
import AdminActionList from './AdminActionList';
import { getPlayers } from '../lib/get-playes';
import { getServerInfo } from '../lib/get-server-info';

export default async function ServerInfoPanel() {
	const allPlayers = await getPlayers();
	const serverInfo = await getServerInfo();
	if ('err' in serverInfo) {
		console.log(serverInfo.err);
		return <h1>Server connection failed</h1>;
	}
	if ('err' in allPlayers) {
		console.log(allPlayers.err);
		return <h1>RCON failed</h1>;
	}
	const maxMindIsEnabled = process.env.MAXMIND_LICENSE_KEY ? true : false;
	const adminPluginIsEnabled =
		process.env.ADMIN_PLUGIN_INSTALLED == 'true' ? true : false;
	const vipPluginIsEnabled =
		process.env.VIP_PLUGIN_INSTALLED == 'true' ? true : false;
	const featureFlags = {
		maxMindIsEnabled,
		adminPluginIsEnabled,
		vipPluginIsEnabled
	};
	return (
		<div>
			<div className="m-5 h-fit rounded-md bg-zinc-800 p-4">
				<ServerInfo serverInfoPreRender={serverInfo} />
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
