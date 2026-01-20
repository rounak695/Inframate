'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

/**
 * Dashboard Layout
 * 
 * Common layout for all authenticated pages with sidebar navigation
 */

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { user, logout } = useAuth();

    const navigation = {
        STUDENT: [
            { name: 'My Issues', href: '/student', icon: '📋' },
            { name: 'Create Issue', href: '/student/create', icon: '➕' },
        ],
        STAFF: [
            { name: 'Assigned to Me', href: '/staff', icon: '📋' },
            { name: 'All Issues', href: '/staff/issues', icon: '📊' },
        ],
        ADMIN: [
            { name: 'Dashboard', href: '/admin', icon: '📊' },
            { name: 'All Issues', href: '/admin/issues', icon: '📋' },
            { name: 'Users', href: '/admin/users', icon: '👥' },
            { name: 'Categories', href: '/admin/categories', icon: '🏷️' },
        ],
        SUPER_ADMIN: [
            { name: 'All Campuses', href: '/admin/campuses', icon: '🏫' },
            { name: 'All Issues', href: '/admin/issues', icon: '📋' },
        ],
    };

    const navItems = user ? navigation[user.role] || [] : [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Inframate</h1>
                            {user?.campus && (
                                <span className="ml-4 text-sm text-gray-500">
                                    {user.campus.name}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-gray-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="btn btn-secondary text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
