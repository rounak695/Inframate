'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

/**
 * Protected Route HOC
 * 
 * Redirects unauthorized users to login
 */
export function withAuth(Component: React.ComponentType, allowedRoles?: string[]) {
    return function ProtectedRoute(props: any) {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    router.push('/login');
                } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                    // User logged in but doesn't have required role
                    router.push('/unauthorized');
                }
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }

        if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
            return null;
        }

        return <Component {...props} />;
    };
}
