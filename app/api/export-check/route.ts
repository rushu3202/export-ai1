import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { product, country, cost, shipping } = body;

    // Fake AI logic for now
    const sellPrice = Number(cost) * 2.2;

    const profit = (
      sellPrice -
      Number(cost) -
      Number(shipping)
    ).toFixed(2);

    const roi = (
      (Number(profit) / Number(cost)) *
      100
    ).toFixed(1);

    const response = {
      product,
      country,
      allowed: true,
      profit,
      roi,

      duty: 6.5,
      vat: 19,
      platformFee: 10,

      trueProfit: (
        Number(profit) - 5
      ).toFixed(2),

      demand: "HIGH",
      competition: "MEDIUM",

      verdict:
        Number(profit) > 10
          ? "RECOMMENDED"
          : "NOT RECOMMENDED",

      reason:
        Number(profit) > 10
          ? "Healthy margin and stable demand"
          : "Low margin after costs",

      suggestion:
        Number(profit) > 10
          ? "Scale this product in EU markets"
          : "Try UAE or USA for better margins",
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}