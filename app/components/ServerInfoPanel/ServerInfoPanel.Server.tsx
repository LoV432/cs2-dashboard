import ServerInfo from './ServerInfo';
import ServerPlayers from './ServerPlayers';
import AdminActionList from './AdminPanel/AdminActionList';
import ServerPicker from './ServerPicker';
import { getPlayers } from '../../lib/get-playes';
import { getServerInfo } from '../../lib/get-server-info';

export default async function ServerInfoPanel({
	selectedServer,
	featureFlags,
	serverNames
}: {
	selectedServer: number;
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
		chatLoggerEnabled: boolean;
	};
	serverNames: string[];
}) {
	const serverIndex = selectedServer;
	const allPlayers = await getPlayers(serverIndex);
	const serverInfo = await getServerInfo(serverIndex);
	if ('err' in serverInfo) {
		console.log(serverInfo.err);
		return (
			<div>
				<ServerPicker serverNames={serverNames} />
				<h1>
					Server connection failed. Please check your docker logs for more info
				</h1>
			</div>
		);
	}
	if ('err' in allPlayers) {
		console.log(allPlayers.err);
		return (
			<div>
				<ServerPicker serverNames={serverNames} />
				<h1>RCON failed. Please check your docker logs for more info</h1>
			</div>
		);
	}
	return (
		<div>
			<ServerPicker serverNames={serverNames} />
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
