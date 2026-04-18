import React from 'react';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type BadgeSize = 'sm' | 'md';

interface DifficultyBadgeProps {
	difficulty: Difficulty;
	size?: BadgeSize;
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
	sm: 'px-2 py-0.5 text-[11px]',
	md: 'px-2.5 py-1 text-xs',
};

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
	Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
	Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
	Hard: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function DifficultyBadge({ difficulty, size = 'sm' }: DifficultyBadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} ${DIFFICULTY_CLASSES[difficulty]}`}
		>
			{difficulty}
		</span>
	);
}
