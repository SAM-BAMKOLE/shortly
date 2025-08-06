import { prisma } from "~/lib/prisma";

// 1. Clicks Data: [{ date: "2024-01-01", clicks: 120, links: 45 }, ...]
export async function getClicksData(userId: string) {
  const clicks = await prisma.click.groupBy({
    by: ["timestamp", "urlId"],
    _count: { id: true },
    where: {
      url: { creatorId: userId }
    }
  });
  // Group by date
  const dateMap = new Map<string, { clicks: number; links: Set<string> }>();
  for (const c of clicks) {
    const date = c.timestamp.toISOString().slice(0, 10);
    if (!dateMap.has(date)) {
      dateMap.set(date, { clicks: 0, links: new Set() });
    }
    const entry = dateMap.get(date)!;
    entry.clicks += c._count.id;
    entry.links.add(c.urlId);
  }
  return Array.from(dateMap.entries()).map(([date, { clicks, links }]) => ({
    date,
    clicks,
    links: links.size,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

// 2. Device Data: [{ name: "Desktop", value: 45, color: "#6366F1" }, ...]
const DEVICE_COLORS: Record<string, string> = {
  Desktop: "#6366F1",
  Mobile: "#22D3EE",
  Tablet: "#F59E42",
  Other: "#A1A1AA",
};

export async function getDeviceData(userId: string) {
  const deviceCounts = await prisma.click.groupBy({
    by: ["deviceType"],
    _count: { id: true },
    where: {
      url: { creatorId: userId }
    }
  });
  let desktop = 0, mobile = 0, tablet = 0, other = 0;
  for (const d of deviceCounts) {
    const type = (d.deviceType || "Other").toLowerCase();
    if (type === "desktop") desktop += d._count.id;
    else if (type === "mobile") mobile += d._count.id;
    else if (type === "tablet") tablet += d._count.id;
    else other += d._count.id;
  }
  return [
    { name: "Desktop", value: desktop, color: DEVICE_COLORS.Desktop },
    { name: "Mobile", value: mobile, color: DEVICE_COLORS.Mobile },
    { name: "Tablet", value: tablet, color: DEVICE_COLORS.Tablet },
    { name: "Other", value: other, color: DEVICE_COLORS.Other },
  ];
}

// 3. Location Data: [{ country: "United States", clicks: 1250, percentage: 35 }, ...]
export async function getLocationData(userId: string) {
  const locationCounts = await prisma.click.groupBy({
    by: ["country", "city"],
    _count: { id: true },
    where: {
      url: { creatorId: userId }
    }
  });
  const total = locationCounts.reduce((sum, c) => sum + c._count.id, 0);
  return locationCounts
    .filter(c => c.country)
    .map(c => ({
      country: c.country!,
      city: c.city || undefined,
      clicks: c._count.id,
      percentage: total ? Math.round((c._count.id / total) * 100) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);
}

// 4. Top Links: [{ id: 1, shortUrl: "abc123", originalUrl: "https://example.com/very-long-url-here", clicks: 1250 }, ...]
export async function getTopLinks( userId: string, limit = 40,) {
  // Get top links by click count
  const links = await prisma.url.findMany({
    orderBy: { totalClicks: "desc" },
    take: limit,
    select: {
      id: true,
      shortUrl: true,
      originalUrl: true,
      totalClicks: true,
    },
    where: {
      creatorId: userId
    }
  });
  // Optionally, you can add a numeric id field for display
  return links.map((l, i) => ({
    id: i + 1,
    shortUrl: l.shortUrl,
    originalUrl: l.originalUrl,
    clicks: l.totalClicks,
  }));
}

export async function getAnalyticsData(userId: string) {
    const [totalClicks, totalLinks] = await Promise.all([
        prisma.click.count({ where: { url: { creatorId: userId } } }),
        prisma.url.count({ where: { status: "active", creatorId: userId } })
    ])

    const [clicksData, deviceData, locationData, topLinks] = await Promise.all([
        getClicksData(userId),
        getDeviceData(userId),
        getLocationData(userId),
        getTopLinks(userId),
    ]);

    return {
        totalClicks,
        totalLinks,
        clicksData,
        deviceData,
        locationData,
        topLinks,
    };
}