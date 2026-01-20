import { redirect } from 'next/navigation';

/**
 * Root Page
 * 
 * Redirects to login (unauthenticated users will land here)
 */
export default function HomePage() {
    redirect('/login');
}
