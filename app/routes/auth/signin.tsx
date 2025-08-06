import React, { useEffect, useRef, useState } from "react";
import { Form, Link, useFetcher } from "react-router";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    Shield,
    AlertCircle,
    Loader2,
} from "lucide-react";
import type { Route } from "../../routes/auth/+types/signin";
import { toast } from "react-toastify";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Welcome back, Sign in to your account" },
        {
            name: "description",
            content: "Sign in to track the performance of your shortened links",
        },
    ];
}

// Login Component
export default function LoginPage({ actionData }: Route.ComponentProps) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fetcher = useFetcher();

    // to detect form transition state
    const wasSubmitting = useRef(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Simulate API call
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            await fetcher.submit(formData, { action: "/api/signin", method: "post" });
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // @ts-ignore
        if (actionData && actionData.error) {
            // @ts-ignore
            setError(actionData.error);
        }
    }, []);

    /* // Note that this wouldn't work because the ToastProvider doesn't surround the auth components/pages yet
    useEffect(()=>{
        console.log(fetcher.state, wasSubmitting.current, fetcher.data);
            if (wasSubmitting.current && fetcher.state === "idle") {
                if (fetcher.data?.success) {
                    toast.success("Login Successful");
                } else if(fetcher.data?.error) {
                    toast.error(fetcher.data.error)
                }
    
                wasSubmitting.current = false;
            }
            if (fetcher.state === "submitting") {
                wasSubmitting.current = true
            }
        }, [fetcher.state, fetcher.data])

        */

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
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
                        <p className="text-[var(--text-secondary)]">
                            Sign in to your account to continue
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

                    {/* Divider */}
                    {/* <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-[var(--border)]"></div>
                        <span className="text-[var(--text-muted)] text-sm">or</span>
                        <div className="flex-1 h-px bg-[var(--border)]"></div>
                    </div> */}

                    {/* Login Form */}
                    <form  className="space-y-4" onSubmit={handleSubmit}>
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
                                    className="bg-transparent border-none outline-none h-full py-12 ml-6 mr-6 w-full"
                                    placeholder="Enter your password"
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                />
                                <span className="text-[var(--text-secondary)]">Remember me</span>
                            </label>
                            <Link
                                to="#"
                                className="text-[var(--primary-light)] hover:text-[var(--primary)] transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/signup"
                                className="text-[var(--primary-light)] hover:text-[var(--primary)] font-medium transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
