import { NextRequest, NextResponse } from "next/server";

const monitorData = new Map<string, any>();
const monitorSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, bitrate, fps, droppedFrames, cpuUsage, memoryUsage, latency } = body;

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const data = {
    username,
    bitrate: bitrate || 0,
    fps: fps || 0,
    droppedFrames: droppedFrames || 0,
    cpuUsage: cpuUsage || 0,
    memoryUsage: memoryUsage || 0,
    latency: latency || 0,
    timestamp: Date.now(),
  };

  monitorData.set(username, data);

  const issues: any[] = [];
  const now = Date.now();

  if (data.bitrate > 0 && data.bitrate < 2500) {
    issues.push({
      type: "bitrate",
      severity: data.bitrate < 1500 ? "critical" : "warning",
      message: `Low Bitrate: ${Math.round(data.bitrate)} kbps`,
      suggestion: "Lower your output resolution or increase bitrate in OBS settings",
      timestamp: now,
    });
  }

  if (data.fps > 0 && data.fps < 50) {
    issues.push({
      type: "fps",
      severity: data.fps < 30 ? "critical" : "warning",
      message: `Low FPS: ${Math.round(data.fps)}`,
      suggestion: "Close unnecessary programs or reduce game quality",
      timestamp: now,
    });
  }

  if (data.droppedFrames > 3) {
    issues.push({
      type: "frames",
      severity: data.droppedFrames > 10 ? "critical" : "warning",
      message: `Dropped Frames: ${data.droppedFrames}`,
      suggestion: "Check your internet connection or lower stream quality",
      timestamp: now,
    });
  }

  if (data.cpuUsage > 70) {
    issues.push({
      type: "cpu",
      severity: data.cpuUsage > 85 ? "critical" : "warning",
      message: `High CPU: ${Math.round(data.cpuUsage)}%`,
      suggestion: "Close background apps or use hardware encoding (NVENC/AMF)",
      timestamp: now,
    });
  }

  if (data.memoryUsage > 80) {
    issues.push({
      type: "memory",
      severity: data.memoryUsage > 90 ? "critical" : "warning",
      message: `High Memory: ${Math.round(data.memoryUsage)}%`,
      suggestion: "Close unused applications to free up RAM",
      timestamp: now,
    });
  }

  if (data.latency > 50) {
    issues.push({
      type: "connection",
      severity: data.latency > 100 ? "critical" : "warning",
      message: `High Latency: ${Math.round(data.latency)}ms`,
      suggestion: "Use a wired connection instead of WiFi",
      timestamp: now,
    });
  }

  const status = issues.some((i) => i.severity === "critical")
    ? "critical"
    : issues.length > 0
      ? "warning"
      : "good";

  const result = {
    status,
    ...data,
    issues,
  };

  const subs = monitorSubscribers.get(username);
  if (subs) {
    const sseData = `data: ${JSON.stringify(result)}\n\n`;
    for (const controller of subs) {
      try {
        controller.enqueue(new TextEncoder().encode(sseData));
      } catch (e) {
        subs.delete(controller);
      }
    }
  }

  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) {
    return NextResponse.json({ error: "User required" }, { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("data: {\"connected\": true}\n\n"));

      if (!monitorSubscribers.has(username)) monitorSubscribers.set(username, new Set());
      monitorSubscribers.get(username)!.add(controller);

      const existingData = monitorData.get(username);
      if (existingData) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(existingData)}\n\n`));
      }

      request.signal.addEventListener("abort", () => {
        monitorSubscribers.get(username)?.delete(controller);
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
