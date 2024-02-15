import ServerInfoPanel from './components/ServerInfoPanel.Server';
import CommandsBox from './components/CommandsBox';
import { Provider } from 'jotai';
import Loading from './components/Loading';
import ActiveServerURLSync from './components/ActiveServerURLSync';
export const dynamic = 'force-dynamic';

export default function Home({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	return (
		<>
			<div className="relative flex min-h-screen w-full flex-row flex-wrap justify-evenly">
				<Provider>
					<ActiveServerURLSync searchParams={searchParams}>
						<Loading />
						<ServerInfoPanel searchParams={searchParams} />
						<CommandsBox />
					</ActiveServerURLSync>
				</Provider>
			</div>
		</>
	);
}
