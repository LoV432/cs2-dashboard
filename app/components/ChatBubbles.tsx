'use client';
import { useEffect } from 'react';
import { chatStore as chatStoreImport } from '../store/chat-store';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';

export default function ChatBubbles({
	chatWindowRef
}: {
	chatWindowRef: React.MutableRefObject<HTMLDivElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const chatStore = useAtomValue(chatStoreImport);
	useEffect(() => {
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
	}, [chatStore]);
	return (
		<>
			{chatStore
				.filter((message) => message.serverIndex == activeServer)
				.map((message) => (
					<ChatBubble
						key={message.id}
						text={message.text}
						type={message.type}
					/>
				))}
		</>
	);
}

export function ChatBubble({
	text,
	type
}: {
	text: string;
	type: 'chat-start' | 'chat-end';
}) {
	return (
		<div className={`chat ${type}`}>
			<div className="chat-bubble w-auto">
				<pre className="no-scrollbar overflow-x-scroll">
					{text.split('\n').map((line, i) => (
						<p key={i}>{line}</p>
					))}
				</pre>
			</div>
		</div>
	);
}
