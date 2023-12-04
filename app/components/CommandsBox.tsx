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
			className="m-5 flex h-[35rem] w-full flex-col overflow-scroll rounded-lg border-2 border-zinc-700 bg-zinc-800 p-5 sm:w-[44rem]"
		>
			<RecoilRoot>
				<div className="sticky text-center text-xl font-bold">
					Console Panel
				</div>
				<div className="mb-2">
					<ChatBubbles chatWindowRef={chatWindowsRef} />
				</div>
				<div className="join mt-auto flex w-full justify-center">
					<SendCommand />
				</div>
			</RecoilRoot>
		</div>
	);
}
