'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Features() {
    const features = [
        {
            category: "Issue Tracking",
            title: "Report and resolve in record time.",
            description: "Empower students to report infrastructure issues instantly. Route tasks to the right staff automatically and cut resolution time by 40%.",
            points: ["Mobile-first reporting", "Automated routing", "Real-time status updates"],
            imagePlaceholder: "bg-blue-50",
            align: "left"
        },
        {
            category: "Analytics",
            title: "Data-driven campus decisions.",
            description: "Gain complete visibility into campus health. Track SLA compliance, identify recurring issues, and optimize maintenance budgets with precision.",
            points: ["Custom dashboards", "SLA monitoring", "Resource allocation trends"],
            imagePlaceholder: "bg-purple-50",
            align: "right"
        },
        {
            category: "Notifications",
            title: "Keep everyone in the loop.",
            description: "Stop the 'is it fixed yet?' emails. Automated notifications keep students, staff, and administrators informed at every step of the resolution process.",
            points: ["Email & in-app alerts", "Role-based digests", "Critical escalation rules"],
            imagePlaceholder: "bg-green-50",
            align: "left"
        }
    ];

    return (
        <section id="solutions" className="py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${feature.align === 'right' ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Text Content */}
                            <div className="lg:w-1/2 space-y-6">
                                <span className="text-sm font-bold text-amplitude-blue uppercase tracking-widest">
                                    {feature.category}
                                </span>
                                <h2 className="text-4xl lg:text-5xl font-bold text-amplitude-navy leading-tight">
                                    {feature.title}
                                </h2>
                                <p className="text-lg text-amplitude-gray-text leading-relaxed">
                                    {feature.description}
                                </p>

                                <ul className="space-y-4 pt-4">
                                    {feature.points.map((point, i) => (
                                        <li key={i} className="flex items-center gap-3 text-amplitude-navy font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-amplitude-blue" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6">
                                    <Link href="/login" className="inline-flex items-center gap-2 text-amplitude-blue font-bold hover:gap-3 transition-all group">
                                        Learn more about {feature.category}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Content */}
                            <div className="lg:w-1/2 w-full">
                                <div className={`rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white relative group transition-transform duration-500 hover:-translate-y-2`}>
                                    {index === 0 && (
                                        <div className="bg-blue-50/50 p-8 flex items-center justify-center min-h-[400px]">
                                            <img src="/feature-reporting.png" alt="Reporting UI" className="w-[80%] drop-shadow-2xl rounded-3xl" />
                                        </div>
                                    )}
                                    {index === 1 && (
                                        <div className="bg-white p-8 flex items-center justify-center min-h-[400px]">
                                            <img src="/feature-analytics.png" alt="Analytics UI" className="w-full drop-shadow-xl" />
                                        </div>
                                    )}
                                    {index === 2 && (
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-12 flex flex-col gap-4 min-h-[400px] justify-center">
                                            {[1, 2, 3].map((n) => (
                                                <div key={n} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${n * 150}ms` }}>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n === 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {n === 1 ? '!' : '✓'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 w-24 bg-gray-100 rounded mb-2"></div>
                                                        <div className="h-2 w-16 bg-gray-50 rounded"></div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">Just now</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
