'use client';

import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { Logos } from '@/components/marketing/Logos';
import { Features } from '@/components/marketing/Features';
import { Testimonials } from '@/components/marketing/Testimonials';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-amplitude-nav">
            <Navbar />
            <Hero />
            <Logos />
            <Features />
            <Testimonials />

            {/* Final CTA Strip */}
            <section className="py-24 bg-amplitude-navy text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-8">
                        Ready to modernize your campus?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of students and staff members already using Inframate.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/login">
                            <Button className="h-14 px-8 text-lg rounded-full bg-amplitude-blue hover:bg-amplitude-blue-hover text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
