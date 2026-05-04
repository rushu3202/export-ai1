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
      setResult(data);

      // Supabase insert
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
        ]);

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

  const inputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
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
          Check if your product can be exported profitably
        </h1>

        <p style={{ color: "#666", marginBottom: 20 }}>
          Instant compliance + profit analysis
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
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 10,
              background: "#fafafa",
            }}
          >
            <h3>Result</h3>
            <p><strong>Product:</strong> {result.product}</p>
            <p><strong>Country:</strong> {result.country}</p>
            <p>
              <strong>Status:</strong>{" "}
              {result.allowed ? "Allowed" : "Restricted"}
            </p>
            <p><strong>Profit:</strong> £{result.profit}</p>
            <p><strong>ROI:</strong> {result.roi}%</p>

            <button
              onClick={downloadInvoice}
              style={{
                marginTop: 10,
                padding: 10,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Download Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}