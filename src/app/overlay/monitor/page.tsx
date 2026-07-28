"use client";

import { useEffect, useState, useRef } from "react";

interface StreamHealth {
  status: "good" | "warning" | "critical";
  bitrate: number;
  fps: number;
  droppedFrames: number;
  totalFrames: number;
  cpuUsage: number;
  memoryUsage: number;
  connectionSpeed: number;
  latency: number;
  issues: Issue[];
}

interface Issue {
  type: "bitrate" | "fps" | "frames" | "connection" | "cpu" | "memory";
  severity: "warning" | "critical";
  message: string;
  suggestion: string;
  timestamp: number;
}

export default function MonitorOverlay() {
  const [health, setHealth] = useState<StreamHealth>({
    status: "good",
    bitrate: 3000,
    fps: 60,
    droppedFrames: 0,
    totalFrames: 0,
    cpuUsage: 15,
    memoryUsage: 45,
    connectionSpeed: 100,
    latency: 20,
    issues: [],
  });
  const [recentAlerts, setRecentAlerts] = useState<Issue[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;

    const interval = setInterval(() => {
      simulateMonitor(username);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const simulateMonitor = (username: string) => {
    const bitrate = 2500 + Math.random() * 1500;
    const fps = 55 + Math.random() * 10;
    const dropped = Math.floor(Math.random() * 5);
    const cpu = 20 + Math.random() * 40;
    const memory = 40 + Math.random() * 30;
    const latency = 15 + Math.random() * 30;
    const connection = 80 + Math.random() * 40;

    const issues: Issue[] = [];
    const now = Date.now();

    if (bitrate < 2500) {
      issues.push({
        type: "bitrate",
        severity: bitrate < 1500 ? "critical" : "warning",
        message: `Low Bitrate: ${Math.round(bitrate)} kbps`,
        suggestion: "Lower your output resolution or increase bitrate in OBS settings",
        timestamp: now,
      });
    }

    if (fps < 50) {
      issues.push({
        type: "fps",
        severity: fps < 30 ? "critical" : "warning",
        message: `Low FPS: ${Math.round(fps)}`,
        suggestion: "Close unnecessary programs or reduce game quality",
        timestamp: now,
      });
    }

    if (dropped > 3) {
      issues.push({
        type: "frames",
        severity: dropped > 10 ? "critical" : "warning",
        message: `Dropped Frames: ${dropped}`,
        suggestion: "Check your internet connection or lower stream quality",
        timestamp: now,
      });
    }

    if (cpu > 70) {
      issues.push({
        type: "cpu",
        severity: cpu > 85 ? "critical" : "warning",
        message: `High CPU: ${Math.round(cpu)}%`,
        suggestion: "Close background apps or use hardware encoding (NVENC/AMF)",
        timestamp: now,
      });
    }

    if (memory > 80) {
      issues.push({
        type: "memory",
        severity: memory > 90 ? "critical" : "warning",
        message: `High Memory: ${Math.round(memory)}%`,
        suggestion: "Close unused applications to free up RAM",
        timestamp: now,
      });
    }

    if (latency > 50) {
      issues.push({
        type: "connection",
        severity: latency > 100 ? "critical" : "warning",
        message: `High Latency: ${Math.round(latency)}ms`,
        suggestion: "Use a wired connection instead of WiFi",
        timestamp: now,
      });
    }

    const status = issues.some((i) => i.severity === "critical")
      ? "critical"
      : issues.length > 0
        ? "warning"
        : "good";

    setHealth({
      status,
      bitrate,
      fps,
      droppedFrames: dropped,
      totalFrames: Math.floor(Math.random() * 100000),
      cpuUsage: cpu,
      memoryUsage: memory,
      connectionSpeed: connection,
      latency,
      issues,
    });

    if (issues.length > 0) {
      setRecentAlerts((prev) => [...issues, ...prev].slice(0, 5));
    }
  };

  const statusColors = {
    good: "#4ade80",
    warning: "#f59e0b",
    critical: "#ef4444",
  };

  const statusLabels = {
    good: "HEALTHY",
    warning: "WARNING",
    critical: "CRITICAL",
  };

  return (
    <div style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif", padding: "16px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "12px 16px",
          background: "#0a0a0aee",
          border: `2px solid ${statusColors[health.status]}`,
          borderRadius: "14px",
          boxShadow: `0 0 20px ${statusColors[health.status]}30`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: statusColors[health.status],
              animation: health.status === "critical" ? "blink 0.5s infinite" : "none",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "700", color: statusColors[health.status] }}>
            {statusLabels[health.status]}
          </span>
        </div>
        <span style={{ fontSize: "12px", color: "#888" }}>Stream Monitor</span>
      </div>

      {!isMinimized && (
        <>
          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
            {[
              { label: "Bitrate", value: `${Math.round(health.bitrate)}`, unit: "kbps", color: health.bitrate < 2500 ? "#f59e0b" : "#4ade80" },
              { label: "FPS", value: `${Math.round(health.fps)}`, unit: "", color: health.fps < 50 ? "#f59e0b" : "#4ade80" },
              { label: "Latency", value: `${Math.round(health.latency)}`, unit: "ms", color: health.latency > 50 ? "#f59e0b" : "#4ade80" },
              { label: "CPU", value: `${Math.round(health.cpuUsage)}`, unit: "%", color: health.cpuUsage > 70 ? "#ef4444" : "#4ade80" },
              { label: "RAM", value: `${Math.round(health.memoryUsage)}`, unit: "%", color: health.memoryUsage > 80 ? "#ef4444" : "#4ade80" },
              { label: "Dropped", value: `${health.droppedFrames}`, unit: "", color: health.droppedFrames > 3 ? "#ef4444" : "#4ade80" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "10px",
                  background: "#111111ee",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "800", color: stat.color }}>
                  {stat.value}
                  <span style={{ fontSize: "10px", color: "#888", marginLeft: "2px" }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Issues */}
          {health.issues.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {health.issues.slice(0, 3).map((issue, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    background: issue.severity === "critical" ? "#ef444420" : "#f59e0b20",
                    border: `1px solid ${issue.severity === "critical" ? "#ef4444" : "#f59e0b"}`,
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ color: issue.severity === "critical" ? "#ef4444" : "#f59e0b", fontWeight: "700" }}>
                    {issue.message}
                  </div>
                  <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>
                    💡 {issue.suggestion}
                  </div>
                </div>
              ))}
            </div>
          )}

          {health.issues.length === 0 && (
            <div style={{ padding: "12px", background: "#4ade8010", border: "1px solid #4ade8030", borderRadius: "10px", textAlign: "center" }}>
              <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "600" }}>
                ✅ All systems operating normally
              </span>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
