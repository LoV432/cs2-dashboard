'use client';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';
import {
	getServerMessages,
	dbReturnAllMessages,
	getFirstMessageId
} from '../lib/get-server-messages';

export default function ChatBubbles() {
	const activeServer = useAtomValue(activeServerStore);
	const [chatStore, setChatStore] = useState<dbReturnAllMessages>([]);
	const chatStoreRef = useRef<dbReturnAllMessages>([]);
	async function getInitChat() {
		const allMessages = await getServerMessages(activeServer);
		if ('error' in allMessages) {
			console.log('Error loading messages');
			setChatStore([]);
			return;
		}
		chatStoreRef.current = allMessages;
		setChatStore(chatStoreRef.current);
	}
	async function updateChat() {
		const lastMessageId =
			chatStoreRef.current[chatStoreRef.current.length - 1]?.id;
		const newMessages = await getServerMessages(
			activeServer,
			0,
			lastMessageId || 0
		);
		if ('error' in newMessages) {
			console.log('Error loading messages');
			return;
		}
		chatStoreRef.current = [...chatStoreRef.current, ...newMessages];
		setChatStore(chatStoreRef.current);
	}
	useEffect(() => {
		getInitChat();
		const interval = setInterval(() => updateChat(), 5000);
		return () => {
			clearInterval(interval);
		};
	}, [activeServer]);
	return (
		<div className="flex h-full flex-col-reverse overflow-x-hidden overflow-y-scroll">
			<div>
				<OlderMessagesButton
					setChatStore={setChatStore}
					chatStoreRef={chatStoreRef}
				/>
				{chatStore.map((message) => (
					<ChatBubble key={message.id} message={message} />
				))}
			</div>
		</div>
	);
}

export function ChatBubble({ message }: { message: dbReturnAllMessages[0] }) {
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
						{message.time.toLocaleString('en-US', {
							year: '2-digit',
							month: 'numeric',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric'
						})}
					</time>
				</div>
				<div className="chat-bubble mb-2 mt-1">{message.message}</div>
			</div>
		</>
	);
}

export function OlderMessagesButton({
	setChatStore,
	chatStoreRef
}: {
	setChatStore: React.Dispatch<React.SetStateAction<dbReturnAllMessages>>;
	chatStoreRef: React.MutableRefObject<dbReturnAllMessages>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const [firstMessageId, setFirstMessageId] = useState<
		number | { error: boolean }
	>({ error: true });
	const [isLoading, setIsLoading] = useState(false);
	const shouldLoadButton = chatStoreRef.current[0]?.id != firstMessageId;
	async function updateOlderMessages() {
		if (isLoading) return;
		setIsLoading(true);
		const olderThan = chatStoreRef.current[0]?.id;
		const olderMessages = await getServerMessages(activeServer, olderThan || 0);
		if ('error' in olderMessages) {
			console.log('Error loading messages');
			return;
		}
		chatStoreRef.current = [...olderMessages, ...chatStoreRef.current];
		setChatStore(chatStoreRef.current);
		setIsLoading(false);
	}
	useEffect(() => {
		(async () => {
			setFirstMessageId(await getFirstMessageId(activeServer));
		})();
	}, [activeServer]);
	if (
		typeof firstMessageId == 'object' ||
		chatStoreRef.current[0]?.id == undefined
	)
		return null;
	return (
		<>
			{shouldLoadButton && !isLoading && (
				<button
					onClick={updateOlderMessages}
					className={`btn btn-ghost btn-sm w-full text-center`}
				>
					Load older messages
				</button>
			)}
			{isLoading && (
				<button className={`btn btn-ghost btn-sm w-full text-center`}>
					Loading...
				</button>
			)}
		</>
	);
}
