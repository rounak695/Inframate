export function Logos() {
    const logos = [
        "State University", "Tech Institute", "City College", "Global Academy", "Research Lab"
    ];

    return (
        <section className="py-12 border-b border-gray-100 bg-white">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-semibold text-amplitude-gray-text uppercase tracking-wider mb-8">
                    Trusted by innovative campuses worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo, i) => (
                        <div key={i} className="text-xl md:text-2xl font-bold font-serif text-amplitude-navy cursor-default">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
