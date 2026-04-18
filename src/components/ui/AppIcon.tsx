import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

type IconName = 'ArrowLeftIcon' | 'HomeIcon';

interface AppIconProps {
	name: IconName;
	size?: number;
	className?: string;
}

const ICON_MAP: Record<IconName, React.ComponentType<{ size?: number; className?: string }>> = {
	ArrowLeftIcon: ArrowLeft,
	HomeIcon: Home,
};

export default function AppIcon({ name, size = 16, className }: AppIconProps) {
	const Icon = ICON_MAP[name];
	return <Icon size={size} className={className} />;
}
