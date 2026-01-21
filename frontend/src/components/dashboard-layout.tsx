'use client';

import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { navigationConfig } from '@/config/nav';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { Sparkles } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const navItems = user && user.role ? navigationConfig[user.role] || [] : [];

    return (
        <div className="min-h-screen flex relative">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-background -z-10" />

            {/* Desktop Sidebar */}
            <Sidebar items={navItems} user={user} onLogout={logout} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen mb-16 md:mb-0 md:ml-64">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center px-6 md:px-8">
                        {/* Title */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold gradient-text">{title}</h2>
                            </div>
                            <h2 className="md:hidden text-xl font-bold text-foreground">{title}</h2>
                        </div>

                        {/* Right Side */}
                        <div className="ml-auto flex items-center gap-4">
                            <NotificationsDropdown />

                            {/* User Info */}
                            {user && (
                                <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-border/50">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {user.role.toLowerCase()}
                                        </p>
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 animate-fade-in">
                    {children}
                </main>
            </div>

            {/* Bottom Navigation for Mobile */}
            <BottomNav items={navItems} />
        </div>
    );
}
