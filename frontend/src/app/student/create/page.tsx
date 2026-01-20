'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { issuesApi } from '@/lib/api-client';

/**
 * Create Issue Page (Student)
 * 
 * Form for students to create new issues
 */
function CreateIssuePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        priority: 'MEDIUM',
        categoryId: '', // Would need to load categories
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await issuesApi.create(formData);
            router.push('/student');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <DashboardLayout title="Create New Issue">
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="card space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Title *
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., AC not working in Lab 3"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input min-h-[120px]"
                            placeholder="Describe the issue in detail..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., Lab 3, Building A, Floor 2"
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priority *
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="LOW">Low - Can wait a week</option>
                            <option value="MEDIUM">Medium - Needs attention soon</option>
                            <option value="HIGH">High - Urgent, within 24 hours</option>
                            <option value="CRITICAL">Critical - Immediate attention required</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Issue'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/student')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(CreateIssuePage, ['STUDENT', 'STAFF', 'ADMIN']);
