"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import ExportForm from "@/components/ExportForm";
import ResultCard from "@/components/ResultCard";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div style={{ padding: 30, color: "white", background: "#0B1220", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📊 Export AI Dashboard</h2>
        <UserButton />
      </div>

      {/* FORM */}
      <ExportForm onResult={setResult} />

      {/* RESULT */}
      <ResultCard result={result} />
    </div>
  );
}