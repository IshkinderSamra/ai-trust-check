import { NextResponse } from "next/server";

type HallucinationRisk = "Low" | "Medium" | "High";

type EvaluationResponse = {
  reliabilityScore: number;
  hallucinationRisk: HallucinationRisk;
  issues: string[];
  improvedAnswer: string;
  summary: string;
};

type ParsedChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

function parseJsonCandidate(content: string): unknown {
  const trimmed = content.trim();
  const withoutFences = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFences);
  } catch {
    const match = withoutFences.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON object found in the model response.");
    }

    return JSON.parse(match[0]);
  }
}

function toRisk(value: unknown): HallucinationRisk {
  return value === "Low" || value === "Medium" || value === "High"
    ? value
    : "Medium";
}

function normalizeEvaluation(parsed: unknown): EvaluationResponse {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Model response was not a valid JSON object.");
  }

  const source = parsed as Record<string, unknown>;
  const rawIssues = Array.isArray(source.issues)
    ? source.issues
    : Array.isArray(source.issuesDetected)
      ? source.issuesDetected
      : [];

  const issues = rawIssues
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 6);

  const improvedAnswer = String(
    source.improvedAnswer ?? source.improvedVersion ?? ""
  ).trim();
  const summary = String(source.summary ?? "").trim();

  return {
    reliabilityScore: Math.min(
      10,
      Math.max(0, Number(source.reliabilityScore) || 0)
    ),
    hallucinationRisk: toRisk(source.hallucinationRisk),
    issues,
    improvedAnswer:
      improvedAnswer ||
      "No improved answer was returned. Try evaluating the text again.",
    summary:
      summary ||
      "Evaluation completed, but the model did not return a short summary."
  };
}

function getMessageContent(data: ParsedChatCompletion): string {
  const content = data.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const { answer } = (await request.json()) as { answer?: string };

    if (!answer?.trim()) {
      return NextResponse.json(
        { error: "Answer text is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on the server." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        response_format: {
          type: "json_object"
        },
        messages: [
          {
            role: "system",
            content:
              "You evaluate AI-generated answers for likely reliability and hallucination risk. Respond with valid JSON only. Use exactly this schema: {\"reliabilityScore\": number from 0 to 10, \"hallucinationRisk\": \"Low\" | \"Medium\" | \"High\", \"issues\": string[], \"improvedAnswer\": string, \"summary\": string}. Keep summary to one or two sentences and keep issues concise."
          },
          {
            role: "user",
            content: `Evaluate this AI-generated answer:\n\n${answer}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${errorText}` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as ParsedChatCompletion;
    const content = getMessageContent(data);

    if (!content) {
      return NextResponse.json(
        { error: "No evaluation content returned from OpenAI." },
        { status: 500 }
      );
    }

    let result: EvaluationResponse;

    try {
      const parsed = parseJsonCandidate(content);
      result = normalizeEvaluation(parsed);
    } catch (parseError) {
      const message =
        parseError instanceof Error
          ? parseError.message
          : "Invalid JSON returned by the model.";

      return NextResponse.json(
        {
          error: `The model returned invalid structured output. ${message}`
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
