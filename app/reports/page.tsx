"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setReports(data || []);
    };

    fetchReports();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Reports</h1>

      {reports.map((r, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <p><strong>{r.product}</strong></p>
          <p>Profit: £{r.profit}</p>
          <p>ROI: {r.roi}%</p>
        </div>
      ))}
    </div>
  );
}