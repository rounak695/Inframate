'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { notificationsApi } from '@/lib/api-client';

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);

    // Simple check: In a real app, use SWR or React Query for polling/updates
    const fetchNotifications = async () => {
        try {
            const data = await notificationsApi.getAll();
            setNotifications(data);
        } catch (e) {
            console.error('Failed to fetch notifications', e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.length; // Assuming all returned are unread for now or filter if needed

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                    </div>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map((n) => (
                            <DropdownMenuItem key={n.id} className="cursor-pointer flex flex-col items-start p-3 gap-1">
                                <span className="font-medium text-sm">{n.subject}</span>
                                <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span>
                                <span className="text-[10px] text-muted-foreground pt-1">
                                    {new Date(n.createdAt).toLocaleTimeString()}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
