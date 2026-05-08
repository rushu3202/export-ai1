import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `
You are an export business analyst.

Analyze this export product:

Product: ${body.product}
Cost: £${body.cost}
Shipping: £${body.shipping}

Return JSON only with:
- country
- demand
- competition
- allowed
- profit
- roi
- verdict
- reason
- suggestion
- duty
- vat
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0].message.content || "{}";

  return Response.json(JSON.parse(text));
}