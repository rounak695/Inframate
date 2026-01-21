"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavItem } from "@/config/nav"

interface BottomNavProps {
    items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 md:hidden">
            {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors hover:text-primary",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                        <span>{item.name}</span>
                    </Link>
                )
            })}
        </div>
    )
}
