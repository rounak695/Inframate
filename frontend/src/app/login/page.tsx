'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-client';

/**
 * Login Page
 * 
 * Authenticates users and redirects to role-based dashboard
 */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user } = await authApi.login(email, password);

            // Redirect based on role
            switch (user.role) {
                case 'STUDENT':
                    router.push('/student');
                    break;
                case 'STAFF':
                    router.push('/staff');
                    break;
                case 'ADMIN':
                case 'SUPER_ADMIN':
                    router.push('/admin');
                    break;
                default:
                    router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="card max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inframate</h1>
                    <p className="text-gray-600">Campus Infrastructure Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="your.email@campus.edu"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        Demo Credentials:
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p><strong>Student:</strong> student@demo.edu / password123</p>
                        <p><strong>Staff:</strong> staff@demo.edu / password123</p>
                        <p><strong>Admin:</strong> admin@demo.edu / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
