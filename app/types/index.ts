export interface UrlType {
    id: string;
    title?: string;
    originalUrl: string;
    shortUrl: string;
    // customAlias: string;
    createdAt: string;
    updatedAt: string;
    clicks: number;
    status: string;
    // tags: string[];
    description: string;
    totalClicks: number;
    uniqueClicks: number;
    clickHistory?: number[];
}

// ANALYTICS

export interface ClicksData {
    date: string;
    clicks: number;
    links: number;
}

export interface DeviceData {
    name: string;
    value: number;
    color: string;
}

export interface LocationData {
    country: string;
    city?: string;
    clicks: number;
    percentage: number;
}

export interface TopLinks {
    id: number | string;
    shortUrl: string;
    originalUrl: string;
    clicks: number;
}

export interface AnalyticsData {
    totalClicks: number;
    totalLinks: number;
    totalUsers: number;
    avgClickRate: number;
    clicksData: ClicksData[];
    deviceData: DeviceData[];
    locationData: LocationData[];
    topLinks: TopLinks[];
}
