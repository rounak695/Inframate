'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import { StatsCard } from '@/components/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

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

    const stats = [
        {
            title: 'My Issues',
            value: issues.length,
            icon: AlertTriangle,
        },
        {
            title: 'Pending',
            value: issues.filter(i => i.status === 'SUBMITTED').length,
            icon: Clock,
        },
        {
            title: 'Resolved',
            value: issues.filter(i => i.status === 'RESOLVED').length,
            icon: CheckCircle,
        },
    ];

    if (loading) {
        return (
            <DashboardLayout title="My Dashboard">
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-xl glass-card shimmer" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Dashboard">
            <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <Card glass className="border-2 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold gradient-text mb-2">
                                    Welcome Back! 👋
                                </h3>
                                <p className="text-muted-foreground">
                                    Report infrastructure issues and track their resolution
                                </p>
                            </div>
                            <Link href="/student/create">
                                <Button className="glow-button gap-2">
                                    <PlusCircle className="w-5 h-5" />
                                    Report Issue
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <StatsCard {...stat} gradient />
                        </div>
                    ))}
                </div>

                {/* Recent Issues */}
                <Card glass>
                    <CardHeader>
                        <CardTitle gradient className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            My Recent Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {issues.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No issues reported yet</p>
                                <Link href="/student/create">
                                    <Button className="mt-4 glow-button">Report Your First Issue</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {issues.slice(0, 5).map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all hover:scale-[1.01] cursor-pointer border border-border/50"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">{issue.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {format(new Date(issue.createdAt), 'MMM d, yyyy · h:mm a')}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                issue.status === 'RESOLVED' ? 'success' :
                                                    issue.status === 'IN_PROGRESS' ? 'info' : 'warning'
                                            }
                                        >
                                            {issue.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(StudentDashboard as any, ['STUDENT']);
