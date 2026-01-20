'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';
import { IssueCard } from '@/components/issue-card';

/**
 * Student Dashboard
 * 
 * Shows student's created issues
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

    return (
        <DashboardLayout title="My Issues">
            <div className="mb-6">
                <a
                    href="/student/create"
                    className="btn btn-primary"
                >
                    ➕ Create New Issue
                </a>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading issues...</p>
                </div>
            ) : issues.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">No issues yet</p>
                    <p className="text-gray-500">Create your first issue to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(StudentDashboard, ['STUDENT']);
