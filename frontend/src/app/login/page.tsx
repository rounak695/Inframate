'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Lock, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authApi.login(formData);
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect based on role
            if (response.user.role === 'STUDENT') {
                router.push('/student/dashboard');
            } else if (response.user.role === 'STAFF') {
                router.push('/staff/dashboard');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full blur-sm animate-ping opacity-20"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-secondary rounded-full blur-sm animate-ping opacity-20 animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-accent rounded-full blur-sm animate-ping opacity-20 animation-delay-4000"></div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* Logo/Brand */}
                <div className="text-center mb-8 floating">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card mb-4 pulse-glow">
                        <Building2 className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Inframate</h1>
                    <p className="text-muted-foreground">Campus Infrastructure Management</p>
                </div>

                {/* Glass Card */}
                <Card className="glass-card border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm animate-slide-in">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground/90">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@campus.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground/90">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full glow-button h-11 font-semibold text-base"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Demo Credentials:</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Student:</span>
                                    <code className="text-xs bg-background/50 px-2 py-1 rounded">student@demo.edu</code>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Staff:</span>
                                    <code className="text-xs bg-background/50 px-2 py-1 rounded">staff@demo.edu</code>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Admin:</span>
                                    <code className="text-xs bg-background/50 px-2 py-1 rounded">admin@demo.edu</code>
                                </div>
                                <div className="mt-2 pt-2 border-t border-border/30">
                                    <span className="text-muted-foreground">Password:</span>
                                    <code className="text-xs bg-background/50 px-2 py-1 rounded ml-2">password123</code>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Powered by <span className="gradient-text font-semibold">Inframate</span> · Secure & Efficient
                </p>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
