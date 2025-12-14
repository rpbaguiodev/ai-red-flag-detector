"use server";

const MODEL = "llama-3.3-70b-versatile";

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

type GroqResponse = {
  score: number;
  label: string;
  explanation: string;
};

export async function detectRedFlag(message: string): Promise<GroqResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing.");
  }

  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error("Message is required.");
  }

  const payload = {
    model: MODEL,
    temperature: 0.35,
    max_tokens: 512,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an assertive but empathetic AI red flag detector. Detect the dominant language of the user's message and respond entirely in that language; do not mix languages or translate unnecessarily. Calibrate scores carefully: 0-20 = clear green (encouraging), 21-60 = yellow (call out mild concerns), 61-100 = red (direct warning). Return JSON exactly in this shape with no additional text: {\"score\":10,\"label\":\"Short punchy headline\",\"explanation\":\"One constructive sentence.\"}. Keep it on a single line with no newline characters anywhere, no markdown, and no extra keys. Lean concise but human, and never exaggerate risk for obviously healthy messages.",
      },
      {
        role: "user",
        content: `Analyze this message for dating red flags:\n"""${trimmed}"""`,
      },
    ],
  };

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Groq request failed: ${errorPayload}`);
  }

  const completion = await response.json();
  const rawContent =
    completion?.choices?.[0]?.message?.content ??
    '{"score":65,"label":"Unclear","explanation":"AI response missing, assume moderate risk."}';

  const content = rawContent.replace(/\n/g, " ").trim();

  let parsed: Partial<GroqResponse>;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }

  const cleanLabel =
    typeof parsed.label === "string"
      ? parsed.label.replace(/\*/g, "").trim()
      : undefined;

  return {
    score: clampScore(Number(parsed.score)),
    label: cleanLabel && cleanLabel.length > 0 ? cleanLabel : "Needs Review",
    explanation:
      parsed.explanation ??
      "AI response could not be parsed, but caution is advised.",
  };
}
