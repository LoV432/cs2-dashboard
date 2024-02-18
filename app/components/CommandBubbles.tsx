'use client';
import { useEffect } from 'react';
import { commandStore as commadStoreImport } from '../store/command-store';
import { useAtomValue } from 'jotai';
import { activeServerStore } from '../store/active-server-store';

export default function CommandBubbles({
	chatWindowRef
}: {
	chatWindowRef: React.MutableRefObject<HTMLDivElement>;
}) {
	const activeServer = useAtomValue(activeServerStore);
	const commandStore = useAtomValue(commadStoreImport);
	useEffect(() => {
		chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
	}, [commandStore]);
	return (
		<>
			{commandStore
				.filter((message) => message.serverIndex == activeServer)
				.map((message) => (
					<CommandBubble
						key={message.id}
						text={message.text}
						type={message.type}
					/>
				))}
		</>
	);
}

export function CommandBubble({
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
