export default function Home() {
	return (
		<>
			<div className="flex h-screen min-h-screen flex-col justify-center">
				<div className="h-2/3 rounded-md border border-zinc-600 bg-zinc-800 p-2">
					<div className="chat chat-start">
						<div className="chat-bubble">
							It's over Anakin, <br />I have the high ground.
						</div>
					</div>
					<div className="chat chat-end">
						<div className="chat-bubble">You underestimate my power!</div>
					</div>
				</div>
				<div className="join mt-2 flex w-full justify-center">
					<div className="w-4/6">
						<div>
							<input
								className="input input-bordered join-item w-full"
								placeholder="Type Command..."
							/>
						</div>
					</div>
					<div className="indicator w-1/5">
						<button className="btn join-item w-full">Send</button>
					</div>
				</div>
			</div>
		</>
	);
}
