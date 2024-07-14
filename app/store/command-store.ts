export type commandChatHistory = {
	id: number;
	type: 'chat-start' | 'chat-end';
	text: string;
}[];

export type commandHistory = string[];
