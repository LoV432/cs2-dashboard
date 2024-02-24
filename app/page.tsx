import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
import { Provider } from 'jotai';
import Loading from './components/Loading';
import ActiveServerURLSync from './components/ActiveServerURLSync';
import { getServersConfig } from './lib/configParse';
export const dynamic = 'force-dynamic';

export default function Home({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
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
					<ActiveServerURLSync searchParams={searchParams}>
						<Loading />
						<ServerInfoPanel
							searchParams={searchParams}
							featureFlags={featureFlags}
							serverNames={serverNames}
						/>
						<CommandsBox featureFlags={featureFlags} />
					</ActiveServerURLSync>
				</Provider>
			</div>
		</>
	);
}
