"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";

interface AlertSettings {
  enabled: boolean;
  sound: boolean;
  volume: number;
  duration: number;
  fontSize: number;
  animation: string;
  threshold: number;
}

interface AlertConfig {
  donation: AlertSettings;
  like: AlertSettings;
}

const defaults: AlertSettings = {
  enabled: true,
  sound: true,
  volume: 70,
  duration: 4,
  fontSize: 36,
  animation: "slide",
  threshold: 1000,
};

const alertTypes = [
  { key: "like" as const, label: "New Likes", labelAr: "\u0625\u0639\u062C\u0627\u0628\u0627\u062A", color: "#ef4444" },
  { key: "donation" as const, label: "Donations", labelAr: "\u062A\u0628\u0631\u0639\u0627\u062A", color: "#10b981" },
];

const IconSvg = ({ name, size = 18, color = "currentColor" }: { name: string; size?: number; color?: string }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "bell":
      return (
        <svg {...props} stroke="#fff">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "like":
      return (
        <svg {...props}>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      );
    case "dollar":
      return (
        <svg {...props}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "play":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "save":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      );
    case "volume":
      return (
        <svg {...props}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "text":
      return (
        <svg {...props}>
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      );
    case "motion":
      return (
        <svg {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...props} stroke="#a51538">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "copy":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    default:
      return null;
  }
};

const Toggle = ({ on, color, onClick }: { on: boolean; color: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: 40,
      height: 22,
      background: on ? color : "#333",
      border: "none",
      borderRadius: 11,
      cursor: "pointer",
      position: "relative",
      transition: "background 0.25s",
      flexShrink: 0,
      padding: 0,
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        background: "#fff",
        borderRadius: "50%",
        position: "absolute",
        top: 3,
        left: on ? 21 : 3,
        transition: "left 0.25s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    />
  </button>
);

const Slider = ({ value, min, max, color, onChange, suffix = "", step = 1 }: { value: number; min: number; max: number; color: string; onChange: (v: number) => void; suffix?: string; step?: number }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const calcValue = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return value;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    onChange(calcValue(x));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      onChange(calcValue(x));
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [min, max, step, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        ref={trackRef}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        style={{ flex: 1, height: 6, borderRadius: 3, background: "#2a2a2a", position: "relative", cursor: "pointer" }}
      >
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: color, position: "absolute", top: 0, left: 0 }} />
        <div style={{
          position: "absolute",
          left: `calc(${pct}% - 8px)`,
          top: "50%",
          transform: "translateY(-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          border: `3px solid ${color}`,
          boxShadow: `0 0 8px ${color}50`,
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 52, textAlign: "left" as const }}>
        {value.toLocaleString()}{suffix}
      </span>
    </div>
  );
};

const SettingRow = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#161616", borderRadius: 12, ...style }}>
    {children}
  </div>
);

const SettingSlider = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div style={{ padding: "10px 14px", background: "#161616", borderRadius: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ color: "#666", display: "flex" }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", fontFamily: "'Cairo', sans-serif" }}>{label}</span>
    </div>
    {children}
  </div>
);

export default function AlertSettingsPage() {
  const [config, setConfig] = useState<AlertConfig>({
    donation: { ...defaults },
    like: { ...defaults },
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"like" | "donation">("like");
  const [username, setUsername] = useState("");
  const [testingAlert, setTestingAlert] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("alertConfig");
      if (s) setConfig(JSON.parse(s));
    } catch {}
    try {
      const savedUser = localStorage.getItem("toman_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.username) setUsername(u.username);
      }
    } catch {}
    const savedName = localStorage.getItem("username");
    if (savedName && !username) setUsername(savedName);
  }, []);

  const saveConfig = useCallback(() => {
    localStorage.setItem("alertConfig", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [config]);

  const update = useCallback((key: string, field: keyof AlertSettings, value: unknown) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: { ...prev[key as keyof AlertConfig], [field]: value } };
      localStorage.setItem("alertConfig", JSON.stringify(next));
      return next;
    });
  }, []);

  const sendTestAlert = useCallback(async (type: string) => {
    if (!username) return;
    const names = ["Ahmad", "Sara", "Omar", "Layla", "Yusuf", "Noor", "Ali", "Fatima"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const currentSettings = config[type as keyof AlertConfig];
    const testAmount = type === "like"
      ? Math.floor(Math.random() * 5000) + currentSettings.threshold
      : Math.floor(Math.random() * 51) + 5;
    setTestingAlert(type);
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          type,
          alertUsername: randomName,
          message: type === "donation" ? "\u0634\u0643\u0631\u0627\u064B" : "",
          amount: testAmount,
        }),
      });
    } catch {}
    setTimeout(() => setTestingAlert(null), 2000);
  }, [username, config]);

  const current = { ...defaults, ...config[activeTab] };
  const info = alertTypes.find((a) => a.key === activeTab)!;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "32px 24px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #a51538, #d4174e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSvg name="bell" size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>Alerts</h1>
              <p style={{ fontSize: 13, color: "#666", margin: 0, fontWeight: 500 }}>
                {"\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0645\u0628\u0633\u0637\u0629"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => sendTestAlert(activeTab)}
              style={{
                padding: "8px 16px",
                background: info.color,
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              {testingAlert === activeTab ? <IconSvg name="check" size={13} /> : <IconSvg name="play" size={10} />}
              {testingAlert === activeTab ? "\u062A\u0645" : "\u0627\u062E\u062A\u0628\u0631"}
            </button>
            <button
              onClick={saveConfig}
              style={{
                padding: "8px 16px",
                background: saved ? "#10b981" : "#a51538",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Cairo', sans-serif",
                transition: "background 0.3s",
              }}
            >
              {saved ? <IconSvg name="check" size={13} /> : <IconSvg name="save" size={11} />}
              {saved ? "\u062A\u0645" : "\u062D\u0641\u0638"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
          {alertTypes.map((a) => {
            const isActive = activeTab === a.key;
            const isEnabled = config[a.key].enabled;
            return (
              <button
                key={a.key}
                onClick={() => setActiveTab(a.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: isActive ? `${a.color}12` : "#111",
                  border: `1px solid ${isActive ? a.color : "#222"}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isActive ? `${a.color}20` : "#161616",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconSvg name={a.key} size={18} color={isActive ? a.color : "#555"} />
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? "#fff" : "#666", lineHeight: 1.2 }}>
                    {a.labelAr}
                  </div>
                  <div style={{ fontSize: 10, color: isEnabled ? a.color : "#555", fontWeight: 600 }}>
                    {"\u25CF "}{isEnabled ? "\u0645\u0641\u0639\u0651\u0644" : "\u0645\u0639\u0637\u0651\u0644"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Left: Settings */}
          <div style={{ padding: 20, background: "#111", border: "1px solid #222", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <IconSvg name={activeTab} size={18} color={info.color} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Cairo', sans-serif" }}>{info.labelAr}</span>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <SettingRow>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#a3a3a3", fontFamily: "'Cairo', sans-serif" }}>
                  {"\u062A\u0641\u0639\u064A\u0644"}
                </span>
                <Toggle on={current.enabled} color={info.color} onClick={() => update(activeTab, "enabled", !current.enabled)} />
              </SettingRow>

              <SettingRow>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#a3a3a3", fontFamily: "'Cairo', sans-serif" }}>
                  {"\u0627\u0644\u0635\u0648\u062A"}
                </span>
                <Toggle on={current.sound} color={info.color} onClick={() => update(activeTab, "sound", !current.sound)} />
              </SettingRow>

              <SettingSlider icon={<IconSvg name="volume" size={14} />} label={"\u0627\u0644\u0635\u0648\u062A"}>
                <Slider value={current.volume} min={0} max={100} color={info.color} suffix="%" onChange={(v) => update(activeTab, "volume", v)} />
              </SettingSlider>

              <SettingSlider icon={<IconSvg name="clock" size={14} />} label={"\u0627\u0644\u0645\u062F\u0629"}>
                <Slider value={current.duration} min={2} max={10} color={info.color} suffix={" \u062B"} onChange={(v) => update(activeTab, "duration", v)} />
              </SettingSlider>

              <SettingSlider icon={<IconSvg name="text" size={14} />} label={"\u0627\u0644\u0646\u0635"}>
                <Slider value={current.fontSize} min={20} max={64} color={info.color} suffix="px" onChange={(v) => update(activeTab, "fontSize", v)} />
              </SettingSlider>

              {/* Animation selector */}
              <div style={{ padding: "10px 14px", background: "#161616", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "#666", display: "flex" }}><IconSvg name="motion" size={14} /></span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", fontFamily: "'Cairo', sans-serif" }}>
                    {"\u0627\u0644\u062D\u0631\u0643\u0629"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {[
                    { value: "slide", label: "\u0627\u0646\u0632\u0644\u0627\u0642", icon: <IconSvg name="motion" size={14} /> },
                    { value: "bounce", label: "\u0627\u0631\u062A\u062F\u0627\u062F", icon: <IconSvg name="motion" size={14} /> },
                    { value: "fade", label: "\u062A\u0644\u0627\u0634\u064A", icon: <IconSvg name="motion" size={14} /> },
                  ].map((anim) => (
                    <button
                      key={anim.value}
                      onClick={() => update(activeTab, "animation", anim.value)}
                      style={{
                        padding: "8px 4px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        background: current.animation === anim.value ? `${info.color}18` : "#1a1a1a",
                        border: `1px solid ${current.animation === anim.value ? info.color : "#252525"}`,
                        borderRadius: 10,
                        color: current.animation === anim.value ? info.color : "#555",
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {anim.icon}
                      {anim.label}
                    </button>
                  ))}
                </div>
              </div>

              <SettingSlider icon={<IconSvg name="target" size={14} />} label={"\u062D\u062F \u0627\u0644\u0639\u062F\u062F"}>
                <Slider value={current.threshold} min={0} max={10000} step={100} color={info.color} onChange={(v) => update(activeTab, "threshold", v)} />
              </SettingSlider>
            </div>
          </div>

          {/* Right: OBS Setup */}
          <div style={{ padding: 20, background: "#111", border: "1px solid #222", borderRadius: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <IconSvg name="monitor" size={18} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Cairo', sans-serif" }}>OBS</span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: "#666", marginBottom: 4, fontWeight: 500 }}>
                {"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}
              </label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  localStorage.setItem("username", e.target.value);
                }}
                placeholder="@username"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#161616",
                  border: "1px solid #252525",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "'Cairo', sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {username && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#666", marginBottom: 4, fontWeight: 500 }}>
                  {"\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u063A\u0637\u064A\u0629"}
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <code
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      background: "#161616",
                      borderRadius: 8,
                      color: "#a51538",
                      fontSize: 10,
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #252525",
                    }}
                  >
                    {`${window.location.origin}/overlay/alerts?user=${username}`}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/overlay/alerts?user=${username}`)}
                    style={{
                      padding: "8px 10px",
                      background: "#a51538",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconSvg name="copy" size={13} />
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: "auto" }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 8, textAlign: "center", fontWeight: 500 }}>
                {"\u0627\u062E\u062A\u0628\u0631 \u0644\u0644\u062A\u062C\u0631\u064A\u0628"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {alertTypes.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => sendTestAlert(a.key)}
                    disabled={!username}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 10px",
                      background: testingAlert === a.key ? `${a.color}18` : "#161616",
                      border: `1px solid ${testingAlert === a.key ? a.color : "#252525"}`,
                      borderRadius: 10,
                      color: username ? "#fff" : "#555",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: username ? "pointer" : "not-allowed",
                      fontFamily: "'Cairo', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >
                    <IconSvg name={a.key} size={16} color={a.color} />
                    {a.labelAr}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
