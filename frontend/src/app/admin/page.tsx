'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi, usersApi } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OverviewCharts } from '@/components/admin/overview-charts';

/**
 * Admin Dashboard
 * 
 * Shows interactive issues table with assignment & status controls
 */
function AdminDashboard() {
    const [issues, setIssues] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [issuesData, usersData] = await Promise.all([
                issuesApi.getAll(),
                usersApi.getAll()
            ]);
            setIssues(issuesData);
            setStaffList(usersData.filter((u: any) => u.role === 'STAFF')); // Filter only staff
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (issueId: string, staffId: string) => {
        try {
            // Optimistic update
            setIssues(prev => prev.map(i =>
                i.id === issueId ? { ...i, assignee: staffList.find(s => s.id === staffId), status: 'ASSIGNED' } : i
            ));

            await issuesApi.assign(issueId, { assigneeId: staffId });
        } catch (error) {
            console.error('Failed to assign:', error);
            loadData(); // Revert on failure
        }
    };

    const handleStatusUpdate = async (issueId: string, newStatus: string) => {
        try {
            setIssues(prev => prev.map(i =>
                i.id === issueId ? { ...i, status: newStatus } : i
            ));

            await issuesApi.updateStatus(issueId, { status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
            loadData();
        }
    };

    // Filter logic
    const filteredIssues = issues.filter(issue => {
        if (statusFilter === 'ALL') return true;
        if (statusFilter === 'OPEN') return ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'].includes(issue.status);
        return issue.status === statusFilter;
    });

    // Stats
    const stats = {
        total: issues.length,
        open: issues.filter(i => ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length,
        breached: issues.filter(i => i.slaResolutionBreached).length,
        resolved: issues.filter(i => i.status === 'RESOLVED').length,
    };

    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
        SUBMITTED: 'secondary',
        ASSIGNED: 'warning',
        IN_PROGRESS: 'default', // Map to default/primary
        RESOLVED: 'success',
        VERIFIED: 'success',
        CLOSED: 'outline',
    };

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SLA Breached</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.breached}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Charts */}
            <OverviewCharts issues={issues} />

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Recent Issues</h3>
                    <div className="w-[200px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Issues</SelectItem>
                                <SelectItem value="OPEN">Open Issues</SelectItem>
                                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Issue Details</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredIssues.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No issues found matching filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredIssues.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-mono text-xs">#{issue.issueNumber}</TableCell>
                                    <TableCell>
                                        <div className="font-medium line-clamp-1">{issue.title}</div>
                                        <div className="text-xs text-muted-foreground capitalize">
                                            {issue.priority.toLowerCase()} Priority • {issue.category?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{issue.location || '-'}</TableCell>
                                    <TableCell>
                                        <div className="w-[140px]">
                                            <Select
                                                defaultValue={issue.status}
                                                onValueChange={(val) => handleStatusUpdate(issue.id, val)}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-[180px]">
                                            <Select
                                                defaultValue={issue.assignee?.id || "unassigned"}
                                                onValueChange={(val) => handleAssign(issue.id, val)}
                                            >
                                                <SelectTrigger className={`h-8 ${!issue.assignee ? "text-muted-foreground" : ""}`}>
                                                    <SelectValue placeholder="Unassigned" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {staffList.map(staff => (
                                                        <SelectItem key={staff.id} value={staff.id}>
                                                            {staff.firstName} {staff.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {format(new Date(issue.createdAt), 'MMM d')}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(AdminDashboard, ['ADMIN', 'SUPER_ADMIN']);
