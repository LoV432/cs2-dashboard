'use client';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';
const RecoilURLSyncJSON = dynamic(
	() => import('recoil-sync').then((m) => m.RecoilURLSyncJSON),
	{ ssr: false }
	// This is magic. I get this error when I try to use RecoilURLSyncJSON directly. The functionality still works tho.
	// Error:
	//  ⨯ node_modules/transit-js/transit.js (24:22) @ self
	//  ⨯ ReferenceError: self is not defined
	//  at __webpack_require__ (/home/lov432/vscode/cs2-dashboard/.next/server/webpack-runtime.js:33:42)
	//  at __webpack_require__ (/home/lov432/vscode/cs2-dashboard/.next/server/webpack-runtime.js:33:42)
	//  at eval (./app/components/RecoilRootWrapper.tsx:9:69)
	//  at (ssr)/./app/components/RecoilRootWrapper.tsx (/home/lov432/vscode/cs2-dashboard/.next/server/app/page.js:453:1)
	//  at __webpack_require__ (/home/lov432/vscode/cs2-dashboard/.next/server/webpack-runtime.js:33:42)
	// null
	// error
);

export default function RecoilRootWrapper({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<RecoilRoot>
			<RecoilURLSyncJSON location={{ part: 'queryParams' }}>
				{children}
			</RecoilURLSyncJSON>
		</RecoilRoot>
	);
}
