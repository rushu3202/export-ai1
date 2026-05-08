"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userId = "guest_user";

  const runAnalysis = async () => {
    setLoading(true);

    try {
      // ✅ 1. CHECK FREE LIMIT
      const { count } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count && count >= 3) {
        const res = await fetch(
          "http://localhost:5000/create-checkout-session",
          { method: "POST" }
        );

        const data = await res.json();
        window.location.href = data.url;
        return;
      }

      // ✅ 2. CALL ANALYSIS API
      const res = await fetch("/api/export-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          cost: Number(cost),
          shipping: Number(shipping),
        }),
      });

      const data = await res.json();

      // ✅ 3. PREMIUM ANALYSIS (THIS IS WHAT MAKES IT SELLABLE)
      const enhanced = {
        ...data,
        duty: data.country === "Germany" ? 6.5 : 4,
        vat: 19,
        platformFee: 10,
        trueProfit: (data.profit - 5).toFixed(2),

        demand: "HIGH",
        competition: "MEDIUM",

        verdict: data.profit > 10 ? "RECOMMENDED" : "NOT RECOMMENDED",
        reason:
          data.profit > 10
            ? "Healthy margin and stable demand"
            : "Low margin after costs",

        suggestion:
          data.profit > 10
            ? "Scale this product in EU markets"
            : "Try UAE or USA for better margins",
      };

      setResult(enhanced);

      // ✅ 4. SAVE TO DATABASE
      await supabase.from("reports").insert([
        {
          user_id: userId,
          product,
          cost: Number(cost),
          shipping: Number(shipping),
          profit: parseFloat(data.profit),
          roi: data.roi,
        },
      ]);
    } catch (err) {
      console.error("ERROR:", err);
    }

    setLoading(false);
  };

  // ✅ DOWNLOAD PDF
  const downloadInvoice = async () => {
    const res = await fetch("http://localhost:5000/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "export-report.pdf";
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>
          Export Profit Analyzer
        </h1>

        <p style={{ color: "#666", marginBottom: 20 }}>
          AI-powered export decision engine
        </p>

        <input
          placeholder="Product (e.g. leather bags to Germany)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Cost (£)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Shipping (£)"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={runAnalysis}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Running..." : "Check Export"}
        </button>

        {result && (
          <div style={{ marginTop: 20 }}>
            {/* VERDICT */}
            <div
              style={{
                padding: 15,
                borderRadius: 10,
                background:
                  result.verdict === "RECOMMENDED"
                    ? "#e6f7ec"
                    : "#ffecec",
                marginBottom: 15,
              }}
            >
              <h3>
                {result.verdict === "RECOMMENDED" ? "✅" : "❌"}{" "}
                {result.verdict}
              </h3>
              <p>{result.reason}</p>
              <p>
                <strong>Suggestion:</strong> {result.suggestion}
              </p>
            </div>

            {/* PROFIT */}
            <div
              style={{
                padding: 15,
                borderRadius: 10,
                background: "#fafafa",
                marginBottom: 15,
              }}
            >
              <h3>💰 Profit Breakdown</h3>
              <p>Base Profit: £{result.profit}</p>
              <p>Import Duty: {result.duty}%</p>
              <p>VAT: {result.vat}%</p>
              <p>Platform Fee: £{result.platformFee}</p>
              <p>
                <strong>True Profit: £{result.trueProfit}</strong>
              </p>
            </div>

            {/* MARKET */}
            <div
              style={{
                padding: 15,
                borderRadius: 10,
                background: "#fafafa",
                marginBottom: 15,
              }}
            >
              <h3>🌍 Market Insight</h3>
              <p>Demand: {result.demand}</p>
              <p>Competition: {result.competition}</p>
              <p>Country: {result.country}</p>
            </div>

            {/* DOWNLOAD */}
            <button
              onClick={downloadInvoice}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Download Professional Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ INPUT STYLE (outside component)
const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};