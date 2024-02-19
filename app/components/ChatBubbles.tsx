'use client';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';
import {
	getServerMessages,
	dbReturnAllMessages
} from '../lib/get-server-messages';

export default function ChatBubbles({
	chatWindowRef
}: {
	chatWindowRef: React.MutableRefObject<HTMLDivElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const [chatStore, setChatStore] = useState<dbReturnAllMessages>([]);
	async function updateChat() {
		const allMessages = await getServerMessages(activeServer);
		if ('error' in allMessages) {
			console.log('Error loading messages');
			setChatStore([]);
			return;
		}
		setChatStore(allMessages);
	}
	useEffect(() => {
		updateChat();
	}, [activeServer]);
	return (
		<>
			{chatStore.map((message) => (
				<ChatBubble
					key={message.id}
					message={message}
					chatWindowRef={chatWindowRef}
				/>
			))}
		</>
	);
}

export function ChatBubble({
	message,
	chatWindowRef
}: {
	message: dbReturnAllMessages[0];
	chatWindowRef: React.MutableRefObject<HTMLDivElement>;
}) {
	useEffect(() => {
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
	}, []);
	return (
		<>
			<div className="chat chat-start">
				<div className="avatar chat-image">
					<div className="w-10 rounded-full">
						<a
							href={`https://steamcommunity.com/profiles/${message.author_id}`}
							target={'_blank'}
						>
							<img
								alt={message.author_name}
								src={`https://avatars.akamai.steamstatic.com/${message.author_icon_url}`}
							/>
						</a>
					</div>
				</div>
				<div className="chat-header">
					<a
						href={`https://steamcommunity.com/profiles/${message.author_id}`}
						target={'_blank'}
					>
						{message.author_name}
					</a>
					<time className="text-xs opacity-50">
						{' '}
						{message.time.toLocaleTimeString()}
					</time>
				</div>
				<div className="chat-bubble mb-2 mt-1">{message.message}</div>
			</div>
		</>
	);
}
