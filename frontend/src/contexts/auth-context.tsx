'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAccessToken, clearTokens } from '@/lib/api-client';

/**
 * Authentication Context
 * 
 * Provides authentication state and user information throughout the app.
 */

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
    campusId: string;
    campus?: {
        id: string;
        name: string;
        subdomain: string;
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        const loadUser = () => {
            const token = getAccessToken();
            const storedUser = getUser();

            if (token && storedUser) {
                setUser(storedUser);
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const logout = () => {
        clearTokens();
        setUser(null);
        router.push('/login');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * 
 * Access authentication state in components
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
