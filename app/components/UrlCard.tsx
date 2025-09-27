import {
    BarChart3,
    Copy,
    Edit,
    ExternalLink,
    Eye,
    Globe,
    MoreVertical,
    Share2,
    Trash2,
} from "lucide-react";
import { Link } from "react-router";
import type { Url } from "@prisma/client";
import { copyToClipboard, formatDate, truncateUrl } from "~/utils/helpers";

export const UrlCard = ({
    url,
    copiedId,
    setCopiedId,
    handleDelete
}: {
    url: Url;
    copiedId: string | null;
    setCopiedId: React.Dispatch<React.SetStateAction<string | null>>;
    handleDelete: (urlId: string)=> Promise<void>
}) => {
    return (
        <div className="glass bg-opacity-20 rounded-xl p-6 hover:bg-[var(--surface-hover)] transition-all duration-300 hover:transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-[var(--aurora-blue)]" />
                        <span className="text-sm text-[var(--text-muted)]">
                            {formatDate(url.createdAt.toLocaleString())}
                        </span>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                url.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                            {url.status}
                        </span>
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                        {url.title || "Untitled Link"}
                    </h3>
                    <p className="text-[.4rem] text-[var(--text-muted)] mb-3 text-ellipsis truncate">
                        {url.originalUrl}
                    </p>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                        <MoreVertical className="w-4 h-4" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 bg-gray-950 rounded-lg w-48">
                        <li>
                            <Link
                                to={`/url/detail/${url.shortUrl}`}
                                className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                            </Link>
                        </li>
                        {/* <li>
                            <a className="flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit
                            </a>
                        </li> */}
                        {/* <li>
                            <a className="flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </a>
                        </li> */}
                        <li>
                                <button className="flex items-center gap-2 text-red-400" onClick={()=> handleDelete(url.id)}>
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-50/10 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[var(--aurora-cyan)] w-4/5 break-all">
                        {import.meta.env.VITE_BASE_URL + "/short/" + url.shortUrl}
                    </span>
                    <button
                        onClick={() => copyToClipboard(url.shortUrl, url.id, setCopiedId)}
                        className={`btn btn-sm transition-all btn-ghost hover:bg-[var(--surface-hover)] ${
                            copiedId === url.id
                                ? "text-green-600 border-green-500"
                                : ""
                        }`}>
                        {copiedId === url.id ? (
                            <>
                                <svg
                                    className="w-4 h-4"
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
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-[var(--aurora-purple)]" />
                        <span className="text-sm font-medium text-gradient-green">
                            {/* {url.clicks.toLocaleString()} clicks */}
                            {url.totalClicks ?? 0} clicks
                        </span>
                    </div>
                    <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm">
                        <ExternalLink className="w-4 h-4" />
                        Visit
                    </a>
                </div>

                {/* {url.tags?.length? > 0 && (
                    <div className="flex gap-1">
                        {url.tags.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[var(--surface)] rounded-md text-xs text-[var(--text-muted)]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
};
