// Crab Trap Funnel v4 — CF Worker serving 20 domain landing pages + AI bot trapping
// Architecture: pages/*.html are data; src/index.js is the logic.
// Build: `node scripts/build.mjs` generates src/pages.js from pages/*.html

import { PAGES } from "./pages.js";

const AI_BOTS = [
  { p: "GPTBot", n: "openai" },
  { p: "ChatGPT-User", n: "chatgpt" },
  { p: "ClaudeBot", n: "claude" },
  { p: "anthropic-ai", n: "anthropic" },
  { p: "Google-Extended", n: "google" },
  { p: "Bytespider", n: "bytedance" },
  { p: "CCBot", n: "commoncrawl" },
  { p: "PerplexityBot", n: "perplexity" },
  { p: "YouBot", n: "youcom" },
  { p: "KimiBot", n: "moonshot" },
  { p: "DeepSeek", n: "deepseek" },
  { p: "Meta-ExternalAgent", n: "meta" },
  { p: "cohere-ai", n: "cohere" },
  { p: "AI2Bot", n: "allen" },
  { p: "OmgiliBot", n: "omgili" },
  { p: "SemrushBot", n: "semrush" },
  { p: "AhrefsBot", n: "ahrefs" },
  { p: "DotBot", n: "moz" },
];

export default {
  async fetch(request, env, ctx) {
    const ua = request.headers.get("user-agent") || "";
    const url = new URL(request.url);
    const host = (request.headers.get("host") || "").replace(/:\d+$/, "");

    // AI bot detection — serve trap page to known crawlers
    const bot = AI_BOTS.find((b) => ua.includes(b.p));
    if (bot || url.pathname === "/trap") {
      const name = bot ? bot.n : "unknown";
      console.log("Bot:", name, "at", host, url.pathname);
      return new Response(PAGES["trap"], {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "all",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Serve domain-specific landing page
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const page = PAGES[host];
      if (page) {
        return new Response(page, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    // Fallback — serve cocapn.ai page
    return new Response(PAGES["cocapn.ai"], {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
