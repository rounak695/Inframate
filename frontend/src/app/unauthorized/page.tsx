'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-destructive/20 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4 text-destructive">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have permission to view this page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    Please log in with an account that has the required access rights or contact your administrator.
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link href="/login" className="w-full">
                        <Button className="w-full">Return to Login</Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button variant="ghost" className="w-full">Go Home</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
