import React, { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    Zap,
    AlertCircle,
    Loader2,
} from "lucide-react";
import type { Route } from "../../api/auth/+types/signup";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Join thousands of users shortening their links with shortly" },
        {
            name: "description",
            content: "Create your account to get started",
        },
    ];
}

// Register Component
export default function RegisterPage({ actionData }: Route.ComponentProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fetcher = useFetcher();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            await fetcher.submit(formData, { action: "/api/signup", method: "post" });
        } catch (err) {
            setError("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (actionData?.error) {
            console.log(actionData)
            setError(actionData.error);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="aurora-bg"></div>

            <div className="container max-w-md">
                <div className="mb-5">
                    <Link to="/" className="btn btn-ghost whitespace-nowrap mb-4 lg:mb-0">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className="card animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="feature-icon mx-auto mb-4 animate-pulse-glow">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gradient mb-2">Create Account</h1>
                        <p className="text-[var(--text-secondary)]">
                            Join thousands of users shortening URLs
                        </p>
                    </div>

                    {/* Error Message */}
                    {fetcher.data?.error && (
                        <div className="glass-hover p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{fetcher.data.error}</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="glass-hover p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Full Name
                            </label>
                            <div className="relative input w-full">
                                {/* <div className="input w-full space-x-"></div> */}
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                <input
                                    type="text"
                                    required
                                    className="bg-transparent border-none outline-none ml-6 w-full h-full py-12"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email Address
                            </label>
                            <div className="relative input w-full">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                <input
                                    type="email"
                                    required
                                    className="bg-transparent border-none outline-none ml-6 w-full h-full py-12"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Password
                            </label>
                            <div className="relative input w-full">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="bg-transparent border-none outline-none ml-6 mr-6 w-full h-full py-12"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-[var(--text-muted)]" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-[var(--text-muted)]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative input w-full">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="bg-transparent border-none outline-none ml-6 mr-6 w-full h-full py-12"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-[var(--text-muted)]" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-[var(--text-muted)]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                required
                                className="checkbox checkbox-primary checkbox-sm mt-1"
                            />
                            <p className="text-sm text-[var(--text-secondary)]">
                                I agree to the{" "}
                                <Link
                                    to="#"
                                    className="text-[var(--primary-light)] hover:text-[var(--primary)]">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="#"
                                    className="text-[var(--primary-light)] hover:text-[var(--primary)]">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Already have an account?{" "}
                            <Link
                                to="/auth/signin"
                                className="text-[var(--primary-light)] hover:text-[var(--primary)] font-medium transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
