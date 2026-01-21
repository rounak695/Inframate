import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-primary/20",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/20",
                destructive:
                    "border-transparent bg-danger text-white hover:bg-danger/80 shadow-lg shadow-danger/20",
                outline: "text-foreground border-border bg-card/50 hover:bg-muted",
                success:
                    "border-transparent bg-success text-white hover:bg-success/80 shadow-lg shadow-success/20",
                warning:
                    "border-transparent bg-warning text-white hover:bg-warning/80 shadow-lg shadow-warning/20",
                info:
                    "border-transparent bg-info text-white hover:bg-info/80 shadow-lg shadow-info/20",
                glass:
                    "glass-card text-foreground hover:border-primary/50",
                gradient:
                    "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-lg",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
