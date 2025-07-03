import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const line = "----------------------------------------";
const msg = "Building for production...";

process.stdout.write(`${line}\n${msg}\n${line}\n`);

export default defineConfig({
    base: "./",
    plugins: [solid(), vanillaExtractPlugin()],
    logLevel: "error",
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});
