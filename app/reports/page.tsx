"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setReports(data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Reports History</h1>

      {loading && <p>Loading...</p>}

      {!loading && reports.length === 0 && (
        <p>No reports found. Run analysis first.</p>
      )}

      {reports.map((r, i) => (
        <div key={i} style={card}>
          <h3>{r.product}</h3>

          <p>Cost: £{r.cost}</p>
          <p>Shipping: £{r.shipping}</p>

          <p style={{ color: "green", fontWeight: "bold" }}>
            Profit: £{r.profit}
          </p>

          <p>ROI: {r.roi}</p>

          <p style={{ fontSize: 12, color: "gray" }}>
            {new Date(r.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#111",
  color: "white",
  padding: 20,
  marginTop: 15,
  borderRadius: 10,
};