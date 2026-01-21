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
                    <div className="lg:w-1/2 relative perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, rotateX: 20, rotateY: -20, scale: 0.9 }}
                            animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative z-10"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white/50 backdrop-blur-xl">
                                <img
                                    src="/hero-dashboard.png"
                                    alt="Inframate Dashboard Interface"
                                    className="w-full h-auto object-cover rounded-xl"
                                />

                                {/* Glass Overlay Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 hidden md:flex"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            >
                                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl border border-green-100">
                                    98%
                                </div>
                                <div>
                                    <p className="text-base font-bold text-amplitude-navy">Resolution Rate</p>
                                    <p className="text-sm text-amplitude-gray-text">Top tier performance</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Background Decor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-tr from-blue-100/50 via-purple-100/30 to-blue-50/50 rounded-full blur-3xl -z-10 opacity-70"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
