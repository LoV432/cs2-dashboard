'use client';

import { RecoilRoot } from 'recoil';

export default function RecoilRootWrapper({
	children
}: {
	children: React.ReactNode;
}) {
	return <RecoilRoot>{children}</RecoilRoot>;
}
