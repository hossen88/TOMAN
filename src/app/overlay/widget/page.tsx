"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function WidgetPage() {
  const [health, setHealth] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;

    const eventSource = new EventSource(`/api/stream?user=${username}`);

    eventSource.onopen = () => setConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.connected) return;
        setHealth(data);
      } catch (e) {}
    };

    eventSource.onerror = () => {
      setConnected(false);
      setTimeout(() => window.location.reload(), 3000);
    };

    return () => eventSource.close();
  }, []);

  if (!connected || !health) {
    return (
      <div style={{ padding: "16px", fontFamily: "'Segoe UI', sans-serif", background: "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#111", borderRadius: "10px", border: "1px solid #333" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
          <span style={{ color: "#888", fontSize: "13px" }}>Waiting for data...</span>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    good: "#4ade80",
    warning: "#f59e0b",
    critical: "#ef4444",
  };

  const statusLabels: Record<string, string> = {
    good: "HEALTHY",
    warning: "WARNING",
    critical: "CRITICAL",
  };

  return (
    <div style={{ padding: "12px", fontFamily: "'Segoe UI', sans-serif", background: "transparent" }}>
      <div style={{
        padding: "14px 18px",
        background: "#0a0a0aee",
        border: `2px solid ${statusColors[health.status]}`,
        borderRadius: "12px",
        boxShadow: `0 0 15px ${statusColors[health.status]}20`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: statusColors[health.status],
              animation: health.status === "critical" ? "blink 0.5s infinite" : "none",
            }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: statusColors[health.status] }}>
              {statusLabels[health.status]}
            </span>
          </div>
          <span style={{ fontSize: "10px", color: "#666" }}>{health.source || "Unknown"}</span>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
          {[
            { label: "Bit", value: `${Math.round(health.bitrate)}`, color: health.bitrate < 2500 ? "#f59e0b" : "#4ade80" },
            { label: "FPS", value: `${Math.round(health.fps)}`, color: health.fps < 50 ? "#f59e0b" : "#4ade80" },
            { label: "CPU", value: `${Math.round(health.cpuUsage)}%`, color: health.cpuUsage > 70 ? "#ef4444" : "#4ade80" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: "6px", background: "#111", borderRadius: "6px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "9px", color: "#666" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Issues */}
        {health.issues && health.issues.length > 0 && (
          <div style={{ marginTop: "8px", padding: "8px", background: health.status === "critical" ? "#ef444415" : "#f59e0b15", borderRadius: "6px" }}>
            {health.issues.slice(0, 2).map((issue: any, i: number) => (
              <div key={i} style={{ fontSize: "11px", color: issue.severity === "critical" ? "#ef4444" : "#f59e0b", marginBottom: "2px" }}>
                ⚠️ {issue.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
