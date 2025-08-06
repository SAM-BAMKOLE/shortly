// app/routes/redirect.tsx
import { type LoaderFunction, redirect } from "react-router";
import { prisma } from "~/lib/prisma";
import { recordClick, type ClickData } from "~/utils/urls";
import {UAParser} from "ua-parser-js"

export const loader: LoaderFunction = async ({ request, params }) => {
    const { shortUrl, ipAddress } = params;
    if (!shortUrl) throw new Response("Slug not provided", { status: 400 });

    const url = await prisma.url.findUnique({ where: { shortUrl } });
    if (!url) throw new Response("Not Found", { status: 404 });

    console.log(ipAddress)

    const clickData: ClickData = await getClickData(request, ipAddress!);

    console.log("ClickData", clickData)

    await recordClick(url.id, clickData)

    return redirect(url.originalUrl);
};


async function getIpData(ipAddress: string) {
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`)
    const data = await response.json()
    return data
}

export async function getClickData(request: Request, ipAddress: string): Promise<ClickData> {
    const headers = request.headers;
    const userAgent = headers.get("user-agent") || null;
    const referer = headers.get("referer") || headers.get("referrer") || null;
    // IP address is not available directly in a standard fetch Request in most serverless/edge environments.
    // If you are behind a proxy or CDN, you may get it from 'x-forwarded-for' header.
    // let ipAddress = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("cf-connecting-ip") || null;
    let response: ClickData = {
        userAgent,
        ipAddress,
        country: null,
        region: null,
        city: null,
        referer,
        deviceType: null,
        browser: null,
    };

    // The following fields are not available from the request:
    // - country, region, city: You need to use a geo-IP lookup service (e.g., MaxMind, IPinfo) with the IP address.
    // - deviceType, os, browser, screenWidth, screenHeight: You can parse userAgent for deviceType, os, browser (use UAParser.js or similar), but screen size is not available server-side.
    // - fingerprint: Only available if you generate it client-side and send it as a header or query param.

    /*
    if (!ipAddress) {
        const getIp = await fetch("https://api.ipify.org/?format=json")
        const ipData = await getIp.json()
        ipAddress = ipData.ip
        if (!ipAddress) return response;
    }
        */

    const data = await getIpData(ipAddress);

    console.log(data, userAgent)

    response = {
        ...response,
        country: data.country,
        region: data.region,
        city: data.city,
    };

    if (userAgent) {
        const result = UAParser(userAgent);

        response = {
            ...response,
            userAgent,
            deviceType: result.device.type ? String(result.device.type) : null, // Parse from userAgent if needed
            browser: result.browser.name ? String(result.browser.name) : null,
        };
    }

    return response;
}