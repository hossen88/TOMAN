"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

const streamingApps = [
  {
    id: "obs",
    name: "OBS Studio",
    icon: "🎥",
    color: "#301E38",
    description: "Most popular free streaming software",
    methods: [
      { name: "obs-websocket", desc: "Built-in WebSocket plugin" },
      { name: "Script", desc: "Python/Lua script to send data" },
    ],
  },
  {
    id: "streamlabs",
    name: "Streamlabs Desktop",
    icon: "🟢",
    color: "#80FF00",
    description: "All-in-one streaming app",
    methods: [
      { name: "API", desc: "Built-in API support" },
      { name: "Script", desc: "Custom script integration" },
    ],
  },
  {
    id: "xsplit",
    name: "XSplit",
    icon: "🎬",
    color: "#6179FF",
    description: "Professional streaming software",
    methods: [
      { name: "Plugin", desc: "XSplit plugin support" },
      { name: "Webhook", desc: "HTTP webhook integration" },
    ],
  },
  {
    id: "vmix",
    name: "vMix",
    icon: "📺",
    color: "#FF6600",
    description: "Professional video mixing software",
    methods: [
      { name: "API", desc: "vMix HTTP API" },
      { name: "Function", desc: "vMix Function calls" },
    ],
  },
  {
    id: "wirecast",
    name: "Wirecast",
    icon: "📡",
    color: "#0066FF",
    description: "Professional live streaming production",
    methods: [
      { name: "Script", desc: "Lua scripting support" },
    ],
  },
  {
    id: "custom",
    name: "Custom App",
    icon: "🔧",
    color: "#a51538",
    description: "Any other streaming application",
    methods: [
      { name: "REST API", desc: "Simple HTTP POST requests" },
      { name: "Webhook", desc: "Send data via webhook" },
    ],
  },
];

export default function StreamingAppsPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) { try { const u = JSON.parse(savedUser); if (u.username) setUsername(u.username); } catch (e) {} }
    const saved = localStorage.getItem("username");
    if (saved && !username) setUsername(saved);
    const savedApp = localStorage.getItem("selectedStreamingApp");
    if (savedApp) setSelectedApp(savedApp);
  }, []);

  const updateUsername = (v: string) => {
    setUsername(v);
    localStorage.setItem("username", v);
  };

  const updateApp = (id: string | null) => {
    setSelectedApp(id);
    if (id) localStorage.setItem("selectedStreamingApp", id);
    else localStorage.removeItem("selectedStreamingApp");
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const selected = streamingApps.find((a) => a.id === selectedApp);

  const getEmbedCode = () => {
    return `<iframe src="${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}" width="350" height="400" frameborder="0" style="background: transparent;"></iframe>`;
  };

  const getAPICode = (app: string) => {
    const base = `curl -X POST ${baseUrl}/api/stream`;
    const body = `{"username": "${username || 'YOUR_USERNAME'}", "source": "${app}", "bitrate": 3000, "fps": 60, "droppedFrames": 0, "cpuUsage": 25, "memoryUsage": 45, "latency": 20}`;
    return `${base} -H "Content-Type: application/json" -d '${body}'`;
  };

  const getOBSConfig = () => {
    return `# OBS WebSocket Config
Host: localhost
Port: 4455
Password: (your password)

# Or use this URL in OBS Browser Source:
    ${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`;
  };

  const getStreamlabsConfig = () => {
    return `# Streamlabs Desktop
1. Go to Settings > API Settings
2. Enable "Local API"
3. Set Endpoint: ${baseUrl}/api/stream
4. Set Username: ${username || 'YOUR_USERNAME'}

# Or use Browser Source:
${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`;
  };

  const getXSplitConfig = () => {
    return `# XSplit Configuration
1. Go to Tools > Scripting
2. Add new script
3. Use this API endpoint:
    POST ${baseUrl}/api/stream
    
# Or use Browser Source:
${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`;
  };

  const getVMixConfig = () => {
    return `# vMix Configuration
1. Go to Settings > API
2. Enable HTTP API
3. Use this endpoint:
    POST ${baseUrl}/api/stream

# Or use Web Browser Input:
${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`;
  };

  const getGenericConfig = () => {
    return `# Universal API
POST ${baseUrl}/api/stream
Content-Type: application/json

{
  "username": "${username || 'YOUR_USERNAME'}",
  "source": "your_app_name",
  "bitrate": 3000,
  "fps": 60,
  "droppedFrames": 0,
  "cpuUsage": 25,
  "memoryUsage": 45,
  "latency": 20,
  "resolution": "1920x1080",
  "encoder": "x264",
  "audioBitrate": 160
}

# Or use Browser Source:
${baseUrl}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`;
  };

  const getConfigForApp = (appId: string) => {
    switch (appId) {
      case "obs": return getOBSConfig();
      case "streamlabs": return getStreamlabsConfig();
      case "xsplit": return getXSplitConfig();
      case "vmix": return getVMixConfig();
      default: return getGenericConfig();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>📡 Streaming Apps</h1>
        <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>Connect your streaming software to TOMAN Monitor</p>

        {/* Username Input */}
        <div style={{ marginBottom: "32px", padding: "20px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>Your Username</label>
          <input
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
            placeholder="e.g. _00DV"
            style={{ width: "100%", padding: "14px 18px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none", fontFamily: "inherit" }}
          />
        </div>

        {/* Apps Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {streamingApps.map((app) => (
            <div
              key={app.id}
              onClick={() => updateApp(selectedApp === app.id ? null : app.id)}
              style={{
                padding: "24px",
                background: selectedApp === app.id ? `${app.color}15` : "#111",
                border: `2px solid ${selectedApp === app.id ? app.color : "#222"}`,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                <span style={{ fontSize: "36px" }}>{app.icon}</span>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>{app.name}</h3>
                  <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>{app.description}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {app.methods.map((m) => (
                  <span key={m.name} style={{ padding: "4px 10px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", fontSize: "12px", color: "#aaa" }}>
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected App Config */}
        {selected && (
          <div style={{ padding: "28px", background: "#111", border: `2px solid ${selected.color}`, borderRadius: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "32px" }}>{selected.icon}</span>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff" }}>{selected.name} Setup</h2>
            </div>

            {/* Config Code */}
            <div style={{ position: "relative" }}>
              <pre style={{ padding: "20px", background: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", color: "#4ade80", fontSize: "13px", fontFamily: "monospace", overflow: "auto", whiteSpace: "pre-wrap" }}>
                {getConfigForApp(selected.id)}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getConfigForApp(selected.id));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ position: "absolute", top: "12px", right: "12px", padding: "8px 16px", background: selected.color, border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>

            {/* Browser Source */}
            <div style={{ marginTop: "20px", padding: "16px", background: "#0a0a0a", border: "1px solid #222", borderRadius: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>📺 Browser Source (Works Everywhere)</h4>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
                Add this as a Browser Source in any streaming software:
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  readOnly
                  value={`${window.location.origin}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`}
                  style={{ flex: 1, padding: "10px 14px", background: "#111", border: "1px solid #333", borderRadius: "8px", color: selected.color, fontSize: "13px", fontFamily: "monospace" }}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/overlay/monitor?user=${username || 'YOUR_USERNAME'}`)}
                  style={{ padding: "10px 16px", background: selected.color, border: "none", borderRadius: "8px", color: "#fff", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Universal API Section */}
        <div style={{ padding: "28px", background: "#111", border: "1px solid #222", borderRadius: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>🔌 Universal API</h2>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>
            Use this API with any streaming software that supports HTTP requests:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {/* POST Endpoint */}
            <div style={{ padding: "16px", background: "#1a1a1a", borderRadius: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80", marginBottom: "8px" }}>POST Endpoint</h4>
              <code style={{ display: "block", padding: "10px", background: "#0a0a0a", borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "monospace" }}>
                http://localhost:3000/api/stream
              </code>
            </div>

            {/* GET Stream */}
            <div style={{ padding: "16px", background: "#1a1a1a", borderRadius: "12px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#f59e0b", marginBottom: "8px" }}>GET Stream (SSE)</h4>
              <code style={{ display: "block", padding: "10px", background: "#0a0a0a", borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "monospace" }}>
                http://localhost:3000/api/stream?user=USERNAME
              </code>
            </div>
          </div>

          {/* Example Request */}
          <div style={{ marginTop: "20px", padding: "16px", background: "#1a1a1a", borderRadius: "12px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Example Request</h4>
            <pre style={{ padding: "12px", background: "#0a0a0a", borderRadius: "8px", color: "#a51538", fontSize: "12px", fontFamily: "monospace", overflow: "auto" }}>
{`curl -X POST http://localhost:3000/api/stream \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "${username || 'YOUR_USERNAME'}",
    "source": "my_app",
    "bitrate": 3000,
    "fps": 60,
    "droppedFrames": 0,
    "cpuUsage": 25,
    "memoryUsage": 45,
    "latency": 20
  }'`}
            </pre>
          </div>

          {/* All Supported Fields */}
          <div style={{ marginTop: "20px", padding: "16px", background: "#1a1a1a", borderRadius: "12px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Supported Fields</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
              {[
                { field: "username", type: "string", required: true },
                { field: "source", type: "string", required: false },
                { field: "bitrate", type: "number", required: false },
                { field: "fps", type: "number", required: false },
                { field: "droppedFrames", type: "number", required: false },
                { field: "cpuUsage", type: "number", required: false },
                { field: "memoryUsage", type: "number", required: false },
                { field: "latency", type: "number", required: false },
                { field: "resolution", type: "string", required: false },
                { field: "encoder", type: "string", required: false },
                { field: "audioBitrate", type: "number", required: false },
              ].map((f) => (
                <div key={f.field} style={{ padding: "8px", background: "#0a0a0a", borderRadius: "6px", fontSize: "12px" }}>
                  <code style={{ color: f.required ? "#ef4444" : "#4ade80" }}>{f.field}</code>
                  <span style={{ color: "#666", marginLeft: "8px" }}>{f.type}</span>
                  {f.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
