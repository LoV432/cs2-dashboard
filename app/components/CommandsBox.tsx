'use client';
import { useRef, useState } from 'react';
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
				className="no-scrollbar relative m-5 mb-16 flex h-[35rem] w-full flex-col overflow-y-scroll rounded-lg border-2 border-zinc-700 bg-zinc-800 p-5 sm:w-[44rem]"
			>
				{featureFlags.serverMessagesIsEnabled ? (
					<>
						<div className="sticky top-0 z-40 mb-3 flex flex-col place-items-center justify-center gap-0 rounded-md bg-zinc-700 p-2 text-center text-xl font-bold sm:flex-row sm:gap-5">
							<div
								className={`${chatPanelActive ? 'text-success' : ''} cursor-pointer`}
								onClick={() => setChatPanelActive(true)}
							>
								Server Messages
							</div>
							<div className="divider m-0 sm:divider-horizontal"></div>
							<div
								className={`${!chatPanelActive ? 'text-success' : ''} cursor-pointer`}
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
					<></>
				) : (
					<>
						<ChatBubbles chatWindowRef={chatWindowsRef} />
						<SendCommand />
					</>
				)}
			</div>
		</>
	);
}
