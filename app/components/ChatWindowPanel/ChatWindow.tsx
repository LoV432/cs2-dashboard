'use client';
import { useState } from 'react';
import CommandBubbles from './CommandsBox/CommandBubbles';
import ChatBubbles from './MessagesBox/ChatBubbles';
import { dbReturnAllMessages } from '@/app/lib/get-server-messages';

export default function CommandsBox({
	prefetchedMessages,
	featureFlags
}: {
	prefetchedMessages: dbReturnAllMessages;
	featureFlags: {
		maxMindIsEnabled: boolean;
		adminPluginIsEnabled: boolean;
		vipPluginIsEnabled: boolean;
		chatLoggerEnabled: boolean;
	};
}) {
	const [chatPanelActive, setChatPanelActive] = useState(
		featureFlags.chatLoggerEnabled
	);
	if ('error' in prefetchedMessages) {
		prefetchedMessages = [];
	}
	const [chatStore, setChatStore] =
		useState<dbReturnAllMessages>(prefetchedMessages);
	return (
		<div className="mx-5 mb-16 mt-5 flex h-[38rem] w-full flex-col overflow-hidden sm:mb-0 sm:w-[44rem]">
			{featureFlags.chatLoggerEnabled ? (
				<>
					<div className="mb-2 flex flex-col rounded-md bg-zinc-800 p-2 text-center text-xl font-bold sm:flex-row">
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
				<div className="mb-2 text-center text-xl font-bold">Console Panel</div>
			)}
			<div className="h-full overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-800 px-3 py-2">
				{chatPanelActive ? (
					<>
						<ChatBubbles chatStore={chatStore} setChatStore={setChatStore} />
					</>
				) : (
					<>
						<CommandBubbles />
					</>
				)}
			</div>
		</div>
	);
}
