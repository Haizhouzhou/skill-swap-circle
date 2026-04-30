import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), skillswapKmlPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));

type MiddlewareNext = (error?: unknown) => void;

function skillswapKmlPlugin(): Plugin {
  const kmlPath = path.resolve(__dirname, "public/skillswap-connections.kml");

  const serveKml = (req: IncomingMessage, res: ServerResponse, next: MiddlewareNext) => {
    const pathname = req.url?.split("?")[0];
    if (pathname !== "/skillswap-connections.kml") {
      next();
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/vnd.google-earth.kml+xml; charset=utf-8");

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(kmlPath)
      .on("error", () => {
        res.statusCode = 404;
        res.end();
      })
      .pipe(res);
  };

  return {
    name: "skillswap-kml-server",
    configureServer(server) {
      server.middlewares.use(serveKml);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveKml);
    },
  };
}
