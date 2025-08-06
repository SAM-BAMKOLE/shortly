import {
    AreaChart,
    BarChart,
    BarChart3,
    Clock,
    Globe,
    Monitor,
    PieChart,
    Share2,
    Smartphone,
    Tablet,
} from "lucide-react";
import { useState } from "react";
import {
    Area,
    Bar,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { UrlType } from "~/types";

export default function UrlDetailAnalytics({ urlData }: { urlData: UrlType }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [timeRange, setTimeRange] = useState("7d");

    const COLORS = ["#6366F1", "#EC4899", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981"];

    return (
        <>
            {/* Analytics Tabs */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="border-b border-[var(--border)]">
                    <nav className="flex">
                        {[
                            { id: "overview", label: "Overview", icon: BarChart3 },
                            { id: "geography", label: "Geography", icon: Globe },
                            { id: "referrers", label: "Referrers", icon: Share2 },
                            { id: "devices", label: "Devices", icon: Monitor },
                            { id: "time", label: "Time Analysis", icon: Clock },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "text-[var(--primary-light)] border-b-2 border-[var(--primary-light)]"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                                onClick={() => setActiveTab(tab.id)}>
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Click History</h3>
                                <select
                                    className="input w-32"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}>
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                </select>
                            </div>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={urlData.clickHistory}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--border)"
                                        />
                                        <XAxis dataKey="date" stroke="var(--text-muted)" />
                                        <YAxis stroke="var(--text-muted)" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--background-light)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="clicks"
                                            stroke="#6366F1"
                                            fill="url(#colorClicks)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="uniqueClicks"
                                            stroke="#EC4899"
                                            fill="url(#colorUniqueClicks)"
                                            strokeWidth={2}
                                        />
                                        <defs>
                                            <linearGradient
                                                id="colorClicks"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#6366F1"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#6366F1"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                            <linearGradient
                                                id="colorUniqueClicks"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#EC4899"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#EC4899"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === "geography" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Geographic Distribution</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={urlData.geographicData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="clicks"
                                                label={({ name, percentage }) =>
                                                    `${name} ${percentage}%`
                                                }>
                                                {urlData.geographicData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-3">
                                    {urlData.geographicData.map((country, index) => (
                                        <div
                                            key={country.country}
                                            className="flex items-center justify-between p-3 glass rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            COLORS[index % COLORS.length],
                                                    }}
                                                />
                                                <span className="font-medium">
                                                    {country.country}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {country.clicks}
                                                </div>
                                                <div className="text-sm text-[var(--text-muted)]">
                                                    {country.percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "referrers" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Traffic Sources</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={urlData.referrerData} layout="horizontal">
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="var(--border)"
                                            />
                                            <XAxis type="number" stroke="var(--text-muted)" />
                                            <YAxis
                                                dataKey="source"
                                                type="category"
                                                stroke="var(--text-muted)"
                                                width={80}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--background-light)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar dataKey="clicks" fill="#6366F1" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-3">
                                    {urlData.referrerData.map((referrer, index) => (
                                        <div
                                            key={referrer.source}
                                            className="flex items-center justify-between p-3 glass rounded-lg">
                                            <span className="font-medium">{referrer.source}</span>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {referrer.clicks}
                                                </div>
                                                <div className="text-sm text-[var(--text-muted)]">
                                                    {referrer.percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "devices" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Device Types</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {urlData.deviceData.map((device, index) => (
                                    <div key={device.device} className="stat-card">
                                        <div className="flex items-center justify-center mb-3">
                                            <div className="feature-icon">
                                                {device.device === "Desktop" && (
                                                    <Monitor className="w-6 h-6 text-white" />
                                                )}
                                                {device.device === "Mobile" && (
                                                    <Smartphone className="w-6 h-6 text-white" />
                                                )}
                                                {device.device === "Tablet" && (
                                                    <Tablet className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="stat-number">{device.clicks}</div>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {device.device} ({device.percentage}%)
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={urlData.deviceData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="clicks"
                                            label={({ device, percentage }) =>
                                                `${device} ${percentage}%`
                                            }>
                                            {urlData.deviceData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === "time" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Peak Hours Analysis</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={urlData.topHours}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--border)"
                                        />
                                        <XAxis dataKey="hour" stroke="var(--text-muted)" />
                                        <YAxis stroke="var(--text-muted)" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--background-light)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Bar dataKey="clicks" fill="url(#colorGradient)" />
                                        <defs>
                                            <linearGradient
                                                id="colorGradient"
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
                                                    stopColor="#EC4899"
                                                    stopOpacity={0.8}
                                                />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
