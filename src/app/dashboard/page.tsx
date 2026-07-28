"use client";

import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #333", borderTopColor: "#a51538", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
