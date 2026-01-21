import React from 'react';
import { FileQuestion, AlertCircle, Inbox } from 'lucide-react';

interface EmptyStateProps {
    icon?: 'inbox' | 'alert' | 'question';
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
    const IconComponent = {
        inbox: Inbox,
        alert: AlertCircle,
        question: FileQuestion,
    }[icon];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <IconComponent className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
