import ServerInfo from './components/ServerInfo.Server';
import CommandsBox from './components/CommandsBox';

export default function Home() {
	return (
		<>
			<div className="flex h-screen w-full flex-col place-items-center justify-evenly lg:flex-row">
				<ServerInfo />
				<CommandsBox />
			</div>
		</>
	);
}
