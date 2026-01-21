'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    iconColor?: string;
    gradient?: boolean;
}

export function StatsCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    iconColor = 'text-primary',
    gradient = false
}: StatsCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all hover:scale-[1.02]",
            gradient && "bg-gradient-to-br from-card to-muted/30"
        )} glass>
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />

            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold gradient-text">
                                {value}
                            </h3>
                            {change && (
                                <span className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                                    changeType === 'positive' && "bg-success/20 text-success",
                                    changeType === 'negative' && "bg-danger/20 text-danger",
                                    changeType === 'neutral' && "bg-muted text-muted-foreground"
                                )}>
                                    {change}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Icon */}
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm",
                        "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30",
                        "shadow-lg shadow-primary/20"
                    )}>
                        <Icon className={cn("w-6 h-6", iconColor)} />
                    </div>
                </div>
            </CardContent>

            {/* Bottom Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
        </Card>
    );
}
