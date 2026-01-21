'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl lg:text-7xl font-bold text-amplitude-navy leading-[1.1] tracking-tight mb-6">
                                Campus infrastructure <br />
                                <span className="text-amplitude-blue">reimagined.</span>
                            </h1>
                            <p className="text-xl text-amplitude-gray-text leading-relaxed max-w-lg mb-8">
                                The modern platform for issue reporting, maintenance tracking, and campus analytics. Empower your students and staff today.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/login">
                                    <Button className="h-14 px-8 text-lg rounded-full bg-amplitude-blue hover:bg-amplitude-blue-hover text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1">
                                        Get Started
                                    </Button>
                                </Link>
                                <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-amplitude-navy/10 text-amplitude-navy hover:bg-gray-50 gap-2">
                                    <PlayCircle className="w-5 h-5" />
                                    Watch Demo
                                </Button>
                            </div>

                            <p className="mt-6 text-sm text-amplitude-gray-text">
                                No credit card required · 14-day free trial · Cancel anytime
                            </p>
                        </motion.div>
                    </div>

                    {/* Visual Content */}
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative z-10"
                        >
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                                {/* Mockup Header */}
                                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                {/* Mockup content (Placeholder for Dashboard) */}
                                <div className="aspect-[4/3] bg-gray-50 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amplitude-blue/5 to-purple-500/5"></div>
                                    <div className="p-8">
                                        <div className="flex gap-4 mb-8">
                                            <div className="w-1/3 h-32 rounded-xl bg-white shadow-sm p-4 space-y-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100"></div>
                                                <div className="w-16 h-2 bg-gray-100 rounded"></div>
                                                <div className="w-24 h-6 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-1/3 h-32 rounded-xl bg-white shadow-sm p-4 space-y-2">
                                                <div className="w-8 h-8 rounded-lg bg-green-100"></div>
                                                <div className="w-16 h-2 bg-gray-100 rounded"></div>
                                                <div className="w-24 h-6 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-1/3 h-32 rounded-xl bg-white shadow-sm p-4 space-y-2">
                                                <div className="w-8 h-8 rounded-lg bg-purple-100"></div>
                                                <div className="w-16 h-2 bg-gray-100 rounded"></div>
                                                <div className="w-24 h-6 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-48 rounded-xl bg-white shadow-sm p-6 border border-gray-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="w-32 h-4 bg-gray-100 rounded"></div>
                                                <div className="w-20 h-4 bg-blue-50 text-blue-500 text-xs flex items-center justify-center rounded-full font-medium">Live Data</div>
                                            </div>
                                            <div className="flex items-end gap-2 h-24">
                                                {[40, 70, 50, 90, 60, 80, 50, 70, 60, 90].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-amplitude-blue/80 rounded-t-sm hover:bg-amplitude-blue transition-colors" style={{ height: `${h}%` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 hidden md:flex"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                    98%
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amplitude-navy">Resolution Rate</p>
                                    <p className="text-xs text-amplitude-gray-text">Top tier performance</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Background Decor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
