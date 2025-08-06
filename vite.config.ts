import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    build: {
        rollupOptions: {
            external: ["@prisma/client", ".prisma/client/index-browser"],
        },
    },
    optimizeDeps: {
        exclude: ["@prisma/client"],
    },
    ssr: {
        // try this first:
        external: ["@prisma/client", "react"],
        // if problems persist, flip it:
        // noExternal: ["@prisma/client", "prisma"],
    },
});
