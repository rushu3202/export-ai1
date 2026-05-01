"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/export-check", {
        method: "POST",
        body: JSON.stringify({
          product,
          cost: Number(cost),
          shipping: Number(shipping),
        }),
      });

      const data = await res.json();
      setResult(data);

      // ✅ INSERT INTO SUPABASE (SAFE)
      const { data: inserted, error } = await supabase
        .from("reports")
        .insert([
          {
            product,
            cost: Number(cost),
            shipping: Number(shipping),
            profit: parseFloat(data.profit),
            roi: data.roi,
          },
        ])
        .select();

      if (error) {
        console.error("❌ INSERT ERROR:", error);
      } else {
        console.log("✅ INSERT SUCCESS:", inserted);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🚀 Export AI Agent</h1>

      {/* NAV BUTTON */}
      <button
        onClick={() => (window.location.href = "/reports")}
        style={{
          marginBottom: 20,
          padding: 10,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        📊 View Reports History
      </button>

      {/* INPUTS */}
      <input
        placeholder="Product"
        onChange={(e) => setProduct(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Cost (£)"
        onChange={(e) => setCost(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Shipping (£)"
        onChange={(e) => setShipping(e.target.value)}
      />
      <br /><br />

      <button onClick={runAnalysis}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>📊 Result</h3>

          <p>Product: {result.product}</p>
          <p>Country: {result.country}</p>
          <p>Status: {result.allowed ? "Allowed" : "Restricted"}</p>
          <p>HS Code: {result.hs_code}</p>

          <h4>💰 Profit</h4>
          <p>Profit: £{result.profit}</p>
          <p>ROI: {result.roi}</p>

          <h4>📄 Documents</h4>
          <ul>
            {result.documents.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}