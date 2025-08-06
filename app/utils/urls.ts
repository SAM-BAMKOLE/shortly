import crypto from "crypto";
import type { Click } from "~/generated/prisma";
import { prisma } from "~/lib/prisma";

// Types for better TypeScript support
export interface CreateUrlData {
    originalUrl: string;
    customAlias?: string;
    title?: string;
    description?: string;
    expiresAt?: Date;
    creatorId: string;
    // tags?: string[];
}

interface UpdateUrlData {
    title?: string;
    description?: string;
    expiresAt?: Date;
    status?: string;
    // tags?: string[];
}

export type ClickData = Omit<Click, "id" | "timestamp" | "urlId">

// =============================================================================
// URL CRUD OPERATIONS
// =============================================================================

/**
 * Create a new short URL
 */
export async function createUrl(data: CreateUrlData) {
    try {
        // Generate unique short code
        let shortCode: string;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // console.log(data);

        do {
            shortCode = generateShortCode();
            const existing = await prisma.url.findUnique({
                where: { shortUrl: `${shortCode}` },
            });
            isUnique = !existing;
            attempts++;

        } while (!isUnique && attempts < maxAttempts);

        if (!isUnique) {
            throw new Error("Unable to generate unique short code");
        }

        // Check if custom alias is provided and unique
        if (data.customAlias) {
            const existingAlias = await prisma.url.findUnique({
                where: { shortUrl: data.customAlias },
            });
            if (existingAlias) {
                throw new Error("Custom alias already exists, it must be unique. Consider changing a few words.");
            }
        }

        const url = await prisma.url.create({
            data: {
                originalUrl: data.originalUrl,
                shortUrl: `${data.customAlias ? data.customAlias : shortCode}`,
                // customAlias: data.customAlias,
                title: data.title,
                description: data.description,
                // expiresAt: data.expiresAt,
                creatorId: data.creatorId,
                // tags: data.tags ? JSON.stringify(data.tags) : null,
            },
        });

        return {
            ...url,
            // tags: url.tags ? JSON.parse(url.tags) : [],
        };
    } catch (error: any) {
        console.log(error);
        return { error: error.message };
    }
}

/**
 * Get URL by short URL or custom alias
 */
export async function getUrlByShort(shortIdentifier: string) {
    try {
        const url = await prisma.url.findFirst({
            where: {
                // OR: [{ shortUrl: { endsWith: shortIdentifier } }, { customAlias: shortIdentifier }],
                shortUrl: { endsWith: shortIdentifier },
                // status: "active",
            },
        });

        if (!url) return null;

        return {
            ...url,
            // tags: url.tags ? JSON.parse(url.tags) : [],
        };
    } catch (error: any) {
        throw new Error(`Failed to get URL: ${error.message}`);
    }
}

/**
 * Get URL by ID with full details
 */
export async function getUrlById(id: string) {
    try {
        const url = await prisma.url.findUnique({
            where: { id },
            include: {
                clicks: {
                    orderBy: { timestamp: "desc" },
                    take: 100, // Last 100 clicks for recent activity
                },
            },
        });

        if (!url) return null;

        return {
            ...url,
            // tags: url.tags ? JSON.parse(url.tags) : [],
            clicks: url.clicks,
        };
    } catch (error: any) {
        throw new Error(`Failed to get URL by ID: ${error.message}`);
    }
}

/**
 * Get all URLs for a user
 */
export async function getUserUrls(creatorId: string, page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;

        const [urls, total] = await Promise.all([
            prisma.url.findMany({
                where: { creatorId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.url.count({
                where: { creatorId },
            }),
        ]);

        return {
            // urls: urls.map((url) => ({
            //     ...url,
            //     tags: url.tags ? JSON.parse(url.tags) : [],
            // })),
            urls,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error: any) {
        throw new Error(`Failed to get user URLs: ${error.message}`);
    }
}

/**
 * Update URL
 */
export async function updateUrl(id: string, data: UpdateUrlData) {
    try {
        const url = await prisma.url.update({
            where: { id },
            // data: {
            //     ...data,
            //     tags: data.tags ? JSON.stringify(data.tags) : undefined,
            // },
            data,
        });

        return {
            ...url,
            // tags: url.tags ? JSON.parse(url.tags) : [],
        };
    } catch (error: any) {
        console.log(error);
        return { error: "Custom Alias must be unique, consider changing a few words" };
    }
}

/**
 * Delete URL (soft delete by setting status)
 */
export async function deleteUrl(id: string) {
    try {
        await prisma.url.update({
            where: { id },
            data: { status: "deleted" },
        });
        return true;
    } catch (error: any) {
        throw new Error(`Failed to delete URL: ${error.message}`);
    }
}

/**
 * Hard delete URL and all associated data
 */
export async function hardDeleteUrl(id: string) {
    try {
        await prisma.url.delete({
            where: { id },
        });
        return true;
    } catch (error: any) {
        throw new Error(`Failed to hard delete URL: ${error.message}`);
    }
}

// =============================================================================
// CLICK TRACKING OPERATIONS
// =============================================================================

/**
 * Record a click on a URL
 */
export async function recordClick(urlId: string, clickData: ClickData) {
    try {
        // Generate fingerprint for unique visitor tracking
        // const fingerprint = generateFingerprint(clickData.ipAddress, clickData.userAgent);

        // Record the click
        const click = await prisma.click.create({
            data: {
                urlId,
                ...clickData,
                // fingerprint,
            },
        });

        // Update URL counters
        // const isUniqueClick = await checkUniqueClick(urlId, fingerprint);

        await prisma.url.update({
            where: { id: urlId },
            data: {
                totalClicks: { increment: 1 },
                // uniqueClicks: isUniqueClick ? { increment: 1 } : undefined,
            },
        });

        return click;
    } catch (error: any) {
        throw new Error(`Failed to record click: ${error.message}`);
    }
}

/**
 * Get detailed analytics for a URL
 */

/*

export async function getUrlAnalytics(urlId: string, days = 30) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get URL details
        const url = await prisma.url.findUnique({
            where: { id: urlId },
        });

        if (!url) throw new Error("URL not found");

        // Get daily stats
        const dailyStats = await prisma.dailyStats.findMany({
            where: {
                urlId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: "asc" },
        });

        // Get raw clicks for additional analysis
        const clicks = await prisma.click.findMany({
            where: {
                urlId,
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Process analytics data
        const analytics = processAnalyticsData(url, dailyStats, clicks);

        return analytics;
    } catch (error: any) {
        throw new Error(`Failed to get analytics: ${error.message}`);
    }
}

*/

// =============================================================================
// DAILY STATS OPERATIONS
// =============================================================================

/**
 * Aggregate daily statistics for a URL
 */
/*

export async function aggregateDailyStats(urlId: string, date: Date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all clicks for the day
        const clicks = await prisma.click.findMany({
            where: {
                urlId,
                timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        if (clicks.length === 0) return null;

        // Calculate aggregations
        const totalClicks = clicks.length;
        const uniqueClicks = new Set(clicks.map((c) => c.fingerprint)).size;

        const geographicData = aggregateByField(clicks, "country");
        const deviceData = aggregateByField(clicks, "deviceType");
        const referrerData = aggregateByField(clicks, "referrerType");
        const hourlyData = aggregateByHour(clicks);

        // Upsert daily stats
        await prisma.dailyStats.upsert({
            where: {
                urlId_date: {
                    urlId,
                    date: startOfDay,
                },
            },
            update: {
                totalClicks,
                uniqueClicks,
                geographicData: JSON.stringify(geographicData),
                deviceData: JSON.stringify(deviceData),
                referrerData: JSON.stringify(referrerData),
                hourlyData: JSON.stringify(hourlyData),
            },
            create: {
                urlId,
                date: startOfDay,
                totalClicks,
                uniqueClicks,
                geographicData: JSON.stringify(geographicData),
                deviceData: JSON.stringify(deviceData),
                referrerData: JSON.stringify(referrerData),
                hourlyData: JSON.stringify(hourlyData),
            },
        });

        return true;
    } catch (error: any) {
        throw new Error(`Failed to aggregate daily stats: ${error.message}`);
    }
}

*/

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function generateShortCode(length = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateFingerprint(ipAddress?: string, userAgent?: string): string {
    const data = `${ipAddress || "unknown"}-${userAgent || "unknown"}`;
    return crypto.createHash("md5").update(data).digest("hex");
}

async function checkUniqueClick(urlId: string, fingerprint: string): Promise<boolean> {
    const existingClick = await prisma.click.findFirst({
        where: {
            urlId,
            // fingerprint,
        },
    });
    return !existingClick;
}

/*

function aggregateByField(clicks: any[], field: string) {
    const counts: Record<string, number|null> = {}; // { [key: string]: number|null }
    
    clicks.forEach((click) => {
        const value = click[field] || "Unknown";
        counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([key, value]) => ({ [field]: key, clicks: value }))
        .sort((a, b) => b.clicks - a.clicks);
}

function aggregateByHour(clicks: any[]) {
    const hourCounts = {};
    clicks.forEach((click) => {
        const hour = new Date(click.timestamp).getHours().toString().padStart(2, "0");
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
        .map(([hour, clicks]) => ({ hour: `${hour}:00`, clicks }))
        .sort((a, b) => a.hour.localeCompare(b.hour));
}

function processAnalyticsData(url: any, dailyStats: any[], clicks: any[]) {
    // This would contain the logic to format data matching your mockData structure
    const clickHistory = dailyStats.map((stat) => ({
        date: stat.date.toISOString().split("T")[0],
        clicks: stat.totalClicks,
        uniqueClicks: stat.uniqueClicks,
    }));

    // Aggregate geographic data from daily stats
    const allGeographicData = dailyStats
        .map((stat) => (stat.geographicData ? JSON.parse(stat.geographicData) : []))
        .flat();

    const geographicData = aggregateAnalyticsData(allGeographicData, "country");

    return {
        ...url,
        tags: url.tags ? JSON.parse(url.tags) : [],
        clickHistory,
        geographicData,
        // ... other processed analytics data
    };
}

function aggregateAnalyticsData(data: any[], field: string) {
    const totals = {};
    data.forEach((item) => {
        const key = item[field];
        totals[key] = (totals[key] || 0) + item.clicks;
    });

    const total = Object.values(totals).reduce((sum: number, clicks: number) => sum + clicks, 0);

    return Object.entries(totals)
        .map(([key, clicks]) => ({
            [field]: key,
            clicks,
            percentage: total > 0 ? ((clicks as number) / total) * 100 : 0,
        }))
        .sort((a, b) => b.clicks - a.clicks);
}

*/
