import { NextRequest } from "next/server";

const widgetState = new Map<string, boolean>();
const demoState = new Map<string, { active: boolean; expiresAt: number }>();

export async function GET(request: NextRequest) {
  const widget = request.nextUrl.searchParams.get("widget");
  if (!widget) {
    const all: Record<string, boolean> = {};
    widgetState.forEach((v, k) => { all[k] = v; });
    return Response.json(all);
  }
  const demo = demoState.get(widget);
  const isDemo = demo?.active && Date.now() < demo.expiresAt;
  if (demo && demo.active && Date.now() >= demo.expiresAt) {
    demo.active = false;
  }
  return Response.json({ active: widgetState.get(widget) || false, demo: isDemo });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { widget, active, demo, duration } = body;
  if (!widget) return Response.json({ error: "widget required" }, { status: 400 });
  if (active !== undefined) widgetState.set(widget, !!active);
  if (demo === true) {
    const dur = (typeof duration === "number" && duration > 0) ? duration : 10;
    demoState.set(widget, { active: true, expiresAt: Date.now() + dur * 1000 });
  } else if (demo === false) {
    const existing = demoState.get(widget);
    if (existing) existing.active = false;
  }
  return Response.json({ ok: true });
}
