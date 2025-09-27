import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import {
    TrendingUp,
    Link,
    MousePointer,
    Globe,
    BarChart3,
    Activity,
    ArrowLeft,
} from "lucide-react";
import type { Route } from "../routes/+types/analytics";
import type { AnalyticsData, DeviceData } from "~/types";
import  { type LoaderFunctionArgs, Link as RouterLink } from "react-router";
import { getAnalyticsData } from "~/utils/analytics";
import { getSession } from "~/lib/session"

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Detailed analytics of the performance of all your shortened links" },
        {
            name: "description",
            content:
                "Transform long, complex URLs into clean, shareable links. Track performance, analyze clicks, and boost your marketing campaigns with powerful insights.",
        },
    ];
}

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request)
    const results = await getAnalyticsData(session?.userId!)
    return results
}

const AnalyticsOverview = ({ loaderData }: Route.ComponentProps) => {
    const [timeRange, setTimeRange] = useState("7d");
    const [isLoading, setIsLoading] = useState(false);
    // const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(null);

    const analyticsData: Omit<AnalyticsData, "totalUsers" | "avgClickRate"> = loaderData!;

    /*
    // Simulate data fetching
    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For now, we'll use dummy data
            setAnalyticsData(loaderData!);

            setIsLoading(false);
        };

        fetchAnalytics();
    }, [timeRange]);
    */

    const StatCard = ({
        icon: Icon,
        title,
        value,
        change,
        trend,
        description,
    }: {
        icon: React.ElementType;
        title: string;
        value: string;
        change: string;
        trend: string;
        description: string;
    }) => (
        <div className="stat-card group">
            <div className="flex items-start justify-between mb-4">
                <div className="feature-icon group-hover:animate-pulse-glow">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                    className={`text-sm flex items-center ${
                        trend === "up"
                            ? "text-green-400"
                            : trend === "down"
                            ? "text-red-400"
                            : "text-gray-400"
                    }`}>
                    {trend === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                    {change}
                </div>
            </div>
            <div>
                <h3 className="stat-number">{value}</h3>
                <p className="text-[var(--text-secondary)] font-medium mb-2">{title}</p>
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
            </div>
        </div>
    );

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active: string;
        payload: Array<DeviceData>;
        label: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-3 rounded-lg border border-[var(--border)]">
                    <p className="text-[var(--text-primary)] font-medium">{`Date: ${label}`}</p>
                    {payload.map(({ name, value }, index: number) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{
                                color:
                                    name === "Desktop"
                                        ? "#6366F1"
                                        : name === "Mobile"
                                        ? "#8B5CF6"
                                        : "#EC4899",
                            }}>
                            {`${name}: ${value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="aurora-bg"></div>
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-[var(--text-secondary)] text-lg">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="aurora-bg"></div>

            <div className="container py-8">
                <div className="mb-5">
                    <RouterLink
                        to="/url/dashboard"
                        className="btn btn-ghost whitespace-nowrap mb-4 lg:mb-0">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span>Back to Dashboard</span>
                    </RouterLink>
                </div>

                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-gradient mb-2">Analytics Overview</h1>
                            <p className="text-large text-[var(--text-secondary)]">
                                Comprehensive insights into your URL shortening performance
                            </p>
                        </div>

                        {/*
                        <div className="flex items-center gap-4">
                            <select
                                className="select"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}>
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                                <option value="1y">Last year</option>
                            </select>
                        </div> */}
                    </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard
                        icon={MousePointer}
                        title="Total Clicks"
                        value={analyticsData.totalClicks.toLocaleString()}
                        change=""
                        trend="up"
                        description="Clicks in selected period"
                    />
                    <StatCard
                        icon={Link}
                        title="Active Links"
                        value={analyticsData.totalLinks.toLocaleString()}
                        change=""
                        trend="up"
                        description="Currently active links"
                    />
                </div>

                {analyticsData.totalLinks > 0 ? (
                    <>
                        {analyticsData.totalClicks > 0 ? (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Clicks Over Time */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-white">Clicks Over Time</h3>
                                            <BarChart3 className="w-6 h-6 text-[var(--text-muted)]" />
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={analyticsData.clicksData}>
                                                <defs>
                                                    <linearGradient
                                                        id="clicksGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#6366F1"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#6366F1"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="rgba(255,255,255,0.1)"
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{
                                                        fill: "var(--text-muted)",
                                                        fontSize: 12,
                                                    }}
                                                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                                />
                                                <YAxis
                                                    tick={{
                                                        fill: "var(--text-muted)",
                                                        fontSize: 12,
                                                    }}
                                                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                                />
                                                <Tooltip
                                                    content={
                                                        <CustomTooltip
                                                            active=""
                                                            label=""
                                                            payload={analyticsData.deviceData}
                                                        />
                                                    }
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="clicks"
                                                    stroke="#6366F1"
                                                    strokeWidth={3}
                                                    fill="url(#clicksGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Device Breakdown */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-white">Device Breakdown</h3>
                                            <Activity className="w-6 h-6 text-[var(--text-muted)]" />
                                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData.deviceData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name} ${value}%`}
                                                    labelLine={false}>
                                                    {analyticsData.deviceData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.color}
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Top Performing Links */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-white">Top Performing Links</h3>
                                            <TrendingUp className="w-6 h-6 text-[var(--text-muted)]" />
                                        </div>
                                        <div className="space-y-4 max-h-96 overflow-scroll">
                                            {analyticsData.topLinks.map((link, index) => (
                                                <div
                                                    key={link.id}
                                                    className="glass-hover p-4 rounded-lg border border-[var(--border)]">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-sm font-bold text-white">
                                                                    #{index + 1}
                                                                </span>
                                                                <code className="text-sm text-[var(--aurora-cyan)] bg-[var(--surface)] px-2 py-1 rounded">
                                                                    {import.meta.env.VITE_BASE_URL +
                                                                        "/short/" +
                                                                        link.shortUrl}
                                                                </code>
                                                            </div>
                                                            <p className="text-xs text-[var(--text-muted)] truncate">
                                                                {link.originalUrl}
                                                            </p>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <p className="text-lg font-bold text-[var(--text-primary)]">
                                                                {link.clicks.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Geographic Distribution */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-white">Geographic Distribution</h3>
                                            <Globe className="w-6 h-6 text-[var(--text-muted)]" />
                                        </div>
                                        <div className="space-y-4 max-h-96 overflow-scroll">
                                            <table className="table">
                                                <thead className="text-white">
                                                    <tr>
                                                        <th>S/N</th>
                                                        <th>Country</th>
                                                        <th>City</th>
                                                        <th>Clicks</th>
                                                        <th>Percentage</th>
                                                    </tr>
                                                </thead>
                                                {analyticsData.locationData.map(
                                                    (location, index) => (
                                                        <tbody key={index}>
                                                            <tr className="">
                                                                <td className="text-xs font-bold">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="text-[var(--text-primary)] font-medium">
                                                                    {location.country}
                                                                </td>
                                                                <td className="text-[var(--text-primary)] font-medium">
                                                                    {location.city}
                                                                </td>
                                                                <td className="text-[var(--text-primary)] font-bold">
                                                                    {location.clicks.toLocaleString()}
                                                                </td>
                                                                <td className="text-[var(--text-primary)] font-bold">
                                                                    {location.percentage}%
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-center">
                                    <p className="font-semibold">No clicks on your shortened link(s) yet</p>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-center">
                            <p className="font-semibold">No Link shortened yet</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsOverview;
