import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [solid(), vanillaExtractPlugin()],
    server: {
        port: 8080,
    },
});
