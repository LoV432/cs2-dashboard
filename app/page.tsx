'use client';
import { useRef } from 'react';
import ChatBubbles from './components/ChatBubbles';
import SendCommand from './components/SendCommand';
import { RecoilRoot } from 'recoil';

export default function Home() {
	const chatWindowsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	return (
		<>
			<div className="flex h-screen min-h-screen flex-col place-items-center justify-center">
				<RecoilRoot>
					<div
						ref={chatWindowsRef}
						className="h-2/3 overflow-scroll rounded-md border border-zinc-600 bg-zinc-800 p-2 sm:w-2/3 lg:w-2/3 xl:w-1/3"
					>
						<ChatBubbles chatWindowRef={chatWindowsRef} />
					</div>
					<div className="join mt-2 flex w-full justify-center sm:w-2/3 lg:w-2/3 xl:w-1/3">
						<SendCommand />
					</div>
				</RecoilRoot>
			</div>
		</>
	);
}
