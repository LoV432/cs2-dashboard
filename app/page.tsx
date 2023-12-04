import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<>
			<div className="flex h-[100dvh] w-full flex-row flex-wrap place-items-center justify-evenly">
				<ServerInfoPanel />
				<CommandsBox />
			</div>
		</>
	);
}
