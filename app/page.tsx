import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
import RecoilRootWrapper from './components/RecoilRootWrapper';
import Loading from './components/Loading';
export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<>
			<div className="flex min-h-screen w-full flex-row flex-wrap justify-evenly">
				<RecoilRootWrapper>
					<Loading />
					<ServerInfoPanel />
					<CommandsBox />
				</RecoilRootWrapper>
			</div>
		</>
	);
}
