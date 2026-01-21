'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Building2, Zap, Bell, BarChart3, Users, Shield,
    ArrowRight, Check, Star, TrendingUp, Clock, Award
} from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: Zap,
            title: 'Lightning Fast Reporting',
            description: 'Submit infrastructure issues in seconds with our intuitive mobile-first interface',
        },
        {
            icon: Bell,
            title: 'Real-time Notifications',
            description: 'Stay updated with instant alerts on issue status, assignments, and resolutions',
        },
        {
            icon: BarChart3,
            title: 'Powerful Analytics',
            description: 'Gain insights with comprehensive dashboards and performance metrics',
        },
        {
            icon: Users,
            title: 'Multi-role Access',
            description: 'Purpose-built interfaces for students, staff, and administrators',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Enterprise-grade security with role-based access control and audit logging',
        },
        {
            icon: TrendingUp,
            title: 'Improve Efficiency',
            description: 'Reduce resolution time by 40% with automated workflows and smart routing',
        },
    ];

    const benefits = [
        { role: 'Students', benefit: 'Report issues anytime, anywhere', icon: '📱' },
        { role: 'Staff', benefit: 'Manage tasks efficiently with priority queues', icon: '⚡' },
        { role: 'Admins', benefit: 'Complete oversight with analytics and reporting', icon: '📊' },
    ];

    const stats = [
        { value: '99.9%', label: 'Uptime' },
        { value: '40%', label: 'Faster Resolution' },
        { value: '10K+', label: 'Issues Resolved' },
        { value: '4.9/5', label: 'User Rating' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full border-b border-border/50 backdrop-blur-xl bg-background/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Inframate</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Benefits
                        </Link>
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Login
                        </Link>
                        <Link href="/login">
                            <Button className="glow-button">Get Started</Button>
                        </Link>
                    </div>

                    <Link href="/login" className="md:hidden">
                        <Button size="sm">Login</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center space-y-8 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-4">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-sm">Trusted by leading educational institutions</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Modern Campus
                            <br />
                            <span className="gradient-text">Infrastructure Management</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                            Streamline issue reporting and resolution across your campus.
                            Empower students, enable staff, and elevate administration.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/login">
                                <Button size="lg" className="glow-button text-lg px-8 h-14 gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="glass" className="text-lg px-8 h-14">
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                Free trial
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                No credit card
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                Cancel anytime
                            </div>
                        </div>
                    </div>

                    {/* Hero Image/Preview */}
                    <div className="mt-16 animate-slide-up">
                        <div className="glass-card p-2 rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/10">
                            <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl aspect-video flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <Building2 className="w-10 h-10 text-white" />
                                    </div>
                                    <p className="text-muted-foreground">Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border/50 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Everything you need to manage campus infrastructure
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Powerful features designed for modern educational institutions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-6 rounded-xl card-hover-lift animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 px-4 bg-muted/20">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Built for everyone on campus
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Tailored experiences for each role
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="text-center p-8 glass-card rounded-xl card-hover-lift"
                            >
                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold gradient-text mb-3">{benefit.role}</h3>
                                <p className="text-muted-foreground">{benefit.benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="glass-card p-12 rounded-2xl border-2 border-primary/30 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Start your free trial today
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join leading institutions using Inframate to transform campus operations
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="glow-button text-lg px-8 h-14 w-full sm:w-auto">
                                    Get Started Now
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto">
                                Request a Demo →
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                14-day free trial
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-success" />
                                Cancel anytime
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold gradient-text">Inframate</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Modern campus infrastructure management for educational institutions.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                                <li><Link href="#benefits" className="hover:text-foreground transition-colors">Benefits</Link></li>
                                <li><Link href="/login" className="hover:text-foreground transition-colors">Pricing</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                        <p>© 2026 Inframate. All rights reserved. Powered by modern technology.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
