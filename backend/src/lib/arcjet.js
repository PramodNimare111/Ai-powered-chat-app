import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";

const mode = ENV.ARCJET_ENV === "production" || ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode }),
    // Create a bot detection rule
    detectBot({
      mode, // Use LIVE in production, DRY_RUN during development so tools like Postman aren't blocked
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
      mode, // Use LIVE in production, DRY_RUN during development
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;