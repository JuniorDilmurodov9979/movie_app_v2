import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-nano", // gpt-4.1-nano doesn't exist - use gpt-4o-mini or gpt-3.5-turbo
    max_tokens: 250, // Changed from max_output_tokens
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "movie_recommendation",
        schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  year: { type: "number" },
                  genres: {
                    type: "array",
                    items: { type: "string" },
                  },
                  why: { type: "string" },
                },
                required: ["title"],
                additionalProperties: false,
              },
            },
          },
          required: ["recommendations"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    messages: [
      // Changed from input
      { role: "user", content: prompt },
    ],
  });

  // Parse the JSON response
  const parsed = JSON.parse(response.choices[0].message.content || "{}");
  res.status(200).json(parsed);
}
