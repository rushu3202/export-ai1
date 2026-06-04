
"use client";

import { useState } from "react";
import { markets } from "@/data/markets";
import { products } from "@/data/products";

export default function Page() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    try {
      const exportRes = await fetch(
        "/api/export-check",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            product,
            country,
            cost: Number(cost),
            shipping: Number(shipping),
          }),
        }
      );

      const data = await exportRes.json();

      const market =
        markets[
          country.toLowerCase() as keyof typeof markets
        ];

      const productData =
        products[
          product.toLowerCase() as keyof typeof products
        ];

      const enhanced = {
        ...data,

        duty: market?.duty || 4,

        vat: market?.vat || 20,

        logisticsRisk:
          market?.logisticsRisk ||
          "MEDIUM",

        platformFee: 10,

        trueProfit: (
          Number(data.profit) - 5
        ).toFixed(2),

        exportScore:
          Number(data.profit) > 40
            ? 92
            : Number(data.profit) > 20
            ? 74
            : 48,

        demand:
          productData?.demand ||
          "MEDIUM",

        competition:
          productData?.competition ||
          "MEDIUM",

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
            ? "Scale this product internationally"
            : "Try another market",

        avgSellingPrice:
          productData?.avgSellingPrice ||
          0,

       recommendedPrice:
  productData?.recommendedSellingPrice || 0,
          

        wholesaleMargin:
          productData?.wholesaleMargin ||
          0,

        supplierType:
          productData?.supplierType ||
          "General suppliers",

        moq:
          productData?.moq || "N/A",

        shippingMethod:
          productData?.shippingMethod ||
          "Standard Shipping",

        packaging:
          productData?.packaging ||
          "Standard packaging",

        hsCode:
          productData?.hsCode || "N/A",

        restricted:
          productData?.restricted ||
          "NO",

        certifications:
          productData?.certifications ||
          [],

        customsNotes:
          productData?.customsNotes ||
          "No customs requirements.",

        topMarkets:
          productData?.topMarkets || [],

        invoiceNumber:
          "INV-" +
          Math.floor(
            Math.random() * 100000
          ),

        estimatedDelivery:
          country.toLowerCase() === "uk"
            ? "7-10 Days"
            : "10-15 Days",

        shippingPort:
          country.toLowerCase() === "uk"
            ? "Nhava Sheva"
            : "Mundra Port",

        aiAnalysis:
          "AI analysis temporarily unavailable.",
      };

      setResult(enhanced);
    } catch (err) {
      console.error(err);

      alert("Something went wrong");
    }

    setLoading(false);
  };

  const downloadInvoice = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/invoice",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(result),
        }
      );

      const blob = await res.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "export-report.pdf";

      a.click();
    } catch (err) {
      console.error(err);

      alert(
        "Invoice download failed"
      );
    }
  };

  const generateExportDocs =
    async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/export-docs",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(result),
          }
        );

        const blob =
          await res.blob();

        const url =
          window.URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href = url;

        a.download =
          "export-documents.pdf";

        a.click();
      } catch (err) {
        console.error(err);

        alert(
          "Export docs failed"
        );
      }
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          background: "white",
          padding: 30,
          borderRadius: 16,
        }}
      >
        <h1>
          Export Profit Analyzer
        </h1>

        <p>
          AI-powered export decision
          engine
        </p>

        <input
          placeholder="Product"
          value={product}
          onChange={(e) =>
            setProduct(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Country"
          value={country}
          onChange={(e) =>
            setCountry(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Cost"
          value={cost}
          onChange={(e) =>
            setCost(e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Shipping"
          value={shipping}
          onChange={(e) =>
            setShipping(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={runAnalysis}
          style={buttonStyle}
        >
          {loading
            ? "Running..."
            : "Check Export"}
        </button>

        {result && (
          <div
            style={{
              marginTop: 30,
            }}
          >
            <div style={cardStyle}>
              <h2>
                {result.verdict ===
                "RECOMMENDED"
                  ? "✅ RECOMMENDED"
                  : "❌ NOT RECOMMENDED"}
              </h2>

              <p>
                {result.reason}
              </p>
            </div>

            <div style={cardStyle}>
              <h3>
                💰 Profit Breakdown
              </h3>

              <p>
                Base Profit: £
                {result.profit}
              </p>

              <p>
                True Profit: £
                {result.trueProfit}
              </p>

              <p>
                Duty:
                {result.duty}%
              </p>

              <p>
                VAT:
                {result.vat}%
              </p>
            </div>

            <div style={cardStyle}>
              <h3>
                🌎 Best Markets
              </h3>

              {result.topMarkets.map(
                (
                  market: any,
                  index: number
                ) => (
                  <div
                    key={index}
                  >
                    <p>
                      <strong>
                        {
                          market.country
                        }
                      </strong>
                    </p>

                    <p>
                      Score:
                      {market.score}
                    </p>

                    <p>
                      Demand:
                      {
                        market.demand
                      }
                    </p>
                  </div>
                )
              )}
            </div>

            <button
              onClick={
                downloadInvoice
              }
              style={buttonStyle}
            >
              Download Report
            </button>

            <button
              onClick={
                generateExportDocs
              }
              style={{
                ...buttonStyle,
                marginTop: 10,
              }}
            >
              Generate Export Docs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  background: "black",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const cardStyle = {
  padding: 18,
  borderRadius: 12,
  background: "#fafafa",
  marginBottom: 20,
};
