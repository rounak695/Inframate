'use client';

import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { navigationConfig } from '@/config/nav';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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

    // Safety check for user role to avoid crashes if role is undefined or invalid
    const navItems = user && user.role ? navigationConfig[user.role] || [] : [];

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Desktop Sidebar */}
            <Sidebar items={navItems} user={user} onLogout={logout} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen mb-16 md:mb-0">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6 md:hidden">
                    <h1 className="text-lg font-semibold text-foreground">Inframate</h1>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Logout</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
                    </div>
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav items={navItems} />
        </div>
    );
}
