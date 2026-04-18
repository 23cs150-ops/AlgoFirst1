'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ListChecks, User, Code2, GraduationCap } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

const NAV_ITEMS = [
	{ href: '/problem-list', label: 'Problems', icon: ListChecks },
	{ href: '/student-plan', label: 'Student Plan', icon: GraduationCap },
	{ href: '/problem-detail', label: 'Problem Detail', icon: Code2 },
	{ href: '/progress', label: 'Progress', icon: BarChart3 },
	{ href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-sm hidden md:flex md:flex-col">
			<div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
				<AppLogo size={28} />
				<span className="text-zinc-100 font-semibold tracking-tight">AlgoFirst</span>
			</div>

			<nav className="p-3 space-y-1.5">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const active = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
								active
									? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
									: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent'
							}`}
						>
							<Icon size={16} />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
