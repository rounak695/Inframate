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
                                <div className={`aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-gray-100 ${feature.imagePlaceholder} relative group`}>
                                    {/* Abstract UI Representation */}
                                    <div className="absolute inset-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 transition-transform duration-700 group-hover:scale-105">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100"></div>
                                            <div className="space-y-2">
                                                <div className="w-32 h-4 bg-gray-100 rounded"></div>
                                                <div className="w-20 h-3 bg-gray-50 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-32 bg-gray-50 rounded-lg w-full"></div>
                                        <div className="flex gap-2">
                                            <div className="w-full h-10 bg-amplitude-blue/10 rounded-lg"></div>
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
