'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

interface AuthUser {
	id: string;
	username: string;
	email: string;
	createdAt: string;
}

interface AuthContextValue {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (token: string, user: AuthUser) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(user && token),
			login: (nextToken, nextUser) => {
				setToken(nextToken);
				setUser(nextUser);
			},
			logout: () => {
				setToken(null);
				setUser(null);
			},
		}),
		[token, user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);

	if (!context) {
		return {
			user: null,
			token: null,
			isAuthenticated: false,
			login: () => undefined,
			logout: () => undefined,
		};
	}

	return context;
}
