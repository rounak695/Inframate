'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import { IssueCard } from '@/components/issue-card';

/**
 * Staff Dashboard
 * 
 * Shows issues assigned to staff member
 */
function StaffDashboard() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await issuesApi.getMyAssigned();
            setIssues(data);
        } catch (error) {
            console.error('Failed to load issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: issues.length,
        assigned: issues.filter(i => i.status === 'ASSIGNED').length,
        inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
        critical: issues.filter(i => i.priority === 'CRITICAL').length,
    };

    return (
        <DashboardLayout title="Assigned to Me">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card">
                    <p className="text-sm text-gray-600">Total Assigned</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">New</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.assigned}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">Critical</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.critical}</p>
                </div>
            </div>

            {/* Issues List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading issues...</p>
                </div>
            ) : issues.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 text-lg">No issues assigned to you</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} showActions />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(StaffDashboard, ['STAFF', 'ADMIN']);
