import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Edit3,
    Save,
    X,
    Copy,
    ExternalLink,
    BarChart3,
    TrendingUp,
    Users,
    CheckCircle,
    Trash2,
} from "lucide-react";

import {
    Link,
    useFetcher,
    type LoaderFunctionArgs,
    type ClientActionFunctionArgs, useNavigate
} from "react-router";
import type { Route } from "../routes/+types/detail";
import { getSession } from "~/lib/session";
import { getUrlByShort } from "~/utils/urls";
import { slugify, slugInput } from "~/utils/helpers";
import { toast } from "react-toastify";
import type { Url } from "@prisma/client";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Track and edit details of a particular link" },
        {
            name: "description",
            content:
                "Transform long, complex URLs into clean, shareable links. Track performance, analyze clicks, and boost your marketing campaigns with powerful insights.",
        },
    ];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    const mockData = {
        id: "1",
        originalUrl: "https://www.example.com/very-long-article-about-technology-trends-2024",
        shortUrl: "shrt.ly/abc123",
        customAlias: "tech-trends",
        title: "Technology Trends Article 2024",
        description: "Comprehensive guide to emerging technology trends",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:20:00Z",
        expiresAt: "2024-12-31T23:59:59Z",
        status: "active",
        tags: ["technology", "trends", "article"],
        totalClicks: 1247,
        uniqueClicks: 892,
        clickHistory: [
            { date: "2024-01-15", clicks: 45, uniqueClicks: 38 },
            { date: "2024-01-16", clicks: 89, uniqueClicks: 67 },
            { date: "2024-01-17", clicks: 123, uniqueClicks: 89 },
            { date: "2024-01-18", clicks: 156, uniqueClicks: 112 },
            { date: "2024-01-19", clicks: 198, uniqueClicks: 143 },
            { date: "2024-01-20", clicks: 234, uniqueClicks: 167 },
            { date: "2024-01-21", clicks: 267, uniqueClicks: 189 },
            { date: "2024-01-22", clicks: 135, uniqueClicks: 87 },
        ],
        geographicData: [
            { country: "United States", clicks: 387, percentage: 31.0 },
            { country: "United Kingdom", clicks: 249, percentage: 20.0 },
            { country: "Canada", clicks: 187, percentage: 15.0 },
            { country: "Germany", clicks: 149, percentage: 12.0 },
            { country: "Australia", clicks: 112, percentage: 9.0 },
            { country: "Others", clicks: 163, percentage: 13.0 },
        ],
        referrerData: [
            { source: "Direct", clicks: 436, percentage: 35.0 },
            { source: "Twitter", clicks: 311, percentage: 25.0 },
            { source: "LinkedIn", clicks: 249, percentage: 20.0 },
            { source: "Facebook", clicks: 124, percentage: 10.0 },
            { source: "Reddit", clicks: 87, percentage: 7.0 },
            { source: "Others", clicks: 40, percentage: 3.0 },
        ],
        deviceData: [
            { device: "Desktop", clicks: 623, percentage: 50.0 },
            { device: "Mobile", clicks: 436, percentage: 35.0 },
            { device: "Tablet", clicks: 188, percentage: 15.0 },
        ],
        topHours: [
            { hour: "09:00", clicks: 89 },
            { hour: "10:00", clicks: 134 },
            { hour: "11:00", clicks: 156 },
            { hour: "14:00", clicks: 143 },
            { hour: "15:00", clicks: 167 },
            { hour: "16:00", clicks: 178 },
        ],
    };

    const user = await getSession(request);
    const shortUrl: string | undefined = params.shortUrl;

    try {
        if (shortUrl) {
            const url = await getUrlByShort(shortUrl);
            return { user, url };
        } else throw new Error("Not found");
    } catch (error) {
        return new Response("No data found", { status: 404 });
    }
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
    const formData = await request.formData();
    const urlId = formData.get("urlId") as string;
    let response;

    switch (request.method) {
        case "PATCH":
            formData.delete(urlId);

            response = await fetch(`/api/urls/${urlId}`, {
                method: "PATCH",
                body: formData,
            });

            const data = await response.json()
            if (!data.error) {
                // if (formData.get)
                return { success: true };
            }

            // return { error: "Unable to update url" };
            return { error: data.error};
            break;
    }
}

type EditFormType = Omit<
    Url,
    | "createdAt"
    | "tags"
    | "id"
    | "updatedAt"
    | "expiresAt"
    | "totalClicks"
    | "uniqueClicks"
    | "creatorId"
    | "clickHistory"
    | "clicks"
>;

const URLManagement = ({ loaderData }: Route.ComponentProps) => {
    // const [urlData, setUrlData] = useState<UrlType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<EditFormType>({
        title: "",
        originalUrl: "",
        shortUrl: "",
        status: "",
        description: "",
    });
    // <Omit<UrlType, "createdAt" | "tags" | "id" | "updatedAt" | "totalClicks" | "uniqueClicks" | "creatorId">>
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // to detect form transition state
    const wasSubmitting = useRef(false)

const urlData: Url = loaderData?.url!

    useEffect(() => {
        if (loaderData) {
            // setUrlData(loaderData.url!);
            setEditForm({
                title: urlData.title,
                description: urlData.description,
                status: urlData.status,
                shortUrl: urlData.shortUrl,
                originalUrl: urlData.originalUrl,
            });
        }
    }, []);
    

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(import.meta.env.VITE_BASE_URL + "/short/" + text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditForm({ ...editForm, shortUrl: slugify(editForm.shortUrl) })
        try {
            await fetcher.submit({ ...editForm, shortUrl: slugify(editForm.shortUrl), urlId: urlData?.id }, { method: "patch" });
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        try {
            await fetcher.submit(
                { urlId: String(urlData?.id) },
                { method: "DELETE", action: `/api/urls/${urlData?.id}` }
            );
            navigate("/url/dashboard");
            toast.success("Url deleted successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(()=>{
            if (wasSubmitting.current && fetcher.state === "idle") {
                if (fetcher.data?.success) {
                    toast.success("Url updated successfully");
                } else if(fetcher.data?.error) {
                    toast.error(fetcher.data.error)
                }
    
                wasSubmitting.current = false;
            }
            if (fetcher.state === "submitting") {
                wasSubmitting.current = true
            }
        }, [fetcher.state, fetcher.data])

    if (!urlData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="aurora-bg"></div>
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="aurora-bg"></div>

            <div className="container py-8">
                {/* Header */}
                <div className="lg:flex items-center justify-between mb-8">
                    <div className="mb-5 lg:mb-0">
                        <Link
                            to="/url/dashboard"
                            className="inline-flex btn btn-ghost whitespace-nowrap mb-4 lg:mb-0">
                            <ArrowLeft className="w-5 h-5 mr-1" />
                            <span>Back to Dashboard</span>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient mb-2">
                                {urlData.title || "Untitled Link"}
                            </h1>
                            <p className="text-[var(--text-secondary)]">
                                Created {formatDate(urlData.createdAt.toLocaleString())}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="btn-secondary flex items-center gap-2"
                            onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                        {isEditing && (
                            <button
                                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                onClick={handleSave}>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {/* URL Info Card */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Original URL
                            </label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    className="input w-full"
                                    value={editForm.originalUrl}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, originalUrl: e.target.value })
                                    }
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-[var(--text-primary)] break-all">
                                        {urlData.originalUrl}
                                    </span>
                                    <a
                                        href={urlData.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-ghost btn-sm">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Short URL
                            </label>
                            <div className="flex items-center gap-2">
                                <code className="text-[var(--aurora-cyan)] font-mono bg-[var(--surface)] px-3 py-2 rounded-lg flex-1">
                                    {urlData.shortUrl}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(urlData.shortUrl, "short")}
                                    className={`btn btn-sm ${
                                        copiedId === "short" ? "btn-success" : "btn-ghost"
                                    }`}>
                                    {copiedId === "short" ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Custom Alias
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={editForm.shortUrl}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            shortUrl: slugInput(e.target.value),
                                        })
                                    }
                                    placeholder="Enter custom alias"
                                />
                            ) : (
                                <span className="text-[var(--text-primary)]">
                                    {urlData.shortUrl || "Not set"}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Status
                            </label>
                            {isEditing ? (
                                <select
                                    className="select w-full"
                                    value={editForm.status}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, status: e.target.value })
                                    }>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            ) : (
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        urlData.status === "active"
                                            ? "bg-green-500/20 text-green-400"
                                            : urlData.status === "inactive"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}>
                                    {urlData.status.charAt(0).toUpperCase() +
                                        urlData.status.slice(1)}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Title
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={editForm.title ? editForm.title : ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, title: e.target.value })
                                    }
                                    placeholder="Enter custom alias"
                                />
                            ) : (
                                <span className="text-[var(--text-primary)]">
                                    {urlData.title || "Not set"}
                                </span>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Description
                            </label>
                            {isEditing ? (
                                <textarea
                                    className="input w-full h-20 resize-none"
                                    value={editForm.description ? editForm.description : ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, description: e.target.value })
                                    }
                                    placeholder="Add a description"
                                />
                            ) : (
                                <p className="text-[var(--text-primary)]">
                                    {urlData.description || "No description provided"}
                                </p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-between items-center">
                            <button
                                className="btn btn-ghost text-red-400 flex items-center gap-2"
                                onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
                                Delete URL
                            </button>
                            <div className="text-sm text-[var(--text-muted)]">
                                Last updated: {formatDate(String(urlData.updatedAt))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center justify-center mb-3">
                            <div className="feature-icon">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="stat-number">{urlData.totalClicks}</div>
                        <p className="text-sm text-[var(--text-muted)]">Total Clicks</p>
                    </div>

                    {/*
                    <div className="stat-card">
                        <div className="flex items-center justify-center mb-3">
                            <div className="feature-icon">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="stat-number">{urlData.uniqueClicks}</div>
                        <p className="text-sm text-[var(--text-muted)]">Unique Clicks</p>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-center mb-3">
                            <div className="feature-icon">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="stat-number">
                            {Number.isNaN(
                                Math.round((urlData.uniqueClicks / urlData.totalClicks) * 100)
                            )
                                ? 0
                                : Math.round((urlData.uniqueClicks / urlData.totalClicks) * 100)}
                            %
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">Click-through Rate</p>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-center mb-3">
                            <div className="feature-icon">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="stat-number">
                            {Math.round(urlData.totalClicks / urlData.clickHistory.length)}
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">Avg Daily Clicks</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default URLManagement;
