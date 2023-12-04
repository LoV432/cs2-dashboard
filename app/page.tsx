import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<>
			<div className="flex h-[100dvh] w-full flex-col place-items-center justify-evenly lg:flex-row">
				<ServerInfoPanel />
				<CommandsBox />
			</div>
		</>
	);
}
