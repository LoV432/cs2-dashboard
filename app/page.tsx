import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<>
			<div className="flex min-h-screen w-full flex-row flex-wrap justify-evenly">
				<ServerInfoPanel />
				<CommandsBox />
			</div>
		</>
	);
}
