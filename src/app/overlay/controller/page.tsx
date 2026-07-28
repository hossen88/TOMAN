"use client";

import { useEffect, useState } from "react";

const widgetPaths: Record<string, string> = {
  followers: "/overlay/widgets/followers",
  likes: "/overlay/widgets/likes",
  "top-rankers": "/overlay/widgets/top-rankers",
  "total-followers": "/overlay/widgets/total-followers",
};

export default function OverlayController() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/widgets/state");
        const data = await res.json();
        setActive(data);
      } catch (e) {}
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const color = params.get("color") || "#a855f7";
  const user = params.get("user") || "";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "transparent", position: "relative", overflow: "hidden" }}>
      {Object.entries(active).map(([id, isActive]) => {
        if (!isActive) return null;
        const path = widgetPaths[id];
        if (!path) return null;
        return (
          <iframe
            key={id}
            src={`${path}?user=${user}&color=${encodeURIComponent(color)}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        );
      })}
    </div>
  );
}
