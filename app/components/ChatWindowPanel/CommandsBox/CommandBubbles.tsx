'use client';
import { commandStore as commadStoreImport } from '../../../store/command-store';
import { useAtomValue } from 'jotai';
import SendCommand from './SendCommand';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext } from 'react';

export default function CommandBubbles() {
	const commandStore = useAtomValue(commadStoreImport);
	const activeServer = useContext(ActiveServerContext);
	return (
		<>
			<div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
				<div>
					{commandStore
						.filter((message) => message.serverIndex == activeServer)
						.map((message) => (
							<CommandBubble
								key={message.id}
								text={message.text}
								type={message.type}
							/>
						))}
					<SendCommand />
				</div>
			</div>
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
