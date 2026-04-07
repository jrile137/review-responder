export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { review, stars } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a friendly, professional manager at Costa Taco, a Mexican restaurant. Write a response to this ${stars}-star Google review. Keep it genuine, warm, and concise — no longer than 3-4 sentences. If it's a negative review, acknowledge the issue and invite them back. Never sound robotic or generic.

Review: "${review}"`
        }
      ]
    })
  });

  const data = await response.json();
  const reply = data.content[0].text;

  return res.status(200).json({ reply });
}
