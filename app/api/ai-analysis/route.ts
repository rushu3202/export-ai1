import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { product, country } = body;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an international export trade expert.",
          },
          {
            role: "user",
            content: `
Analyze export opportunity for:

Product: ${product}
Country: ${country}

Provide:
- demand analysis
- risks
- best buyers
- pricing strategy
- export opportunity
- logistics considerations
            `,
          },
        ],
      });

    return NextResponse.json({
      analysis:
        completion.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      analysis:
        "AI analysis temporarily unavailable.",
    });
  }
}