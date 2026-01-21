'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-gray-200 py-3' : 'bg-transparent border-transparent py-5'
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-amplitude-blue flex items-center justify-center text-white">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-amplitude-navy tracking-tight">Inframate</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['Product', 'Solutions', 'Customers', 'Pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-amplitude-gray-text hover:text-amplitude-blue transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-amplitude-navy hover:text-amplitude-blue transition-colors">
                        Log In
                    </Link>
                    <Link href="/login">
                        <Button className="bg-amplitude-blue hover:bg-amplitude-blue-hover text-white rounded-full px-6 transition-transform hover:scale-105">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-amplitude-navy"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-6 flex flex-col gap-4 shadow-xl md:hidden">
                    {['Product', 'Solutions', 'Customers', 'Pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-lg font-medium text-amplitude-navy"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-2" />
                    <Link href="/login" className="text-lg font-medium text-amplitude-navy">Log In</Link>
                    <Link href="/login">
                        <Button className="w-full bg-amplitude-blue hover:bg-amplitude-blue-hover text-white rounded-full">
                            Get Started
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
