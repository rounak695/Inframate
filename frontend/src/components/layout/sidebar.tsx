"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavItem } from "@/config/nav"
import { LogOut } from "lucide-react"

interface SidebarProps {
    items: NavItem[]
    user: any
    onLogout: () => void
}

export function Sidebar({ items, user, onLogout }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold tracking-tight text-primary">
                    Inframate
                </h1>
                {user?.campus && (
                    <span className="ml-2 text-xs text-muted-foreground">
                        {user.campus.name}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col space-y-1 px-4">
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t p-4">
                <div className="mb-4 flex items-center px-2">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-foreground">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
