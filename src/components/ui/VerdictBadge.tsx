import React from 'react';

type BadgeSize = 'sm' | 'md';
type Verdict =
	| 'Accepted'
	| 'Wrong Answer'
	| 'Time Limit Exceeded'
	| 'Runtime Error'
	| 'Compilation Error'
	| 'Pending'
	| 'Running';

interface VerdictBadgeProps {
	status: Verdict;
	size?: BadgeSize;
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
	sm: 'px-2 py-0.5 text-[11px]',
	md: 'px-2.5 py-1 text-xs',
};

const STATUS_CLASSES: Record<Verdict, string> = {
	Accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
	'Wrong Answer': 'bg-red-500/10 text-red-400 border-red-500/30',
	'Time Limit Exceeded': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
	'Runtime Error': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
	'Compilation Error': 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
	Pending: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
	Running: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function VerdictBadge({ status, size = 'sm' }: VerdictBadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} ${STATUS_CLASSES[status]}`}
		>
			{status}
		</span>
	);
}
