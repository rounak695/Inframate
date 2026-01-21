'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi, usersApi, analyticsApi } from '@/lib/api-client';
import { StatsCard } from '@/components/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OverviewCharts } from '@/components/admin/overview-charts';
import {
    AlertCircle, CheckCircle, Clock, TrendingUp, Users, Activity,
    FileText, Zap, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [recentIssues, setRecentIssues] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(false);
        try {
            const [overviewData, metricsData, issuesData] = await Promise.all([
                analyticsApi.getOverview(7),
                analyticsApi.getMetrics(7),
                issuesApi.getAll()
            ]);

            setOverview(overviewData);
            setMetrics(metricsData);
            setRecentIssues(issuesData.slice(0, 5));
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Dashboard">
                <div className="space-y-6 animate-fade-in">
                    {/* Loading Skeletons */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 rounded-xl glass-card shimmer" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = overview ? [
        {
            title: 'Total Issues',
            value: overview.totalIssues || 0,
            change: '+12%',
            changeType: 'positive' as const,
            icon: FileText,
        },
        {
            title: 'Active Issues',
            value: overview.activeIssues || 0,
            change: '-5%',
            changeType: 'positive' as const,
            icon: Activity,
        },
        {
            title: 'Resolved',
            value: overview.resolvedIssues || 0,
            change: '+23%',
            changeType: 'positive' as const,
            icon: CheckCircle,
        },
        {
            title: 'Avg Resolution',
            value: overview.avgResolutionTime || '2.5h',
            change: '-15min',
            changeType: 'positive' as const,
            icon: Clock,
        },
    ] : [];

    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-6 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <StatsCard {...stat} gradient />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                {metrics && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card glass className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                            <CardHeader>
                                <CardTitle gradient className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Analytics Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OverviewCharts
                                    statusData={metrics.statusData || []}
                                    categoryData={metrics.categoryData || []}
                                />
                            </CardContent>
                        </Card>

                        {/* Recent Issues */}
                        <Card glass className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle gradient className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Recent Issues
                                </CardTitle>
                                <Link href="/admin/issues">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        View All
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentIssues.map((issue) => (
                                        <div
                                            key={issue.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all hover:scale-[1.02] cursor-pointer border border-border/50"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-foreground truncate">
                                                    {issue.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    issue.status === 'RESOLVED' ? 'success' :
                                                        issue.status === 'IN_PROGRESS' ? 'info' :
                                                            issue.priority === 'HIGH' ? 'warning' : 'default'
                                                }
                                            >
                                                {issue.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions */}
                <Card glass className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                    <CardHeader>
                        <CardTitle gradient>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Link href="/admin/users">
                                <Button variant="glass" className="w-full h-20 flex-col gap-2">
                                    <Users className="w-6 h-6" />
                                    <span>Manage Users</span>
                                </Button>
                            </Link>
                            <Link href="/admin/issues">
                                <Button variant="glass" className="w-full h-20 flex-col gap-2">
                                    <FileText className="w-6 h-6" />
                                    <span>View All Issues</span>
                                </Button>
                            </Link>
                            <Link href="/admin/audit">
                                <Button variant="glass" className="w-full h-20 flex-col gap-2">
                                    <Activity className="w-6 h-6" />
                                    <span>Audit Logs</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(AdminDashboard as any, ['ADMIN', 'SUPER_ADMIN']);
