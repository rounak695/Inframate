"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavItem } from "@/config/nav"
import { LogOut, Building2, Zap } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useState } from "react"

interface SidebarProps {
    items: NavItem[]
    user: any
    onLogout: () => void
}

export function Sidebar({ items, user, onLogout }: SidebarProps) {
    const pathname = usePathname()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    return (
        <>
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                {/* Sidebar with glassmorphism */}
                <div className="flex flex-col flex-grow glass-card border-r border-border/50 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">
                                Inframate
                            </h1>
                            {user?.campus && (
                                <span className="text-xs text-muted-foreground">
                                    {user.campus.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-3 py-6">
                        <nav className="flex flex-col space-y-1">
                            {items.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:scale-[1.02]",
                                            isActive
                                                ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border border-primary/30 shadow-lg shadow-primary/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                                        )}
                                        <Icon className={cn(
                                            "h-5 w-5 flex-shrink-0 transition-colors",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <Zap className="ml-auto w-3 h-3 text-primary animate-pulse" />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* User Section */}
                    <div className="border-t border-border/50 p-4 space-y-3">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-lg">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {user?.role?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start group hover:border-danger/50 hover:text-danger"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showLogoutConfirm}
                onOpenChange={setShowLogoutConfirm}
                onConfirm={onLogout}
                title="Logout"
                description="Are you sure you want to logout?"
            />
        </>
    )
}
