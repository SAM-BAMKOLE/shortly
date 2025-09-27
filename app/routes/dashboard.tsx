import React, { useState, useEffect } from "react";
import {
    Link,
    Copy,
    BarChart3,
    TrendingUp,
    Globe,
    Plus,
    Search,
    Trash2,
    Eye,
    ArrowRight,
} from "lucide-react";
import type { Route } from "../routes/+types/dashboard";
import { UrlCard } from "~/components/UrlCard";
import { copyToClipboard, formatDate, truncateUrl } from "~/utils/helpers";
import { getUserUrls } from "~/utils/urls";
import { getSession } from "~/lib/session";
import type { LoaderFunctionArgs, ClientLoaderFunctionArgs } from "react-router";
import { Form, useFetcher, Link as RouterLink } from "react-router";
import { toast } from "react-toastify";
import { getFlashMessage } from "~/utils/flash";
import type { Url } from "@prisma/client";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "View a concise summary of all your shortened links" },
        {
            name: "description",
            content:
                "Transform long, complex URLs into clean, shareable links. Track performance, analyze clicks, and boost your marketing campaigns with powerful insights.",
        },
    ];
}

export async function loader({ request }: LoaderFunctionArgs) {
    const mockUrls = [
        {
            id: "1",
            originalUrl: "https://www.example.com/very-long-article-about-technology-trends-2024",
            shortUrl: "shrt.ly/abc123",
            customAlias: "tech-trends",
            createdAt: "2024-01-15",
            clicks: 1247,
            status: "active",
            tags: ["technology", "trends"],
            description: "Technology trends article for 2024",
        },
        {
            id: "2",
            originalUrl: "https://github.com/username/awesome-project",
            shortUrl: "shrt.ly/def456",
            customAlias: "",
            createdAt: "2024-01-12",
            clicks: 892,
            status: "active",
            tags: ["github", "project"],
            description: "My awesome GitHub project",
        },
        {
            id: "3",
            originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            shortUrl: "shrt.ly/ghi789",
            customAlias: "never-gonna",
            createdAt: "2024-01-10",
            clicks: 2156,
            status: "active",
            tags: ["music", "video"],
            description: "Classic music video",
        },
        {
            id: "4",
            originalUrl: "https://docs.google.com/presentation/d/1234567890/edit",
            shortUrl: "shrt.ly/jkl012",
            customAlias: "q4-presentation",
            createdAt: "2024-01-08",
            clicks: 543,
            status: "inactive",
            tags: ["presentation", "business"],
            description: "Q4 Business Presentation",
        },
        {
            id: "5",
            originalUrl: "https://www.linkedin.com/in/username/recent-activity",
            shortUrl: "shrt.ly/mno345",
            customAlias: "",
            createdAt: "2024-01-05",
            clicks: 321,
            status: "active",
            tags: ["linkedin", "profile"],
            description: "LinkedIn profile activity",
        },
    ];

    const session = await getSession(request);
    const { urls } = await getUserUrls(session?.userId!);

    const message = getFlashMessage(request);

    return { urls, message };
}

const UserDashboard = ({ loaderData }: Route.ComponentProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const fetcher = useFetcher();

    const urls: Url[] = loaderData.urls

    useEffect(() => {
        if (loaderData.message) {
            toast.success(loaderData.message);
        }
        // setUrls(loaderData.urls);
    }, []);

    const totalClicks = urls?.reduce((sum, url) => sum + url.totalClicks, 0);
    const activeUrls = urls?.filter((url) => url.status === "active").length;
    const avgClicks = Math.round(totalClicks! / (urls?.length ?? 0)) || 0;

    const filteredUrls = urls.filter(
        (url) =>
            url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // url.customAlias.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUrls = [...filteredUrls].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "most-clicks":
                return b.totalClicks - a.totalClicks;
            case "least-clicks":
                return a.totalClicks - b.totalClicks;
            default:
                return 0;
        }
    });

    const handleDelete = async (urlId: string) => {
        try {
            await fetcher.submit({ urlId }, { method: "DELETE", action: `/api/urls/${urlId}` });
            toast.success('Url deleted')
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="aurora-bg"></div>

            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6">
                        <div className="mb-8 md:mb-10">
                            <h1 className="text-gradient mb-2">Dashboard</h1>
                            <p className="text-large">
                                Manage your shortened URLs and track performance
                            </p>
                        </div>
                        <Form action="/url/create">
                            <button className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
                                <Plus className="w-5 h-5" />
                                Create New Link
                            </button>
                        </Form>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="stat-card">
                            <div className="flex items-center justify-center mb-3">
                                <div className="feature-icon">
                                    <Link className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="stat-number">{urls.length}</div>
                            <p className="text-sm text-[var(--text-muted)]">Total Links</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-center mb-3">
                                <div className="feature-icon">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            {/* <div className="stat-number">{totalClicks.toLocaleString()}</div> */}
                            <div className="stat-number">
                                {Number.isNaN(totalClicks) ? 0 : totalClicks}
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Total Clicks</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-center mb-3">
                                <div className="feature-icon">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="stat-number">{avgClicks}</div>
                            <p className="text-sm text-[var(--text-muted)]">Avg Clicks/Link</p>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-center mb-3">
                                <div className="feature-icon">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="stat-number">{activeUrls}</div>
                            <p className="text-sm text-[var(--text-muted)]">Active Links</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                        <div className="flex gap-4 items-center">
                            <div className="relative input w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    className="bg-transparent border-none outline-none ml-6 w-full h-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest" className="">Newest</option>
                                <option value="oldest" className="">Oldest</option>
                                <option value="most-clicks" className="">Most Clicks</option>
                                <option value="least-clicks" className="">Least Clicks</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode("cards")}
                                className={`btn btn-sm ${
                                    viewMode === "cards" ? "btn-primary" : "btn-ghost"
                                }`}>
                                Cards
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`btn btn-sm ${
                                    viewMode === "table" ? "btn-primary" : "btn-ghost"
                                }`}>
                                Table
                            </button>
                        </div>
                    </div>
                </div>

                {/* URLs Grid/Table */}
                {viewMode === "cards" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedUrls.map((url) => (
                            <UrlCard
                                key={url.id}
                                url={url}
                                copiedId={copiedId}
                                setCopiedId={setCopiedId}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="border-[var(--border)]">
                                        <th className="text-[var(--text-primary)]">Link</th>
                                        <th className="text-[var(--text-primary)]">Short URL</th>
                                        <th className="text-[var(--text-primary)]">Clicks</th>
                                        <th className="text-[var(--text-primary)]">Created</th>
                                        <th className="text-[var(--text-primary)]">Status</th>
                                        <th className="text-[var(--text-primary)]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedUrls.map((url) => (
                                        <tr
                                            key={url.id}
                                            className="border-[var(--border)] hover:bg-[var(--surface-hover)]">
                                            <td>
                                                <div>
                                                    <div className="font-medium text-[var(--text-primary)]">
                                                        {url.title || "Untitled Link"}
                                                    </div>
                                                    <div className="text-sm text-[var(--text-muted)] truncate text-ellipsis">
                                                        {truncateUrl(url.originalUrl, 50)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-[var(--aurora-cyan)] text-sm">
                                                        {import.meta.env.VITE_BASE_URL +
                                                            "/short/" +
                                                            url.shortUrl}
                                                    </code>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                url.shortUrl,
                                                                url.id,
                                                                setCopiedId
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm">
                                                        {copiedId === url.id ? (
                                                            <svg
                                                                className="w-4 h-4 text-green-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-medium text-gradient-green">
                                                    {/* {url.clicks.toLocaleString()} */}
                                                    {url.totalClicks ? url.totalClicks : 0}
                                                </span>
                                            </td>
                                            <td className="text-[var(--text-muted)]">
                                                {formatDate(url.createdAt.toLocaleString())}
                                            </td>
                                            <td>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        url.status === "active"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                    {url.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Form action={`/url/detail/${url.shortUrl}`}>
                                                        <button className="btn btn-ghost btn-sm">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Form>
                                                    {/* <button className="btn btn-ghost btn-sm">
                                                        <Edit className="w-4 h-4" />
                                                    </button> */}
                                                    <button
                                                        className="btn btn-ghost btn-sm text-red-400"
                                                        onClick={() => handleDelete(url.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {sortedUrls.length === 0 && (
                    <div className="text-center py-12">
                        <div className="glass rounded-xl p-8 max-w-md mx-auto">
                            <Link className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                            <h3 className="text-xl font-semibold mb-2">No links found</h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                {searchTerm
                                    ? "No links match your search criteria."
                                    : "Create your first shortened link to get started."}
                            </p>
                            <Form action="/url/create">
                                <button className="btn-primary flex mx-auto">
                                    {/* <span className="flex"> */}
                                    <Plus className="w-5 h-5 mr-2" />
                                    <span>Create New Link</span>
                                    {/* </span> */}
                                </button>
                            </Form>
                        </div>
                    </div>
                )}
                <div className="mt-12 border-t border-t-gray-500 flex justify-between gap-2">
                    <Form
                        action="/api/signout"
                        method="POST"
                        className="">
                        <button className="btn btn-ghost whitespace-nowrap mt-5">Signout</button>
                    </Form>
                    <RouterLink
                        to="/url/analytics"
                        className="btn btn-ghost whitespace-nowrap mt-5">
                        <span>Go to Analytics</span>
                        <ArrowRight className="w-5 h-5 ml-1" />
                    </RouterLink>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

// 'mobile' | 'tablet' | 'console' | 'smarttv' | 'wearable' | 'xr' | 'embedded'