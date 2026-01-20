'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import { IssueCard } from '@/components/issue-card';

/**
 * Admin Dashboard
 * 
 * Shows all campus issues with filtering
 */
function AdminDashboard() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await issuesApi.getAll();
            setIssues(data);
        } catch (error) {
            console.error('Failed to load issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredIssues = issues.filter(issue => {
        if (filter === 'all') return true;
        if (filter === 'open') return ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'].includes(issue.status);
        if (filter === 'breached') return issue.slaResolutionBreached;
        return issue.status === filter.toUpperCase();
    });

    const stats = {
        total: issues.length,
        open: issues.filter(i => ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length,
        breached: issues.filter(i => i.slaResolutionBreached).length,
        resolved: issues.filter(i => i.status === 'RESOLVED').length,
    };

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card">
                    <p className="text-sm text-gray-600">Total Issues</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">Open Issues</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.open}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">SLA Breached</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.breached}</p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2 flex-wrap">
                {['all', 'open', 'submitted', 'assigned', 'in_progress', 'breached', 'resolved'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {f.replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Issues List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading issues...</p>
                </div>
            ) : filteredIssues.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 text-lg">No issues found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} isAdmin />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AdminDashboard, ['ADMIN', 'SUPER_ADMIN']);
