'use client';
import { commandChatHistory } from '../../../store/command-store';
import SendCommand from './SendCommand';
import { useState, useMemo } from 'react';
import { ActiveServerContext } from '@/app/providers/ActiveServerContext';
import { useContext, useEffect } from 'react';

export default function CommandBubbles() {
	const activeServer = useContext(ActiveServerContext);
	const [commandChatHistory, setCommandChatHistory] =
		useState<commandChatHistory>([]);

	useMemo(() => {
		if (commandChatHistory.length > 100) {
			commandChatHistory.splice(0, commandChatHistory.length - 100);
		}
		if (commandChatHistory.length === 0) {
			return;
		}
		sessionStorage.setItem(
			`command-chat-history-${activeServer}`,
			JSON.stringify(commandChatHistory)
		);
	}, [commandChatHistory]);
	useEffect(() => {
		const storedCommandChatHistory = sessionStorage.getItem(
			`command-chat-history-${activeServer}`
		);
		if (storedCommandChatHistory) {
			setCommandChatHistory(JSON.parse(storedCommandChatHistory));
		}
	}, []);
	return (
		<>
			<div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
				<div>
					{commandChatHistory.map((message) => (
						<CommandBubble
							key={message.id}
							text={message.text}
							type={message.type}
						/>
					))}
					<SendCommand setCommandChatHistory={setCommandChatHistory} />
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
