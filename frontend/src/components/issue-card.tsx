import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, MapPin, Folder, CheckCircle, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueCardProps {
    issue: any;
    showActions?: boolean;
    isAdmin?: boolean;
}

export function IssueCard({ issue, showActions, isAdmin }: IssueCardProps) {
    const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
        SUBMITTED: 'secondary',
        ASSIGNED: 'warning',
        IN_PROGRESS: 'info' as any, // Using 'info' if available or mapped to a standard variant
        RESOLVED: 'success',
        VERIFIED: 'success',
        CLOSED: 'outline',
    };

    // Need to handle "info" variant if not standard in badge types, but I added it in globals css. 
    // However, the Badge component props might strict check "info".
    // I added "info" to Badge variants in previous step.

    const priorityColors: Record<string, string> = {
        LOW: 'text-muted-foreground',
        MEDIUM: 'text-blue-500',
        HIGH: 'text-orange-500',
        CRITICAL: 'text-red-500 font-bold',
    };

    const slaBreached = issue.slaResolutionBreached || issue.slaResponseBreached;

    return (
        <Card className={cn(
            "hover:shadow-md transition-shadow",
            slaBreached && "border-destructive/50 bg-destructive/5"
        )}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-mono">#{issue.issueNumber}</span>
                            <Badge variant={statusVariant[issue.status] || 'default'}>
                                {issue.status.replace('_', ' ')}
                            </Badge>
                            {slaBreached && (
                                <Badge variant="destructive" className="items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    SLA Breach
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-lg line-clamp-1">{issue.title}</CardTitle>
                    </div>
                    {issue.priority && (
                        <div className={cn("text-xs font-medium uppercase tracking-wider", priorityColors[issue.priority])}>
                            {issue.priority} Priority
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {issue.description}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    {issue.category && (
                        <div className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {issue.category.name}
                        </div>
                    )}
                    {issue.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {issue.location}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                    </div>
                </div>
            </CardContent>

            {/* Optional Footer for Actions or Assignee info */}
            {(showActions || issue.assignee) && (
                <CardFooter className="pt-2 border-t bg-muted/20 flex justify-between items-center text-xs">
                    <div className="text-muted-foreground">
                        {issue.assignee ? (
                            <span>Assigned to: <span className="font-medium text-foreground">{issue.assignee.firstName} {issue.assignee.lastName}</span></span>
                        ) : (
                            <span>Unassigned</span>
                        )}
                    </div>

                    {showActions && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                View
                            </Button>
                        </div>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
