import ServerInfoPanel from '@/app/components/ServerInfoPanel/ServerInfoPanel.Server';
import ChatWindowPanel from '@/app/components/ChatWindowPanel/ChatWindow';
import { Provider } from 'jotai';
import Providers from '@/app/providers/Providers';
import { getServersConfig } from '@/app/lib/configParse';
import PrefetchMessages from '@/app/components/ChatWindowPanel/PrefetchMessages.server';
export const dynamic = 'force-dynamic';

export default function Home({ params }: { params: { id: string } }) {
	const config = getServersConfig();
	if ('err' in config) {
		console.log(config.err);
		return (
			<>
				<h1>Config error. Make sure config.toml is valid</h1>
				<h1>
					Make sure you have renamed config.toml.example to config.toml inside
					your "dashboard-config/" directory
				</h1>
				<h1>
					Also make sure you restarted the web server after editing the file
				</h1>
			</>
		);
	}
	const activeServer = Number(params.id);
	if (
		isNaN(activeServer) ||
		activeServer < 0 ||
		activeServer >= config.servers.length
	) {
		return <h1>Invalid server ID</h1>;
	}
	const maxMindIsEnabled = process.env.MAXMIND_LICENSE_KEY ? true : false;
	const adminPluginIsEnabled = config.global.simpleAdmin;
	const vipPluginIsEnabled = config.global.vipCore;
	const chatLoggerEnabled = config.global.chatLogger;
	const featureFlags = {
		maxMindIsEnabled,
		adminPluginIsEnabled,
		vipPluginIsEnabled,
		chatLoggerEnabled
	};
	const serverNames = config.servers.map((server) => server.serverName || '');
	return (
		<>
			<div className="relative flex min-h-screen w-full flex-row flex-wrap justify-evenly">
				<Provider>
					<Providers activeServer={activeServer}>
						<ServerInfoPanel
							selectedServer={activeServer}
							featureFlags={featureFlags}
							serverNames={serverNames}
						/>
						<PrefetchMessages selectedServer={activeServer}>
							<ChatWindowPanel featureFlags={featureFlags} />
						</PrefetchMessages>
					</Providers>
				</Provider>
			</div>
		</>
	);
}
