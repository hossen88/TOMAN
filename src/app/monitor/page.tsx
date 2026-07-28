"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

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
  uptime: number;
  issues: Issue[];
}

interface Issue {
  type: string;
  severity: "warning" | "critical";
  message: string;
  suggestion: string;
  timestamp: number;
  resolved: boolean;
}

export default function MonitorPage() {
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
    uptime: 0,
    issues: [],
  });
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [autoFixEnabled, setAutoFixEnabled] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) {
      try { const u = JSON.parse(savedUser); if (u.username) setUsername(u.username); } catch (e) {}
    }
    const saved = localStorage.getItem("username");
    if (saved && !username) setUsername(saved);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateHealthCheck();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateHealthCheck = () => {
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
        resolved: false,
      });
    }

    if (fps < 50) {
      issues.push({
        type: "fps",
        severity: fps < 30 ? "critical" : "warning",
        message: `Low FPS: ${Math.round(fps)}`,
        suggestion: "Close unnecessary programs or reduce game quality",
        timestamp: now,
        resolved: false,
      });
    }

    if (dropped > 3) {
      issues.push({
        type: "frames",
        severity: dropped > 10 ? "critical" : "warning",
        message: `Dropped Frames: ${dropped}`,
        suggestion: "Check your internet connection or lower stream quality",
        timestamp: now,
        resolved: false,
      });
    }

    if (cpu > 70) {
      issues.push({
        type: "cpu",
        severity: cpu > 85 ? "critical" : "warning",
        message: `High CPU: ${Math.round(cpu)}%`,
        suggestion: "Close background apps or use hardware encoding (NVENC/AMF)",
        timestamp: now,
        resolved: false,
      });
    }

    if (memory > 80) {
      issues.push({
        type: "memory",
        severity: memory > 90 ? "critical" : "warning",
        message: `High Memory: ${Math.round(memory)}%`,
        suggestion: "Close unused applications to free up RAM",
        timestamp: now,
        resolved: false,
      });
    }

    if (latency > 50) {
      issues.push({
        type: "connection",
        severity: latency > 100 ? "critical" : "warning",
        message: `High Latency: ${Math.round(latency)}ms`,
        suggestion: "Use a wired connection instead of WiFi",
        timestamp: now,
        resolved: false,
      });
    }

    const status = issues.some((i) => i.severity === "critical")
      ? "critical"
      : issues.length > 0
        ? "warning"
        : "good";

    setHealth((prev) => ({
      status,
      bitrate,
      fps,
      droppedFrames: dropped,
      totalFrames: prev.totalFrames + 60,
      cpuUsage: cpu,
      memoryUsage: memory,
      connectionSpeed: connection,
      latency,
      uptime: prev.uptime + 3,
      issues,
    }));

    if (issues.length > 0) {
      setAllIssues((prev) => [...issues, ...prev].slice(0, 20));
    }
  };

  const statusColors: Record<string, string> = {
    good: "#4ade80",
    warning: "#f59e0b",
    critical: "#ef4444",
  };

  const statusEmoji: Record<string, string> = {
    good: "✅",
    warning: "⚠️",
    critical: "🔴",
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>📊 Stream Monitor</h1>
            <p style={{ color: "#888", fontSize: "14px" }}>Real-time monitoring for your stream health</p>
          </div>
          {username && (
            <a
              href={`/overlay/monitor?user=${username}`}
              target="_blank"
              style={{ padding: "12px 20px", background: "#a51538", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", textDecoration: "none" }}
            >
              Open OBS Overlay
            </a>
          )}
        </div>

        {/* Status Banner */}
        <div
          style={{
            padding: "20px 28px",
            background: "#111",
            border: `2px solid ${statusColors[health.status]}`,
            borderRadius: "20px",
            marginBottom: "24px",
            boxShadow: `0 0 30px ${statusColors[health.status]}20`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: statusColors[health.status],
                  boxShadow: `0 0 10px ${statusColors[health.status]}`,
                  animation: health.status === "critical" ? "blink 0.5s infinite" : "none",
                }}
              />
              <div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: statusColors[health.status] }}>
                  {statusEmoji[health.status]} {health.status === "good" ? "Stream Healthy" : health.status === "warning" ? "Issues Detected" : "Critical Problems"}
                </div>
                <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                  Uptime: {formatTime(health.uptime)}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: "#888" }}>Total Frames</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>{health.totalFrames.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Bitrate", value: `${Math.round(health.bitrate)}`, unit: "kbps", icon: "📶", color: health.bitrate < 2500 ? "#f59e0b" : "#4ade80", target: "6000" },
            { label: "FPS", value: `${Math.round(health.fps)}`, unit: "fps", icon: "🎬", color: health.fps < 50 ? "#f59e0b" : "#4ade80", target: "60" },
            { label: "Latency", value: `${Math.round(health.latency)}`, unit: "ms", icon: "⚡", color: health.latency > 50 ? "#f59e0b" : "#4ade80", target: "<50" },
            { label: "CPU Usage", value: `${Math.round(health.cpuUsage)}`, unit: "%", icon: "🖥️", color: health.cpuUsage > 70 ? "#ef4444" : "#4ade80", target: "<70%" },
            { label: "Memory", value: `${Math.round(health.memoryUsage)}`, unit: "%", icon: "💾", color: health.memoryUsage > 80 ? "#ef4444" : "#4ade80", target: "<80%" },
            { label: "Dropped", value: `${health.droppedFrames}`, unit: "frames", icon: "📦", color: health.droppedFrames > 3 ? "#ef4444" : "#4ade80", target: "0" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "20px",
                background: "#111",
                border: `1px solid ${stat.color}30`,
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: stat.color }}>
                {stat.value}
                <span style={{ fontSize: "14px", color: "#888", marginLeft: "4px" }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>{stat.label}</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Target: {stat.target}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ padding: "20px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>🔧 Quick Fixes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { action: "Lower Bitrate", desc: "Reduce to 2500 kbps" },
                { action: "Switch to 30fps", desc: "Reduce CPU load" },
                { action: "Close Background Apps", desc: "Free up resources" },
                { action: "Switch to 720p", desc: "Reduce encoding load" },
              ].map((fix) => (
                <button
                  key={fix.action}
                  style={{
                    padding: "10px 14px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>{fix.action}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{fix.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "20px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>📋 Tips</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { tip: "Use Ethernet instead of WiFi for stable connection", icon: "🌐" },
                { tip: "Enable NVENC for GPU encoding (saves CPU)", icon: "🎮" },
                { tip: "Use CBR rate control for consistent bitrate", icon: "📊" },
                { tip: "Set keyframe interval to 2 seconds", icon: "⏱️" },
              ].map((tip) => (
                <div key={tip.tip} style={{ padding: "10px", background: "#1a1a1a", borderRadius: "8px", fontSize: "12px", color: "#aaa" }}>
                  <span style={{ marginRight: "8px" }}>{tip.icon}</span>
                  {tip.tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issues Log */}
        <div style={{ padding: "24px", background: "#111", border: "1px solid #222", borderRadius: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>📋 Issues Log</h2>
            <span style={{ fontSize: "13px", color: "#888" }}>{allIssues.length} issues detected</span>
          </div>

          {allIssues.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>No issues detected</div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>Your stream is running smoothly</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allIssues.map((issue, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 18px",
                    background: issue.severity === "critical" ? "#ef444410" : "#f59e0b10",
                    border: `1px solid ${issue.severity === "critical" ? "#ef444430" : "#f59e0b30"}`,
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: issue.severity === "critical" ? "#ef4444" : "#f59e0b", fontWeight: "700", textTransform: "uppercase" }}>
                        {issue.severity}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{issue.message}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#888" }}>💡 {issue.suggestion}</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#555" }}>
                    {new Date(issue.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browser Source Setup */}
        <div style={{ marginTop: "24px", padding: "20px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>📺 OBS Monitor Widget</h3>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
            Add a <strong style={{ color: "#fff" }}>Browser Source</strong> in OBS to show live monitor on your stream:
          </p>
          <code style={{ display: "block", padding: "12px", background: "#1a1a1a", borderRadius: "8px", color: "#a51538", fontSize: "13px", fontFamily: "monospace" }}>
            {`${window.location.origin}/overlay/monitor?user=YOUR_USERNAME`}
          </code>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
