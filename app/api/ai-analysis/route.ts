import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { product, country } = body;

    const prompt = `
You are an export market intelligence AI.

Analyze export potential for:

Product: ${product}
Target Country: ${country}

Give:
- Market demand
- Competition level
- Risks
- Best strategy
- Profit potential
- Recommendation

Keep it concise and professional.
`;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const analysis =
      completion.choices[0].message.content;

    return NextResponse.json({
      analysis,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      analysis:
        "AI analysis temporarily unavailable.",
    });
  }
}