import { format } from 'date-fns';

/**
 * Issue Card Component
 * 
 * Displays issue summary with status badges and SLA info
 */

interface IssueCardProps {
    issue: any;
    showActions?: boolean;
    isAdmin?: boolean;
}

export function IssueCard({ issue, showActions, isAdmin }: IssueCardProps) {
    const statusColors: Record<string, string> = {
        SUBMITTED: 'badge-info',
        ASSIGNED: 'badge-warning',
        IN_PROGRESS: 'badge-warning',
        RESOLVED: 'badge-success',
        VERIFIED: 'badge-success',
        CLOSED: 'badge-success',
    };

    const priorityColors: Record<string, string> = {
        LOW: 'text-gray-600',
        MEDIUM: 'text-blue-600',
        HIGH: 'text-orange-600',
        CRITICAL: 'text-red-600',
    };

    const slaBreached = issue.slaResolutionBreached || issue.slaResponseBreached;

    return (
        <div className={`card hover:shadow-md transition-shadow ${slaBreached ? 'border-red-300' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            #{issue.issueNumber} {issue.title}
                        </h3>
                        {slaBreached && (
                            <span className="badge badge-error text-xs">⚠️ SLA Breach</span>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{issue.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
                <span className={`badge ${statusColors[issue.status]}`}>
                    {issue.status}
                </span>
                <span className={`font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority}
                </span>
                {issue.category && (
                    <span className="text-gray-500">
                        📁 {issue.category.name}
                    </span>
                )}
                {issue.location && (
                    <span className="text-gray-500">
                        📍 {issue.location}
                    </span>
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                    Created {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                    {issue.creator && ` by ${issue.creator.firstName} ${issue.creator.lastName}`}
                </div>

                {issue.assignee && (
                    <div className="text-gray-600">
                        Assigned to: {issue.assignee.firstName} {issue.assignee.lastName}
                    </div>
                )}
            </div>

            {showActions && (
                <div className="mt-4 flex gap-2">
                    <button className="btn btn-primary text-sm">
                        View Details
                    </button>
                    {issue.status === 'ASSIGNED' && (
                        <button className="btn btn-secondary text-sm">
                            Start Work
                        </button>
                    )}
                    {issue.status === 'IN_PROGRESS' && (
                        <button className="btn btn-primary text-sm bg-green-600 hover:bg-green-700">
                            Mark Resolved
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
