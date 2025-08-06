import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    // route('/:shortUrl', './routes/redirect.tsx'),

    // RESOURCE ROUTES
    // route('/:shortUrl/:ipAddress', './routes/redirectLoader.ts'),

    layout("routes/layout/auth.tsx", [
        route("/auth/signup", "./routes/auth/signup.tsx"),
        route("/auth/signin", "./routes/auth/signin.tsx"),
    ]),

    layout("routes/layout/protect.tsx", [
        // PROTECTED ROUTES
        route("/url/dashboard", "./routes/dashboard.tsx"),
        route("/url/analytics", "./routes/analytics.tsx"),
        route("/url/detail/:shortUrl", "./routes/detail.tsx"),    
        route("/url/create", "./routes/create.tsx"),

        // RESOURCE ROUTES
        route("/api/signin", "./api/auth/signin.ts"),
        route("/api/signup", "./api/auth/signup.ts"),
        route("/api/signout", "./api/auth/signout.ts"),
        route("/api/urls/:urlId", "./api/urls/actions.ts"),
    ]),
] satisfies RouteConfig;
