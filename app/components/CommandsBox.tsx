'use client';
import { useRef, useState } from 'react';
import CommandBubbles from './CommandBubbles';
import ChatBubbles from './ChatBubbles';
import SendCommand from './SendCommand';

export default function CommandsBox({
	featureFlags
}: {
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
		serverMessagesIsEnabled: boolean;
	};
}) {
	const chatWindowsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const [chatPanelActive, setChatPanelActive] = useState(
		featureFlags.serverMessagesIsEnabled
	);
	return (
		<>
			<div
				ref={chatWindowsRef}
				className="relative m-5 mb-16 flex h-[35rem] w-full flex-col overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-800 p-5 sm:w-[44rem]"
			>
				{featureFlags.serverMessagesIsEnabled ? (
					<>
						<div className="sticky top-0 z-40 mb-3 flex flex-col rounded-md bg-zinc-700 p-2 text-center text-xl font-bold sm:flex-row">
							<div
								className={`${chatPanelActive ? 'text-success' : ''} w-full cursor-pointer hover:rounded hover:outline hover:outline-emerald-600`}
								onClick={() => setChatPanelActive(true)}
							>
								Server Messages
							</div>
							<div className="divider m-0 sm:divider-horizontal sm:m-0"></div>
							<div
								className={`${!chatPanelActive ? 'text-success' : ''} w-full cursor-pointer hover:rounded hover:outline hover:outline-emerald-600`}
								onClick={() => setChatPanelActive(false)}
							>
								Console Panel
							</div>
						</div>
					</>
				) : (
					<div className="sticky text-center text-xl font-bold">
						Console Panel
					</div>
				)}

				{chatPanelActive ? (
					<>
						<ChatBubbles chatWindowRef={chatWindowsRef} />
					</>
				) : (
					<>
						<CommandBubbles />
					</>
				)}
			</div>
		</>
	);
}
