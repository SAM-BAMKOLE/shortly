import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "../routes/+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Shortlink - Shorten URLs withStyle & Analytics" },
        {
            name: "description",
            content:
                "Transform long, complex URLs into clean, shareable links. Track performance, analyze clicks, and boost your marketing campaigns with powerful insights.",
        },
    ];
}


export async function loader() {
    return {
        totalLinks: "2.5M+",
        totalClicks: "50M+",
        activeUsers: "100K+",
    };
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedUrl(url);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    const features = [
        {
            icon: "⚡",
            title: "Lightning Fast",
            description: "Create short URLs in milliseconds with our optimized infrastructure",
        },
        {
            icon: "📊",
            title: "Advanced Analytics",
            description: "Track clicks, locations, devices, and get detailed insights",
        },
        {
            icon: "🔒",
            title: "Secure & Private",
            description: "Your links are protected with enterprise-grade security",
        },
        {
            icon: "🎯",
            title: "Custom Branding",
            description: "Use your own domain and create branded short links",
        },
        {
            icon: "📱",
            title: "QR Codes",
            description: "Generate QR codes automatically for mobile sharing",
        },
        {
            icon: "🔗",
            title: "Bulk Operations",
            description: "Create multiple short URLs at once with CSV upload",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Director",
            company: "TechCorp",
            content:
                "This URL shortener has transformed our marketing campaigns. The analytics are incredible!",
        },
        {
            name: "Mike Chen",
            role: "Social Media Manager",
            company: "StartupXYZ",
            content: "Best URL shortener I've used. Clean interface and powerful features.",
        },
        {
            name: "Emily Davis",
            role: "Content Creator",
            company: "CreativeAgency",
            content: "The QR code generation and custom branding features are game changers.",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Aurora Background */}
            <div className="aurora-bg"></div>

            {/* Navigation */}
            <nav className="container py-6 navbar">
                {/* <div className="flex items-center justify-between"> */}
                    <div className="space-x-2 navbar-start">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-aurora-purple flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">ShortLink</span>
                    </div>

                    <div className="navbar-end">
                        <div className="dropdown dropdown-end">
                                <button className="btn-ghost" tabIndex={0} role="button">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            <ul tabIndex={0} className="menu menu-md dropdown-content z-1 mt-3 bg-black/20 rounded-box w-52 shadow">
                                <Link to="/auth/signin" className="btn-ghost mb-2">
                                    Login
                                </Link>
                                <Link to="/auth/signup" className="btn-primary whitespace-nowrap">
                                    Get Started
                                </Link>
                            </ul>
                        </div>
                    </div>
                {/* </div> */}
            </nav>

            {/* Hero Section */}
            <section className="container py-20 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in-up">
                    <h1 className="mb-6">
                        Shorten URLs with
                        <span className="text-gradient block mt-2">Style & Analytics</span>
                    </h1>
                    <p className="text-large text-secondary max-w-2xl mx-auto mb-12">
                        Transform long, complex URLs into clean, shareable links. Track performance,
                        analyze clicks, and boost your marketing campaigns with powerful insights.
                    </p>

                    {/* URL Shortener Form */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="flex flex-col sm:flex-row md:justify-center gap-4">
                            <Link to="/auth/signin" className="btn-primary text-lg px-8">
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="stat-card">
                            <div className="stat-number">{loaderData!.totalLinks}</div>
                            <p className="text-secondary mt-2">Links Created</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{loaderData!.totalClicks}</div>
                            <p className="text-secondary mt-2">Total Clicks</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{loaderData!.activeUsers}</div>
                            <p className="text-secondary mt-2">Active Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container py-20">
                <div className="text-center mb-16">
                    <h2 className="mb-6">
                        Powerful Features for
                        <span className="text-gradient block mt-2">Modern Marketing</span>
                    </h2>
                    <p className="text-large text-secondary max-w-2xl mx-auto">
                        Everything you need to create, manage, and analyze your shortened URLs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card hover:scale-105 transition-transform duration-300">
                            <div
                                className="feature-icon mb-6 animate-float"
                                style={{ animationDelay: `${index * 0.2}s` }}>
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <h3 className="mb-4">{feature.title}</h3>
                            <p className="text-secondary">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="container py-20">
                <div className="text-center mb-16">
                    <h2 className="mb-6">How It Works</h2>
                    <p className="text-large text-secondary max-w-2xl mx-auto">
                        Get started in three simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-pink to-aurora-purple flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                            <span className="text-2xl font-bold text-white">1</span>
                        </div>
                        <h4 className="mb-4">Paste Your URL</h4>
                        <p className="text-secondary">
                            Simply paste your long URL into our shortener tool
                        </p>
                    </div>

                    <div className="text-center">
                        <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-blue flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                            style={{ animationDelay: "0.5s" }}>
                            <span className="text-2xl font-bold text-white">2</span>
                        </div>
                        <h4 className="mb-4">Get Short Link</h4>
                        <p className="text-secondary">
                            Receive a clean, professional short URL instantly
                        </p>
                    </div>

                    <div className="text-center">
                        <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-blue to-aurora-cyan flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
                            style={{ animationDelay: "1s" }}>
                            <span className="text-2xl font-bold text-white">3</span>
                        </div>
                        <h4 className="mb-4">Track & Analyze</h4>
                        <p className="text-secondary">Monitor clicks and get detailed analytics</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container py-20">
                <div className="text-center mb-16">
                    <h2 className="mb-6">What Our Users Say</h2>
                    <p className="text-large text-secondary max-w-2xl mx-auto">
                        Join thousands of satisfied customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="card">
                            <div className="mb-6">
                                <div className="flex text-aurora-cyan text-xl">{"★".repeat(5)}</div>
                            </div>
                            <p className="text-primary mb-6">"{testimonial.content}"</p>
                            <div className="flex items-center">
                                <div className="w-12 h-10 bg-secondary rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white font-bold">
                                        {testimonial.name[0]}
                                    </span>
                                </div>
                                <div>
                                    <h5 className="font-semibold">{testimonial.name}</h5>
                                    <span className="text-muted text-sm">
                                        {testimonial.role} at {testimonial.company}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="mb-6">
                        Ready to Start
                        <span className="text-gradient block mt-2">Shortening?</span>
                    </h2>
                    <p className="text-large text-secondary mb-12">
                        Join thousands of businesses and creators who trust our URL shortener
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auth/signup" className="btn-primary text-lg px-8 py-4">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container py-12">
                <div className="flex justify-between gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-aurora-purple flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold text-gradient">ShortLink</span>
                        </div>
                        <p className="text-secondary">
                            The modern URL shortener with powerful analytics and beautiful design.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-500 mt-8 pt-8 text-center">
                    <p className="text-secondary">
                        © {(new Date()).getFullYear()} <span className="text-gradient">ShortLink.</span> Made with ❤️ by SAM BAMICOLE.
                    </p>
                </div>
            </footer>
        </div>
    );
}

const FormResMsg = ({
    actionData,
    copiedUrl,
    handleCopyUrl,
}: {
    actionData: { error?: string; success?: string; shortUrl?: string; originalUrl?: string };
    copiedUrl: string | null;
    handleCopyUrl: (url: string) => Promise<void>;
}) => {
    return (
        <>
            {/* Error Message */}
            {actionData?.error && (
                <div className="mt-4 p-4 glass rounded-lg border border-red-500/30">
                    <p className="text-red-400">{actionData.error}</p>
                </div>
            )}

            {/* Success Result */}
            {actionData?.success && (
                <div className="mt-6 p-6 glass rounded-xl animate-fade-in-up">
                    <h3 className="text-xl font-semibold mb-4 text-gradient-green">
                        Your shortened URL is ready! 🎉
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <span className="text-primary-light font-mono text-lg">
                            {actionData.shortUrl}
                        </span>
                        <button
                            onClick={() => handleCopyUrl(actionData.shortUrl ?? "")}
                            className={`btn-secondary ${
                                copiedUrl === actionData.shortUrl ? "opacity-75" : ""
                            }`}>
                            {copiedUrl === actionData.shortUrl ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <p className="mt-2 text-muted text-sm">Original: {actionData.originalUrl}</p>
                </div>
            )}
        </>
    );
};
