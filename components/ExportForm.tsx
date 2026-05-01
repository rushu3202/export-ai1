"use client";

import { useState } from "react";

export default function ExportForm({ onResult }: any) {
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    const res = await fetch("/api/export-check", {
      method: "POST",
      body: JSON.stringify({
        product,
        cost: Number(cost),
        shipping: Number(shipping),
      }),
    });

    const data = await res.json();
    onResult(data);

    setLoading(false);
  };

  return (
    <div style={card}>
      <h3>📦 Export Checker</h3>

      <input
        placeholder="Product (e.g. Leather bags)"
        onChange={(e) => setProduct(e.target.value)}
        style={input}
      />

      <input
        placeholder="Cost per unit (£)"
        onChange={(e) => setCost(e.target.value)}
        style={input}
      />

      <input
        placeholder="Shipping (£)"
        onChange={(e) => setShipping(e.target.value)}
        style={input}
      />

      <button onClick={runAnalysis} style={btn}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>
    </div>
  );
}

const card = {
  background: "#111827",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "none",
};

const btn = {
  marginTop: 15,
  padding: 10,
  background: "#2F6FED",
  color: "white",
  border: "none",
  borderRadius: 6,
};