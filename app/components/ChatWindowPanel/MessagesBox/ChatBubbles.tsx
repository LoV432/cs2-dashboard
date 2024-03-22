'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { activeServerStore } from '../../../store/active-server-store';
import {
	getServerMessages,
	dbReturnAllMessages,
	getFirstMessageId
} from '../../../lib/get-server-messages';
import SendMessage from './SendMessage';
import Image from 'next/image';
import {
	prefetchedMessagesAtom,
	isHydrated as isHydratedAtom
} from '../../Misc/PrefetchedMessagesStore';

export default function ChatBubbles() {
	const [prefetchedMessages, setPrefetchedMessages] = useAtom(
		prefetchedMessagesAtom
	);
	const activeServer = useAtomValue(activeServerStore);
	const [chatStore, setChatStore] =
		useState<dbReturnAllMessages>(prefetchedMessages);
	const chatStoreRef = useRef<dbReturnAllMessages>(prefetchedMessages);
	const chatBoxAreaRef = useRef(
		null
	) as unknown as React.MutableRefObject<HTMLDivElement>;
	async function getInitChat() {
		const allMessages = await getServerMessages(activeServer);
		if ('error' in allMessages) {
			chatStoreRef.current = [];
			setChatStore([]);
			return;
		}
		chatStoreRef.current = allMessages;
		setChatStore(chatStoreRef.current);
		setPrefetchedMessages([]); // Clear prefetched messages or otherwise they will be shown when switching servers
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
		<div
			ref={chatBoxAreaRef}
			className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden"
		>
			<div>
				<OlderMessagesButton
					setChatStore={setChatStore}
					chatStoreRef={chatStoreRef}
					chatBoxAreaRef={chatBoxAreaRef}
				/>
				{chatStore.map((message) => (
					<ChatBubble key={message.id} message={message} />
				))}
				<SendMessage updateChat={updateChat} />
			</div>
		</div>
	);
}

export function ChatBubble({ message }: { message: dbReturnAllMessages[0] }) {
	const isHydrated = useAtomValue(isHydratedAtom);
	const time = useMemo(() => {
		if (!isHydrated)
			return message.time.toLocaleString('en-US', {
				year: '2-digit',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				timeZone: 'UTC'
			});
		return message.time.toLocaleString('en-US', {
			year: '2-digit',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	}, [isHydrated]);
	if (message.team == 'CONSOLE') {
		return (
			<>
				<div className="chat chat-start">
					<div className="avatar chat-image">
						<div className="w-10 !overflow-visible rounded-full">
							<a href={`admin.jpg`} target={'_blank'}>
								<Image
									loading="eager"
									alt={message.author_name}
									src={`terminal-outline.svg`}
									width={80}
									height={80}
								/>
							</a>
						</div>
					</div>
					<div className="chat-header">
						<a href={`admin.jpg`} target={'_blank'} className="text-rose-600">
							Console
						</a>
						<time
							className={`pl-2 text-xs opacity-50 ${isHydrated ? '' : 'invisible'}}`}
						>
							{time}
						</time>
					</div>
					<div className="chat-bubble mb-2 mt-1 break-all">
						{message.message}
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="chat chat-start">
				<div className="avatar chat-image">
					<div className="w-10 rounded-full">
						<a
							href={`https://steamcommunity.com/profiles/${message.author_id}`}
							target={'_blank'}
						>
							<Image
								loading="eager"
								alt={message.author_name}
								src={`https://avatars.akamai.steamstatic.com/${message.author_icon_url}`}
								width={80}
								height={80}
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
					<time
						className={`pl-2 text-xs opacity-50 ${isHydrated ? '' : 'invisible'}`}
					>
						{time}
					</time>
				</div>
				<div className="chat-bubble mb-2 mt-1 break-all">{message.message}</div>
			</div>
		</>
	);
}

export function OlderMessagesButton({
	setChatStore,
	chatStoreRef,
	chatBoxAreaRef
}: {
	setChatStore: React.Dispatch<React.SetStateAction<dbReturnAllMessages>>;
	chatStoreRef: React.MutableRefObject<dbReturnAllMessages>;
	chatBoxAreaRef: React.MutableRefObject<HTMLDivElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const [firstMessageId, setFirstMessageId] = useState<number | { error: any }>(
		{ error: true }
	);
	const [isLoading, setIsLoading] = useState(false);
	const deBounce = useRef<NodeJS.Timeout>();
	const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
	const shouldLoadButton = chatStoreRef.current[0]?.id != firstMessageId;
	async function updateOlderMessages() {
		if (isLoading) return;
		setIsLoading(true);
		const olderThan = chatStoreRef.current[0]?.id;
		const olderMessages = await getServerMessages(activeServer, olderThan || 0);
		if ('error' in olderMessages) {
			return;
		}
		chatStoreRef.current = [...olderMessages, ...chatStoreRef.current];
		setChatStore(chatStoreRef.current);
		setIsLoading(false);
	}
	function updateOnScroll() {
		if (deBounce.current) clearTimeout(deBounce.current);
		deBounce.current = setTimeout(() => {
			if (
				chatBoxAreaRef.current.scrollHeight +
					(chatBoxAreaRef.current.scrollTop -
						chatBoxAreaRef.current.clientHeight) <
					1 &&
				loadMoreButtonRef.current
			) {
				updateOlderMessages();
			}
		}, 150);
	}
	useEffect(() => {
		(async () => {
			setFirstMessageId(await getFirstMessageId(activeServer));
		})();
		chatBoxAreaRef.current?.addEventListener('scroll', updateOnScroll);
		return () => {
			chatBoxAreaRef.current?.removeEventListener('scroll', updateOnScroll);
		};
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
					ref={loadMoreButtonRef}
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
