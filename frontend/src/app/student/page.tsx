'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import { IssueCard } from '@/components/issue-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, CheckCircle } from 'lucide-react';

/**
 * Student Dashboard
 * 
 * Shows overview stats and list of created issues
 */
function StudentDashboard() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await issuesApi.getMyCreated();
            setIssues(data);
        } catch (error) {
            console.error('Failed to load issues:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalIssues = issues.length;
    const inProgress = issues.filter(i => ['ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length;
    const resolved = issues.filter(i => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(i.status)).length;

    return (
        <DashboardLayout title="My Dashboard">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalIssues}</div>
                        <p className="text-xs text-muted-foreground">All reported issues</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgress}</div>
                        <p className="text-xs text-muted-foreground">Currently being worked on</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{resolved}</div>
                        <p className="text-xs text-muted-foreground">Successfully fixed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions & List Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight">Recent Issues</h2>
                <Link href="/student/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Issue
                    </Button>
                </Link>
            </div>

            {/* Issues List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : issues.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                    <CardContent>
                        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                            <PlusCircle className="h-full w-full" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No issues reported</h3>
                        <p className="text-muted-foreground mb-6">
                            Everything seems fine! Or is there something broken?
                        </p>
                        <Link href="/student/create">
                            <Button variant="outline">Report an Issue</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} showActions />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(StudentDashboard, ['STUDENT']);
