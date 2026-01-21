import { Star } from 'lucide-react';

export function Testimonials() {
    const testimonials = [
        {
            quote: "Inframate transformed how we handle campus maintenance. The automated routing saved us 20 hours a week.",
            author: "Sarah Jenkins",
            role: "Facilities Director, State Tech",
            avatar: "bg-orange-100"
        },
        {
            quote: "Students love the mobile reporting. We've seen a 300% increase in reported issues, which means we can fix them faster.",
            author: "Dr. Marcus Chen",
            role: "Dean of Student Affairs",
            avatar: "bg-blue-100"
        },
        {
            quote: "The analytics dashboard is a game changer. We finally have data to justify our maintenance budget requests.",
            author: "Elena Rodriguez",
            role: "Campus Operations Lead",
            avatar: "bg-purple-100"
        }
    ];

    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-amplitude-navy mb-4">
                        Outcomes speak louder than words.
                    </h2>
                    <p className="text-lg text-amplitude-gray-text">
                        Join forward-thinking institutions delivering better campus experiences.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 text-orange-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg text-amplitude-navy leading-relaxed mb-8 font-medium">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${t.avatar} flex items-center justify-center text-xl font-bold text-gray-600`}>
                                    {t.author[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-amplitude-navy">{t.author}</p>
                                    <p className="text-sm text-amplitude-gray-text">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
