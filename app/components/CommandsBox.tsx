'use client';
import { useRef } from 'react';
import ChatBubbles from './ChatBubbles';
import SendCommand from './SendCommand';
import { RecoilRoot } from 'recoil';

export default function CommandsBox() {
	const chatWindowsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	return (
		<div
			ref={chatWindowsRef}
			className="no-scrollbar m-5 mb-16 flex h-[35rem] w-full flex-col overflow-y-scroll rounded-lg border-2 border-zinc-700 bg-zinc-800 p-5 sm:w-[44rem]"
		>
			<RecoilRoot>
				<div className="sticky text-center text-xl font-bold">
					Console Panel
				</div>
				<ChatBubbles chatWindowRef={chatWindowsRef} />
				<SendCommand />
			</RecoilRoot>
		</div>
	);
}
