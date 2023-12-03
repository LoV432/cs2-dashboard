'use client';
import { useRef } from 'react';
import ChatBubbles from './ChatBubbles';
import SendCommand from './SendCommand';
import { RecoilRoot } from 'recoil';

export default function CommandsBox() {
	const chatWindowsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	return (
		<div className="flex h-2/3 flex-col place-items-center p-5 sm:w-2/3 lg:w-2/3 xl:w-1/3">
			<RecoilRoot>
				<div
					ref={chatWindowsRef}
					className="h-full w-full overflow-scroll rounded-md border border-zinc-600 bg-zinc-800 p-2"
				>
					<div className="sticky text-center text-xl font-bold">
						Console Panel
					</div>
					<ChatBubbles chatWindowRef={chatWindowsRef} />
				</div>
				<div className="join mt-2 flex w-full justify-center">
					<SendCommand />
				</div>
			</RecoilRoot>
		</div>
	);
}
