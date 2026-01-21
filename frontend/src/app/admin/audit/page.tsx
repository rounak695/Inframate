'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { auditApi } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Audit Log Page (Admin Only)
 * 
 * Displays comprehensive audit trail with filters and pagination
 */
function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

    // Filters
    const [actionFilter, setActionFilter] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');

    useEffect(() => {
        loadLogs();
    }, [pagination.page, actionFilter, entityTypeFilter]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const response = await auditApi.getAll({
                page: pagination.page,
                limit: pagination.limit,
                action: actionFilter || undefined,
                entityType: entityTypeFilter || undefined,
            });
            setLogs(response.logs);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <DashboardLayout title="Audit Logs">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>System Audit Trail</CardTitle>
                        <div className="flex gap-2">
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Actions</SelectItem>
                                    <SelectItem value="ISSUE_ASSIGNED">Issue Assigned</SelectItem>
                                    <SelectItem value="ISSUE_STATUS_CHANGED">Status Changed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by entity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">All Entities</SelectItem>
                                    <SelectItem value="Issue">Issue</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Changes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No audit logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            {log.user ? (
                                                <div>
                                                    <div className="font-medium">{log.user.firstName} {log.user.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">System</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {log.action.replace(/_/g, ' ')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{log.entityType}</div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                {log.entityId.substring(0, 8)}...
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <pre className="text-xs bg-muted p-2 rounded max-w-md overflow-auto">
                                                {JSON.stringify(log.changes, null, 2)}
                                            </pre>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {logs.length} of {pagination.total} entries
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <div className="flex items-center gap-2 px-4">
                                <span className="text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}

export default withAuth(AuditLogPage, ['ADMIN', 'SUPER_ADMIN']);
