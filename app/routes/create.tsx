import React, { useState, useEffect, useRef } from "react";
import {
    Link as LinkIcon,
    Globe,
    Zap,
    Shield,
    BarChart3,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import { createUrl, type CreateUrlData } from "~/utils/urls";
import { slugify, slugInput, strToArr } from "~/utils/helpers";
import {
    useFetcher,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    Link,
    useNavigate,
} from "react-router";
import type { Route } from "../routes/+types/create";
import { getSession } from "~/lib/session";
import { toast } from "react-toastify";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Add a new link you want to shorten" },
        {
            name: "description",
            content:
                "Transform long, complex URLs into clean, shareable links. Track performance, analyze clicks, and boost your marketing campaigns with powerful insights.",
        },
    ];
}

export async function loader({ request }: LoaderFunctionArgs) {
    return await getSession(request);
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();

        // console.log("FormData", formData);
        const values: CreateUrlData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            originalUrl: formData.get("originalUrl") as string,
            customAlias: formData.get("customAlias") as string,
            creatorId: formData.get("creatorId") as string,
        };

        const response = await createUrl(values);

        if (response.error) {
            console.log("Error", response.error);
            return {error: response.error};
        } else return { success: true };
        // return redirect("/dashboard", setFlashMessage("Url created and shortened"));
    } catch (err: any) {
        console.log("Err", err)
        return {error: "Unable to shorten url" };
    }
}

const AddUrlPage = ({ actionData, loaderData }: Route.ComponentProps) => {
    const [formData, setFormData] = useState<Omit<CreateUrlData, "creatorId">>({
        originalUrl: "",
        customAlias: "",
        title: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState<{ originalUrl?: string; customAlias?: string }>({});
    const fetcher = useFetcher();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const navigate = useNavigate();
    const user = loaderData;

    // to detect form transition state
    const wasSubmitting = useRef(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "tags") {
            setFormData((prev) => ({
                ...prev,
                [name]: strToArr(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear errors when user starts typing
        // @ts-ignore
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Generate preview URL for custom alias
        if (name === "customAlias") {
            setFormData((prev) => ({
                ...prev,
                [name]: slugInput(value),
            }));
            setPreviewUrl(value ? import.meta.env.VITE_BASE_URL + "/" + slugify(value) : "");
        }
    };

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateForm = () => {
        const newErrors: { originalUrl?: string; customAlias?: string } = {};

        if (!formData.originalUrl) {
            newErrors.originalUrl = "URL is required";
        } else if (!validateUrl(formData.originalUrl)) {
            newErrors.originalUrl = "Please enter a valid URL";
        }

        if (formData.customAlias && formData.customAlias.length < 3) {
            newErrors.customAlias = "Custom alias must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try { // @ts-ignore
            await fetcher.submit({ ...formData, customAlias: slugify(formData.customAlias), creatorId: user.userId }, { method: "post" });
        } catch (error: any) {
            setErrorMsg(error.message);
            console.error("Error shortening URL:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Lightning Fast",
            description: "Generate short links instantly",
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Secure & Reliable",
            description: "Your links are safe and always accessible",
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            title: "Detailed Analytics",
            description: "Track clicks and monitor performance",
        },
    ];

    useEffect(()=>{
        if (wasSubmitting.current && fetcher.state === "idle") {
            if (fetcher.data?.success) {
                toast.success("Url created and shortened");
                navigate("/url/dashboard");
            } else if(fetcher.data?.error) {
                toast.error(fetcher.data.error)
            }

            wasSubmitting.current = false;
        }
        if (fetcher.state === "submitting") {
            wasSubmitting.current = true
        }
    }, [fetcher.state, fetcher.data])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Aurora Background */}
            <div className="aurora-bg"></div>

            <div className="container py-12 relative z-10">
                <div className="mb-5">
                    <Link
                        to="/url/dashboard"
                        className="btn btn-ghost whitespace-nowrap mb-4 lg:mb-0">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-gradient mb-6">Shorten Your URL</h1>
                    <p className="text-large max-w-2xl mx-auto text-[var(--text-secondary)]">
                        Transform long, complex URLs into short, shareable links with custom
                        branding and detailed analytics.
                    </p>
                </div>

                {/* Error Message */}
                {actionData && (
                    <div className="glass-hover p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{actionData.error}</p>
                        </div>
                    </div>
                )}
                {errorMsg && (
                    <div className="glass-hover p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{errorMsg}</p>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Main Form */}
                    <div className="animate-fade-in-up">
                        <div className="card">
                            <div className="space-y-6">
                                {/* Original URL Input */}
                                <div>
                                    <label
                                        htmlFor="originalUrl"
                                        className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Enter your original URL *
                                    </label>
                                    <div className="relative input py-0 w-full">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                        <input
                                            type="url"
                                            id="originalUrl"
                                            name="originalUrl"
                                            value={formData.originalUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/very-long-url-that-needs-shortening"
                                            className={`bg-transparent border-none outline-none ml-6 w-full h-full py-3 ${
                                                errors.originalUrl ? "border-red-400" : ""
                                            }`}
                                        />
                                    </div>
                                    {errors.originalUrl && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.originalUrl}
                                        </p>
                                    )}
                                </div>

                                {/* Custom Alias Input */}
                                <div>
                                    <label
                                        htmlFor="customAlias"
                                        className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Custom alias (optional)
                                    </label>
                                    <div className="relative input py-0 w-full">
                                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-100" />
                                        <input
                                            type="text"
                                            id="customAlias"
                                            name="customAlias"
                                            value={formData.customAlias}
                                            onChange={handleInputChange}
                                            placeholder="my-custom-link"
                                            className={`bg-transparent border-none outline-none ml-6 w-full h-full py-3 ${
                                                errors.customAlias ? "border-red-400" : ""
                                            }`}
                                        />
                                    </div>
                                    {errors.customAlias && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.customAlias}
                                        </p>
                                    )}
                                    {previewUrl && (
                                        <div className="mt-2 p-3 bg-[var(--surface-hover)] rounded-md">
                                            <p className="text-sm text-[var(--text-muted)] mb-1">
                                                Preview:
                                            </p>
                                            <span className="text-gradient-green font-medium text-sm">
                                                {previewUrl}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Title Input */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Title (optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Give your link a memorable title"
                                        className="input w-full placeholder:text-gray-200"
                                    />
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Add a description to help you remember this link"
                                        className="input h-20 w-full resize-none placeholder:text-gray-200"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={fetcher.state === "submitting"}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-semibold">
                                    {fetcher.state === "submitting" ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Shortening...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            Shorten URL
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features Sidebar */}
                    <div
                        className="space-y-8 animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}>
                        {/* Quick Tips */}
                        <div className="card">
                            <h3 className="text-white mb-6">Why Choose Our URL Shortener?</h3>
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="feature-icon flex-shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats Preview */}
                        {/* <div className="card">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-4">
                                Your Dashboard
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="stat-card">
                                    <div className="stat-number">127</div>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        Total Links
                                    </p>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">2.4K</div>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        Total Clicks
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[var(--border)]">
                                <button className="btn-ghost w-full">View Full Analytics</button>
                            </div>
                        </div> */}

                        {/* Tips */}
                        <div className="card">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-4">
                                💡 Pro Tips
                            </h4>
                            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--aurora-green)] mt-0.5">•</span>
                                    Use descriptive custom aliases to make links memorable
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--aurora-blue)] mt-0.5">•</span>
                                    Add titles and descriptions for better organization
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--aurora-purple)] mt-0.5">•</span>
                                    Check analytics regularly to track performance
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUrlPage;
