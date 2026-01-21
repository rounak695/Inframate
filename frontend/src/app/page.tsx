import Link from 'next/link';

/**
 * Root Page
 * 
 * Simple landing page pointing to login.
 * Using explicit link instead of redirect to avoid potential boundary errors.
 */
export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to Inframate</h1>
            <p className="mb-8 text-gray-600">Campus Infrastructure Management System</p>

            <Link
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
                Go to Login
            </Link>
        </div>
    );
}
