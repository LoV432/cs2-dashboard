import './globals.css';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
	title: 'CS2 Dashboard',
	description: 'CS2 Dashboard'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html className="bg-black" lang="en">
			<body>
				<NextTopLoader color="white" />
				{children}
			</body>
		</html>
	);
}
