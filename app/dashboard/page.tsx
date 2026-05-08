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

    const userId = "guest_user";

    // 🔒 Check free limit
    const { count } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (count && count >= 3) {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
      });

      const data = await res.json();
      window.location.href = data.url;
      return;
    }

    try {
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

      const countryData = {
  Germany: {
    vat: 19,
    duty: 6.5,
    demand: "HIGH",
  },
  UAE: {
    vat: 5,
    duty: 2,
    demand: "VERY HIGH",
  },
  USA: {
    vat: 0,
    duty: 4,
    demand: "MEDIUM",
  },
};
      const data = await res.json();

      // 🔥 PREMIUM LOGIC HERE (CORRECT PLACE)
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

      // 💾 Save to DB
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
    }

    setLoading(false);
  };

  // 📄 DOWNLOAD FUNCTION (MISSING BEFORE)
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
    a.download = "invoice.pdf";
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Export Profit Checker</h1>

      <input
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        placeholder="Cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />

      <input
        placeholder="Shipping"
        value={shipping}
        onChange={(e) => setShipping(e.target.value)}
      />

      <br /><br />

      <button onClick={runAnalysis}>
        {loading ? "Running..." : "Check Export"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>

          {/* Verdict */}
          <div style={{
            padding: 15,
            borderRadius: 10,
            background: result.verdict === "RECOMMENDED" ? "#e6f7ec" : "#ffecec",
            marginBottom: 15
          }}>
            <h3>
              {result.verdict === "RECOMMENDED" ? "✅" : "❌"} {result.verdict}
            </h3>
            <p>{result.reason}</p>
            <p><strong>Suggestion:</strong> {result.suggestion}</p>
          </div>

          {/* Profit */}
          <div style={{
            padding: 15,
            borderRadius: 10,
            background: "#fafafa",
            marginBottom: 15
          }}>
            <h3>💰 Profit Breakdown</h3>
            <p>Base Profit: £{result.profit}</p>
            <p>Import Duty: {result.duty}%</p>
            <p>VAT: {result.vat}%</p>
            <p>Platform Fee: £{result.platformFee}</p>
            <p><strong>True Profit: £{result.trueProfit}</strong></p>
          </div>

          {/* Market */}
          <div style={{
            padding: 15,
            borderRadius: 10,
            background: "#fafafa",
            marginBottom: 15
          }}>
            <h3>🌍 Market Insight</h3>
            <p>Demand: {result.demand}</p>
            <p>Competition: {result.competition}</p>
            <p>Country: {result.country}</p>
          </div>

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
            Download Professional Invoice
          </button>

        </div>
      )}
    </div>
  );
}