const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

export async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI API key not set");

  // Use Groq if GROQ_API_KEY is set
  if (process.env.GROQ_API_KEY) {
    return generateWithGroq(prompt, apiKey);
  }

  // Fallback to Gemini
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function generateWithGroq(prompt: string, apiKey: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as Record<string, Record<string, string>>)?.error?.message || `HTTP ${res.status}`;
        if (res.status === 429) {
          lastError = new Error(`429 quota: ${msg}`);
          continue; // try next model
        }
        throw new Error(msg);
      }

      const data = await res.json();
      return (data as { choices: { message: { content: string } }[] }).choices[0].message.content.trim();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (lastError.message.includes("429")) continue;
      throw lastError;
    }
  }

  throw lastError || new Error("All AI models failed");
}

export function parseJSON(text: string): unknown {
  const cleaned = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned);
}
