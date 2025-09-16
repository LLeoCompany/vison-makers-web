import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req = NextApiRequest,
  res = NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body; // [{role: "user", content: "..."}]

  // 맥락 유지용 prompt 생성
  let prompt =
    messages
      .map((m) => `${m.role === "user" ? "User" : "Claude"}: ${m.content}`)
      .join("\n") + "\nClaude:";

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/complete",
      {
        model: "claude-2",
        prompt,
        max_tokens_to_sample: 500,
      },
      {
        headers: {
          "x-api-key": process.env.CLAUDE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ answer: response.data.completion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
