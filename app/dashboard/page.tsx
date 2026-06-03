"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userId = "guest_user";

  const runAnalysis = async () => {
    setLoading(true);

    try {
      // FREE LIMIT
      const { count } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count && count >= 3) {
        alert("Free limit reached.");
        setLoading(false);
        return;
      }

      // API CALL
      const res = await fetch("/api/export-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          country,
          cost: Number(cost),
          shipping: Number(shipping),
        }),
      });

      const data = await res.json();

      // PREMIUM ANALYSIS
      const enhanced = {
        ...data,

        duty:
          country.toLowerCase() === "germany"
            ? 6.5
            : country.toLowerCase() === "usa"
            ? 3
            : 4,

        vat:
          country.toLowerCase() === "germany"
            ? 19
            : country.toLowerCase() === "uk"
            ? 20
            : 10,

        platformFee: 10,

        trueProfit: (
          Number(data.profit) - 5
        ).toFixed(2),

        demand:
          product.toLowerCase().includes("makhana")
            ? "HIGH"
            : "MEDIUM",

        competition:
          product.toLowerCase().includes("bags")
            ? "HIGH"
            : "MEDIUM",

        verdict:
          Number(data.profit) > 20
            ? "RECOMMENDED"
            : "NOT RECOMMENDED",

        reason:
          Number(data.profit) > 20
            ? "Healthy margin and stable demand"
            : "Low margin after costs",

        suggestion:
          Number(data.profit) > 20
            ? "Scale this product in international markets"
            : "Try different countries or reduce sourcing cost",
      };

      setResult(enhanced);

      // SAVE TO SUPABASE
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
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const downloadInvoice = async () => {
    const res = await fetch("https://YOUR-BACKEND-URL/api/invoice", {
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

  const inputStyle = {
    width: "100%",
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 15,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          background: "white",
          borderRadius: 20,
          padding: 30,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            marginBottom: 10,
          }}
        >
          Export Profit Analyzer
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          AI-powered export decision engine
        </p>

        <input
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Target Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Product Cost (£)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Shipping Cost (£)"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={runAnalysis}
          style={{
            width: "100%",
            padding: 15,
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Running Analysis..." : "Check Export"}
        </button>

        {result && (
          <div
            style={{
              marginTop: 30,
            }}
          >
            {/* VERDICT */}
            <div
              style={{
                padding: 20,
                borderRadius: 14,
                background:
                  result.verdict === "RECOMMENDED"
                    ? "#e8fff0"
                    : "#fff0f0",
                marginBottom: 20,
              }}
            >
              <h2>
                {result.verdict === "RECOMMENDED"
                  ? "✅ RECOMMENDED"
                  : "❌ NOT RECOMMENDED"}
              </h2>

              <p>{result.reason}</p>

              <p>
                <strong>Suggestion:</strong>{" "}
                {result.suggestion}
              </p>
            </div>

            {/* PROFIT */}
            <div
              style={{
                padding: 20,
                borderRadius: 14,
                background: "#fafafa",
                marginBottom: 20,
              }}
            >
              <h3>💰 Profit Breakdown</h3>

              <p>
                Base Profit: £{result.profit}
              </p>

              <p>
                Import Duty: {result.duty}%
              </p>

              <p>
                VAT: {result.vat}%
              </p>

              <p>
                Platform Fee: £{result.platformFee}
              </p>

              <p>
                <strong>
                  True Profit: £{result.trueProfit}
                </strong>
              </p>
            </div>

            {/* MARKET */}
            <div
              style={{
                padding: 20,
                borderRadius: 14,
                background: "#fafafa",
                marginBottom: 20,
              }}
            >
              <h3>🌍 Market Insight</h3>

              <p>Demand: {result.demand}</p>

              <p>
                Competition: {result.competition}
              </p>

              <p>Country: {result.country}</p>
            </div>

            {/* DOWNLOAD */}
            <button
              onClick={downloadInvoice}
              style={{
                width: "100%",
                padding: 15,
                borderRadius: 12,
                border: "none",
                background: "black",
                color: "white",
                fontWeight: "bold",
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