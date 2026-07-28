#!/usr/bin/env node
/**
 * Local EulerStream-compatible Sign Server
 * 
 * Proxies the EulerStream API using tiktok-signature's local browser.
 * The tiktok-live-connector connects to this instead of tiktok.eulerstream.com.
 * 
 * Endpoints:
 *   GET /webcast/fetch    - Fetch signed WebSocket URL + initial payload
 *   GET /sign/url         - Sign a URL (X-Bogus + X-Gnarly)
 *   GET /health           - Health check
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIGN_PORT = parseInt(process.env.SIGN_PORT || "3099");
const TIKTOK_SIGN_SERVER = process.env.TIKTOK_SIGN_SERVER || "http://localhost:8080";

console.log(`[EulerProxy] Starting local EulerStream proxy on port ${SIGN_PORT}`);
console.log(`[EulerProxy] Using tiktok-signature at ${TIKTOK_SIGN_SERVER}`);

const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15";

/**
 * Call tiktok-signature's /signature endpoint to sign a URL
 */
async function signUrl(url) {
  const response = await fetch(`${TIKTOK_SIGN_SERVER}/signature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    throw new Error(`Sign server returned ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  if (data.status !== "ok") {
    throw new Error(`Sign failed: ${data.message || JSON.stringify(data)}`);
  }
  return data.data;
}

/**
 * Wait for tiktok-signature server to be ready
 */
async function waitForSignServer(maxWait = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    try {
      const res = await fetch(`${TIKTOK_SIGN_SERVER}/health`);
      if (res.ok) {
        const data = await res.json();
        if (data.ready) {
          console.log("[EulerProxy] tiktok-signature server is ready");
          return true;
        }
        console.log("[EulerProxy] tiktok-signature server initializing...");
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("tiktok-signature server not ready after " + maxWait + "ms");
}

/**
 * Handle GET /webcast/fetch - the main endpoint the connector calls
 * 
 * EulerStream returns:
 *   - Binary protobuf body (ProtoMessageFetchResult)
 *   - x-set-tt-cookie header
 *   - x-room-id header
 * 
 * We use tiktok-signature's /fetch endpoint which makes the request
 * through the browser and returns the response data.
 */
async function handleWebcastFetch(req, res) {
  const url = new URL(req.url, `http://localhost:${SIGN_PORT}`);
  const roomId = url.searchParams.get("room_id");
  const uniqueId = url.searchParams.get("unique_id");
  const client = url.searchParams.get("client") || "ttlive-node";
  const cursor = url.searchParams.get("cursor") || "";
  const sessionId = req.headers["x-jwt-key"] || req.headers["x-api-key"] || "";

  console.log(`[EulerProxy] /webcast/fetch room_id=${roomId} unique_id=${uniqueId}`);

  if (!roomId && !uniqueId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "room_id or unique_id required" }));
    return;
  }

  // Build the TikTok webcast fetch URL
  const params = new URLSearchParams({
    aid: "1988",
    app_name: "tiktok_web",
    live_id: "12",
    device_platform: "web_pc",
    language: "en",
    cookie_enabled: "true",
    screen_width: "1920",
    screen_height: "1080",
    browser_language: "en-US",
    browser_name: "Safari",
    browser_version: "18.6",
    browser_online: "true",
    tz_name: "Europe/Berlin",
    region: "DE",
    app_language: "en",
    channel: "tiktok_web",
    version_code: "180800",
    webcast_language: "en",
    heartbeat_duration: "0",
    resp_content_type: "protobuf",
    history_comment_count: "6",
    client_enter: "1",
    last_rtt: String(Math.floor(Math.random() * 100) + 100),
    compress: "gzip",
  });

  if (roomId) params.set("room_id", roomId);
  if (uniqueId) params.set("unique_id", uniqueId);
  if (cursor) params.set("cursor", cursor);

  // Also append the version_code param that the connector adds
  const fetchUrl = `https://webcast.tiktok.com/webcast/im/fetch/?${params.toString()}&version_code=270000`;

  try {
    // Use tiktok-signature to sign the URL
    const signed = await signUrl(fetchUrl);

    console.log(`[EulerProxy] URL signed, fetching protobuf from TikTok...`);

    // Now fetch the protobuf response from TikTok using the signed URL
    const fetchRes = await fetch(signed.signed_url, {
      method: "GET",
      headers: {
        "User-Agent": signed.navigator?.user_agent || DEFAULT_UA,
        Cookie: signed.cookies || "",
        Accept: "application/octet-stream, */*",
        Referer: "https://www.tiktok.com/",
        Origin: "https://www.tiktok.com",
      },
    });

    if (!fetchRes.ok) {
      const text = await fetchRes.text();
      console.error(`[EulerProxy] TikTok returned ${fetchRes.status}: ${text.substring(0, 200)}`);
      res.writeHead(fetchRes.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `TikTok returned ${fetchRes.status}`, message: text.substring(0, 500) }));
      return;
    }

    const buffer = Buffer.from(await fetchRes.arrayBuffer());
    const setCookie = fetchRes.headers.get("set-cookie") || "";

    // Patch protobuf: TikTok doesn't include wsUrl, but the connector needs it
    const { ProtoMessageFetchResult } = await import("./node_modules/tiktok-live-connector/dist/types/tiktok-schema.js");
    const decoded = ProtoMessageFetchResult.decode(buffer);
    if (!decoded.wsUrl || decoded.wsUrl === "") {
      decoded.wsUrl = "wss://webcast.tiktok.com/webcast/im/push/v2/";
    }
    const patchedBuffer = Buffer.from(ProtoMessageFetchResult.encode(decoded).finish());

    console.log(`[EulerProxy] Got ${buffer.length} bytes -> patched ${patchedBuffer.length} bytes (wsUrl: ${decoded.wsUrl})`);

    // Return in EulerStream format
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "x-set-tt-cookie": setCookie,
      "x-room-id": roomId || "",
      "x-request-id": `local-${Date.now()}`,
      "x-agent-id": "eulerproxy-local",
    });
    res.end(patchedBuffer);
  } catch (e) {
    console.error(`[EulerProxy] Error:`, e.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: e.message }));
  }
}

/**
 * Handle GET /sign/url - sign any TikTok URL (used by webcastSign)
 */
async function handleSignUrl(req, res) {
  const url = new URL(req.url, `http://localhost:${SIGN_PORT}`);
  const targetUrl = url.searchParams.get("url") || url.searchParams.get("u");

  if (!targetUrl) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "url parameter required" }));
    return;
  }

  try {
    const signed = await signUrl(targetUrl);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: 200,
      data: {
        response: {
          tokens: {
            "X-Bogus": signed["x-bogus"] || signed.xBogus || "",
            "X-Gnarly": signed["x-gnarly"] || signed.xGnarly || "",
          },
          signedUrl: signed.signed_url || signed.signedUrl || "",
          userAgent: signed.navigator?.user_agent || DEFAULT_UA,
        },
      },
    }));
  } catch (e) {
    console.error(`[EulerProxy] Sign error:`, e.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: e.message }));
  }
}

/**
 * Handle GET /health
 */
function handleHealth(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    source: "eulerproxy-local",
    signServer: TIKTOK_SIGN_SERVER,
    port: SIGN_PORT,
  }));
}

/**
 * HTTP Request Handler
 */
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${SIGN_PORT}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key, x-jwt-key");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (url.pathname === "/webcast/fetch") {
      return await handleWebcastFetch(req, res);
    }
    if (url.pathname === "/sign/url" || url.pathname === "/sign") {
      return await handleSignUrl(req, res);
    }
    if (url.pathname === "/health") {
      return handleHealth(req, res);
    }
    // Catch-all: health check at root
    if (url.pathname === "/") {
      return handleHealth(req, res);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (e) {
    console.error(`[EulerProxy] Error:`, e.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: e.message }));
  }
}

// Start server
const server = http.createServer(handleRequest);

async function start() {
  try {
    await waitForSignServer();
  } catch (e) {
    console.warn(`[EulerProxy] Warning: ${e.message}`);
    console.warn("[EulerProxy] Starting anyway - sign server may start later");
  }

  server.listen(SIGN_PORT, () => {
    console.log(`[EulerProxy] Local EulerStream proxy running on http://localhost:${SIGN_PORT}`);
    console.log(`[EulerProxy] Set SIGN_API_URL=http://localhost:${SIGN_PORT} in your environment`);
  });
}

start();

process.on("SIGINT", () => {
  console.log("\n[EulerProxy] Shutting down...");
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close();
  process.exit(0);
});
