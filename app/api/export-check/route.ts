export async function POST(req: Request) {
  const { product, cost, shipping } = await req.json();

  const sellingPrice = cost * 1.5;
  const profit = sellingPrice - cost - shipping;

  return Response.json({
    product,
    country: "Germany",
    allowed: true,
    hs_code: "4202",
    documents: ["Invoice", "Packing List", "Bill of Lading"],
    profit: profit.toFixed(2),
    roi: ((profit / cost) * 100).toFixed(1) + "%",
  });
}