'use client';

import React from 'react';
import CollapsibleSidebar from './layout/CollapsibleSidebar';

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
			<CollapsibleSidebar />
			<main className="flex-1 min-w-0">{children}</main>
		</div>
	);
}
