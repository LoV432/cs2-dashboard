import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
import RecoilRootWrapper from './components/RecoilRootWrapper';
import Loading from './components/Loading';
export const dynamic = 'force-dynamic';

export default function Home({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	return (
		<>
			<div className="relative flex min-h-screen w-full flex-row flex-wrap justify-evenly">
				<RecoilRootWrapper>
					<Loading />
					<ServerInfoPanel searchParams={searchParams} />
					<CommandsBox />
				</RecoilRootWrapper>
			</div>
		</>
	);
}
