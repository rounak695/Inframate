'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

function IssuesPage() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await issuesApi.getAll();
            setIssues(data);
        } catch (error) {
            console.error('Failed to load issues', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</Badge>;
            case 'IN_PROGRESS':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</Badge>;
            case 'RESOLVED':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Resolved</Badge>;
            case 'CLOSED':
                return <Badge variant="outline">Closed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'CRITICAL':
                return <span className="text-red-600 font-bold text-xs uppercase">Critical</span>;
            case 'HIGH':
                return <span className="text-orange-600 font-semibold text-xs uppercase">High</span>;
            case 'MEDIUM':
                return <span className="text-blue-600 font-medium text-xs uppercase">Medium</span>;
            case 'LOW':
                return <span className="text-gray-500 font-medium text-xs uppercase">Low</span>;
            default:
                return priority;
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout title="Issue Tracker">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search issues..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="text-muted-foreground w-4 h-4" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Issues</CardTitle>
                        <CardDescription>
                            Comprehensive list of all facility reports across campus.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Issue</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Date</TableHead>
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
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No issues found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredIssues.map((issue) => (
                                            <TableRow key={issue.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{issue.title}</div>
                                                        <div className="text-xs text-muted-foreground line-clamp-1">{issue.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                                        {issue.category?.name || 'Uncategorized'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                                                <TableCell>{getStatusBadge(issue.status)}</TableCell>
                                                <TableCell>
                                                    {issue.assignee ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-bold">
                                                                {issue.assignee.name?.[0] || 'S'}
                                                            </div>
                                                            <span className="text-sm">{issue.assignee.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(issue.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(IssuesPage, ['ADMIN', 'SUPER_ADMIN']);
