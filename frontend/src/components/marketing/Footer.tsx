import Link from 'next/link';
import { Building2, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-amplitude-navy text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold">Inframate</span>
                        </Link>
                        <p className="text-gray-400 max-w-xs mb-8">
                            The modern operating system for campus infrastructure. Built for students, loved by staff.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Issue Tracking</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2026 Inframate Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
