import './globals.css';

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html className="bg-black" lang="en">
			<body>{children}</body>
		</html>
	);
}
