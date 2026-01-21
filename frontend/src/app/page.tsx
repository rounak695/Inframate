'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Building2, Zap, Bell, BarChart3, Users, Shield,
    ArrowRight, Star,
    Facebook, Twitter, Instagram, Linkedin, Dribbble
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Sticky Navbar with Backdrop Blur */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-110">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Inframate</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Services
                        </Link>
                        <Link href="#showcase" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Showcase
                        </Link>
                        <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                        <Link href="https://github.com/rounak695/Inframate" target="_blank" className="text-sm font-medium text-primary hover:text-primary-glow border-b border-primary/30 hover:border-primary transition-all">
                            Clone project
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <Link href="/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 lg:py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-up">
                            <p className="mb-6 text-sm font-medium tracking-[0.2em] text-primary uppercase">
                                Campus Management Reimagined
                            </p>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                                Building <span className="gradient-text">Delightful</span> Campus Experiences.
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                                Empower your educational institution with seamless issue reporting, real-time analytics, and automated workflows.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/login">
                                    <Button size="lg" className="glow-button h-14 px-8 text-lg">
                                        Start a Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative animate-slide-in">
                            {/* Hero Image Component */}
                            <div className="relative rounded-2xl overflow-hidden glass-card border-none shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-500">
                                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-card flex items-center justify-center group">
                                    <div className="text-center space-y-4 p-8">
                                        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Building2 className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Inframate Dashboard</h3>
                                        <p className="text-muted-foreground">Admin & Student Views</p>
                                    </div>

                                    {/* Overlay Effect */}
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>

                            {/* Contact Card Overlay */}
                            <div className="absolute -bottom-6 -left-6 z-10 glass-card p-6 rounded-xl animate-float hidden md:block border-primary/20">
                                <p className="text-sm text-muted-foreground mb-1">Contact us at</p>
                                <p className="text-lg font-medium gradient-text">hello@inframate.edu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About / Intro Section */}
            <section id="about" className="py-20 lg:py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12 mb-20">
                        <div>
                            <h2 className="text-3xl font-bold">About Platform</h2>
                        </div>
                        <div>
                            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-8">
                                Inframate isn't just a tool; it's a complete ecosystem. Designed for modern campuses, we bridge the gap between students, staff, and administration.
                            </p>
                            <Link href="/login" className="text-primary hover:text-primary-glow font-medium inline-flex items-center gap-2 group">
                                Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                        <div className="md:col-span-1 rounded-2xl overflow-hidden glass-card group cursor-pointer border-none">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center hover:scale-105 transition-transform duration-500">
                                <Zap className="w-16 h-16 text-primary/50 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <div className="md:col-span-1 rounded-2xl overflow-hidden glass-card group cursor-pointer border-none">
                            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center hover:scale-105 transition-transform duration-500">
                                <Bell className="w-16 h-16 text-secondary/50 group-hover:text-secondary transition-colors" />
                            </div>
                        </div>
                        <div className="md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden glass-card group cursor-pointer border-none">
                            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center hover:scale-105 transition-transform duration-500">
                                <BarChart3 className="w-24 h-24 text-accent/50 group-hover:text-accent transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services / Features */}
            <section id="features" className="py-20 lg:py-32 px-6 bg-white/5 border-y border-white/5">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
                        <div>
                            <h2 className="text-3xl font-bold">Core Services</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { icon: Shield, title: "Role-Based Security" },
                                { icon: Zap, title: "Instant Reporting" },
                                { icon: BarChart3, title: "Visual Analytics" },
                                { icon: Bell, title: "Smart Notifications" },
                                { icon: Users, title: "Multi-User Access" },
                                { icon: Building2, title: "Campus-Wide Scale" }
                            ].map((service, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                                        <service.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        {service.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Awards */}
            <section className="py-20 lg:py-32 px-6 bg-black/40">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Impact & Growth</h2>
                            <p className="text-muted-foreground">Trusted by top institutions.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 lg:gap-16">
                            {[
                                { year: "99.9%", title: "System Uptime" },
                                { year: "10K+", title: "Issues Resolved" },
                                { year: "40%", title: "Efficiency Boost" },
                                { year: "24/7", title: "Active Support" }
                            ].map((stat, i) => (
                                <div key={i} className="border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors">
                                    <h3 className="text-4xl font-bold text-primary mb-2">{stat.year}</h3>
                                    <p className="text-xl font-medium">{stat.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase / Recent Work */}
            <section id="showcase" className="py-20 lg:py-32 px-6 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-20">
                        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
                            PLATFORM SHOWCASE
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold max-w-2xl">
                            We love taking complex workflows and making them simple.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Project Card 1 */}
                        <div className="group relative h-[400px] rounded-2xl overflow-hidden glass-card border-none hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 transition-transform duration-500 group-hover:scale-105">
                                <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Student Portal</h3>
                                <p className="text-muted-foreground">Mobile-First Reporting</p>
                            </div>
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <span className="text-2xl font-bold text-white">View Feature</span>
                            </div>
                        </div>

                        {/* Project Card 2 */}
                        <div className="group relative h-[400px] rounded-2xl overflow-hidden glass-card border-none hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 mt-0 md:mt-16">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent z-0" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 transition-transform duration-500 group-hover:scale-105">
                                <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-secondary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Admin Control</h3>
                                <p className="text-muted-foreground">Centralized Management</p>
                            </div>
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-secondary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <span className="text-2xl font-bold text-white">View Feature</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white h-14 px-8 text-lg">
                                View All Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 lg:py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-20">
                        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
                            TESTIMONIALS
                        </p>
                        <h2 className="text-3xl font-bold">What people are saying</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                <div className="mb-8 text-primary">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                                    "Inframate has completely transformed how we handle campus maintenance. It's intuitive, fast, and secure."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                                    <div>
                                        <p className="font-bold text-lg">Campus Admin</p>
                                        <p className="text-sm text-muted-foreground">State University</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-black/80 border-t border-white/10" id="contact">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-2 gap-16 mb-20">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">
                                Have a campus to manage?<br />
                                <span className="text-muted-foreground">Get started today.</span>
                            </h2>
                            <a href="mailto:hello@inframate.edu" className="text-2xl hover:text-primary transition-colors">
                                hello@inframate.edu
                            </a>
                        </div>
                        <div>
                            <div className="flex flex-col gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-medium">Inframate Team</p>
                                        <p className="text-muted-foreground text-lg">Platform Developers</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    {[Facebook, Twitter, Dribbble, Instagram, Linkedin].map((Icon, i) => (
                                        <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Icon className="w-6 h-6" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between gap-8 text-muted-foreground">
                        <p>© 2026 Inframate. Powered by Modern Tech.</p>
                        <div className="flex flex-wrap gap-8">
                            {['About', 'Services', 'Showcase', 'Contact'].map((item) => (
                                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
