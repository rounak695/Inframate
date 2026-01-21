"use client"

import { cn } from "@/lib/utils"
import { Check, Circle, Clock, AlertCircle } from "lucide-react"

interface IssueTimelineProps {
    currentStatus: string
    className?: string
    statusHistory?: any[] // Future proofing for actual history data
}

const STEPS = [
    { id: 'SUBMITTED', label: 'Submitted', description: 'Issue reported' },
    { id: 'ASSIGNED', label: 'Assigned', description: 'Staff assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress', description: 'Work started' },
    { id: 'RESOLVED', label: 'Resolved', description: 'Issue fixed' },
    // 'VERIFIED' and 'CLOSED' can be considered post-resolution states or grouped with Resolved for this simple view
]

export function IssueTimeline({ currentStatus, className }: IssueTimelineProps) {
    // Helper to determine step state
    const getStepStatus = (stepId: string) => {
        const statusOrder = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED']
        const currentIndex = statusOrder.indexOf(currentStatus)
        const stepIndex = statusOrder.indexOf(stepId)

        if (currentStatus === 'reopened') return 'error' // Edge case handling if needed

        if (stepIndex < currentIndex) return 'completed'
        if (stepIndex === currentIndex) return 'current'
        return 'pending'
    }

    return (
        <div className={cn("w-full", className)}>
            <div className="relative flex flex-col md:flex-row justify-between w-full">
                {/* Connecting Line (Desktop) */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 hidden md:block -z-10" />

                {/* Connecting Line (Mobile) */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 md:hidden -z-10" />

                {STEPS.map((step, index) => {
                    const status = getStepStatus(step.id)

                    return (
                        <div key={step.id} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 bg-background md:bg-transparent py-2 md:py-0 pr-4 md:pr-0">
                            {/* Icon Circle */}
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors z-10 bg-background",
                                    status === 'completed' && "border-primary bg-primary text-primary-foreground",
                                    status === 'current' && "border-primary ring-4 ring-primary/20",
                                    status === 'pending' && "border-muted-foreground/30 text-muted-foreground/30"
                                )}
                            >
                                {status === 'completed' ? (
                                    <Check className="h-4 w-4" />
                                ) : status === 'current' ? (
                                    <Clock className="h-4 w-4 text-primary" />
                                ) : (
                                    <Circle className="h-3 w-3 fill-current" />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className={cn(
                                "flex flex-col md:items-center md:text-center",
                                status === 'pending' && "opacity-50"
                            )}>
                                <span className="text-sm font-semibold">{step.label}</span>
                                <span className="text-xs text-muted-foreground">{step.description}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
