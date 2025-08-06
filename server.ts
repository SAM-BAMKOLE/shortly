import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import fetch from "node-fetch";
// import { type ClickData } from "./app/utils/urls"
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

dotenv.config();

// Prisma instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}


const viteDevServer =
    process.env.NODE_ENV === "production"
        ? undefined
        : await import("vite").then((vite) =>
              vite.createServer({
                  server: { middlewareMode: true },
              })
          );

const reactRouterHandler = createRequestHandler({
    build: viteDevServer
        ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build") // @ts-ignore
        : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());
app.disable("x-powered-by");

if (viteDevServer) {
    app.use(viteDevServer.middlewares);
} else {
    app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
}

app.use(express.static("build/client", { maxAge: "1h" }));
app.use(morgan("tiny"));

// =========================
// Middleware to track clicks on /:shortUrl
const reservedRoutes = ["/url", "/auth"];
app.get("/short/:shortUrl", async (req, res, next) => {
  if (reservedRoutes.some(path => req.path.startsWith(path))) return next();

  const shortUrl = req.params.shortUrl;
  const userAgent = req.headers["user-agent"] || "";
  const referer = req.headers["referer"] || "";
  let ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress;

  // Immediately redirect user while processing analytics in background
  const urlRecord = await prisma.url.findUnique({ where: { shortUrl, status: "active" } });
  if (!urlRecord) return res.status(404).send("URL not found");

  res.redirect(urlRecord.originalUrl);

  if (ip === "::1") {
    // ip = "8.8.8.8"
    ip = "102.89.82.18"
  }

  const API_KEY = process.env.IPGEOLOCATION_API_KEY;
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`;

  // Background logging
  (async () => {
    try {
      const geoData = await fetch(url).then((r) => r.json());

      const clickData = {
          urlId: urlRecord.id,
          ipAddress: ip || null,
          country: geoData.country_name || null,
          region: geoData.state_prov || null,
          city: geoData.city || null,
          userAgent,
          deviceType: detectDeviceType(userAgent),
          browser: detectBrowser(userAgent),
          referer,
      };

      await recordClick(urlRecord.id, clickData)
      /*
      await prisma.click.create({
        data: {
          urlId: urlRecord.id,
          ipAddress: ip || null,
          country: geoData.country_name || null,
          region: geoData.region || null,
          city: geoData.city || null,
          userAgent,
          deviceType: detectDeviceType(userAgent),
          browser: detectBrowser(userAgent),
          referer,
        },
      });
      */
    } catch (err) {
      console.error("Failed to log click:", err);
    }
  })();
});
// =========================

app.all("*", reactRouterHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));

// UTILITY FUNCS
// @ts-ignore
function detectDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    if (/windows|mac|linux/i.test(userAgent)) return "desktop";
    return "other";
}

// @ts-ignore
function detectBrowser(userAgent) {
    if (/chrome|crios/i.test(userAgent)) return "Chrome";
    if (/firefox|fxios/i.test(userAgent)) return "Firefox";
    if (/safari/i.test(userAgent)) return "Safari";
    if (/edg/i.test(userAgent)) return "Edge";
    return "Other";
}

// @ts-ignore
export async function recordClick(urlId, clickData) {
    try {
        // Record the click
        const click = await prisma.click.create({
            data: {
                urlId,
                ...clickData,
            },
        });

        await prisma.url.update({
            where: { id: urlId },
            data: {
                totalClicks: { increment: 1 },
            },
        });

        return click;
    } catch (error) { // @ts-ignore
        throw new Error(`Failed to record click: ${error.message}`);
    }
}