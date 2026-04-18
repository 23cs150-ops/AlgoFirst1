import React from 'react';
import { Code2 } from 'lucide-react';

interface AppLogoProps {
	size?: number;
	className?: string;
}

export default function AppLogo({ size = 28, className }: AppLogoProps) {
	return (
		<div
			className={`rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow ${
				className ?? ''
			}`}
			style={{ width: size, height: size }}
			aria-label="AlgoFirst logo"
		>
			<Code2 size={Math.max(14, Math.round(size * 0.55))} />
		</div>
	);
}
