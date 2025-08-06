import React, { useState } from "react";
import { Link } from "react-router";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Github,
    Chrome,
    Shield,
    Zap,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

// Forgot Password Component
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Replace with actual Firebase auth
            // await sendPasswordResetEmail(auth, email);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setIsEmailSent(true);
        } catch (err) {
            setError("Failed to send reset email. Please check your email address.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="aurora-bg"></div>

                <div className="container max-w-md">
                    <div className="card animate-fade-in-up text-center">
                        <div
                            className="feature-icon mx-auto mb-6"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--aurora-green), var(--aurora-cyan))",
                            }}>
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gradient mb-4">Check Your Email</h1>
                        <p className="text-[var(--text-secondary)] mb-6">
                            We've sent a password reset link to{" "}
                            <strong className="text-[var(--text-primary)]">{email}</strong>
                        </p>

                        <div className="glass-hover p-4 rounded-lg border border-[var(--aurora-green)]/30 bg-[var(--aurora-green)]/10 mb-6">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Didn't receive the email? Check your spam folder or click the button
                                below to resend.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setIsEmailSent(false);
                                    setEmail("");
                                }}
                                className="btn-secondary w-full">
                                Try Different Email
                            </button>

                            <Link to="/auth/signin" className="btn-ghost w-full block text-center">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="aurora-bg"></div>

            <div className="container max-w-md">
                <div className="card animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="feature-icon mx-auto mb-4 animate-pulse-glow">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gradient mb-2">Reset Password</h1>
                        <p className="text-[var(--text-secondary)]">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="glass-hover p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Reset Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    required
                                    className="input w-full pl-11"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
