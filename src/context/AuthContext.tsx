'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
	isLoading: boolean;
	login: (token: string, user: AuthUser) => void;
	logout: () => void;
	setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Restore auth state from localStorage on mount
	useEffect(() => {
		const restoreAuthState = async () => {
			try {
				const savedToken = localStorage.getItem('authToken');

				if (savedToken) {
					setToken(savedToken);
					// Fetch authoritative user + stats from backend
					try {
						const { fetchCurrentUser } = await import('@/services/api');
						const resp = await fetchCurrentUser();
						if (resp && resp.success && resp.user) {
							setUser({
								id: resp.user.id,
								username: resp.user.username,
								email: resp.user.email,
								createdAt: resp.user.createdAt,
							});
							localStorage.setItem('authUser', JSON.stringify({ id: resp.user.id, username: resp.user.username, email: resp.user.email, createdAt: resp.user.createdAt }));
						}
					} catch (err) {
						// If profile fetch fails, fall back to any cached user
						const savedUser = localStorage.getItem('authUser');
						if (savedUser) setUser(JSON.parse(savedUser));
					}
				}
			} catch (error) {
				console.error('Failed to restore auth state:', error);
				localStorage.removeItem('authToken');
				localStorage.removeItem('authUser');
			} finally {
				setIsLoading(false);
			}
		};

		restoreAuthState();
	}, []);

	const handleLogin = (nextToken: string, nextUser: AuthUser) => {
		setToken(nextToken);
		setUser(nextUser);
		localStorage.setItem('authToken', nextToken);
		localStorage.setItem('authUser', JSON.stringify(nextUser));
	};

	const handleLogout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('authToken');
		localStorage.removeItem('authUser');
	};

	const handleSetUser = (nextUser: AuthUser | null) => {
		setUser(nextUser);
		if (nextUser) {
			localStorage.setItem('authUser', JSON.stringify(nextUser));
		} else {
			localStorage.removeItem('authUser');
		}
	};

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(user && token),
			isLoading,
			login: handleLogin,
			logout: handleLogout,
			setUser: handleSetUser,
		}),
		[token, user, isLoading],
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
			isLoading: true,
			login: () => undefined,
			logout: () => undefined,
			setUser: () => undefined,
		};
	}

	return context;
}
