"use client";

import Link from "next/link";
import { useState } from "react";

type EvaluationResult = {
  reliabilityScore: number;
  hallucinationRisk: "Low" | "Medium" | "High";
  issues: string[];
  improvedAnswer: string;
  summary: string;
};

type ApiError = {
  error?: string;
};

const emptyResult: EvaluationResult | null = null;
const sampleAnswer =
  "Remote work always makes people more productive because employees have fewer distractions at home and can focus better than in an office. Studies prove it works for every company, so businesses should permanently switch to fully remote teams.";

function isEvaluationResult(data: unknown): data is EvaluationResult {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.reliabilityScore === "number" &&
    (candidate.hallucinationRisk === "Low" ||
      candidate.hallucinationRisk === "Medium" ||
      candidate.hallucinationRisk === "High") &&
    Array.isArray(candidate.issues) &&
    typeof candidate.improvedAnswer === "string" &&
    typeof candidate.summary === "string"
  );
}

export default function EvaluatePage() {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(emptyResult);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEvaluate() {
    if (!answer.trim()) {
      setError("Paste an AI-generated answer before evaluating it.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer })
      });

      const rawText = await response.text();
      let data: EvaluationResult | ApiError | null = null;

      if (rawText) {
        try {
          data = JSON.parse(rawText) as EvaluationResult | ApiError;
        } catch {
          throw new Error("The server returned invalid JSON.");
        }
      }

      if (!response.ok) {
        throw new Error(
          data && "error" in data && typeof data.error === "string"
            ? data.error
            : "Unable to evaluate this response."
        );
      }

      if (!isEvaluationResult(data)) {
        throw new Error("The server returned an unexpected evaluation format.");
      }

      setResult(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  const riskStyles = {
    Low: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    Medium: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    High: "text-rose-300 bg-rose-400/10 border-rose-400/20"
  };

  const hasResult = Boolean(result);

  function handleUseSample() {
    setAnswer(sampleAnswer);
    setError("");
    setResult(null);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-teal-200 hover:text-teal-100"
            >
              Back to home
            </Link>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
              AI Trust Check
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Evaluate AI output
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Paste a generated answer below for a quick review of reliability,
              hallucination risk, issues found, and a more careful rewrite.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft backdrop-blur sm:p-6">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-slate-200"
              >
                AI-generated answer
              </label>
              <button
                type="button"
                onClick={handleUseSample}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Use sample text
              </button>
            </div>
            <textarea
              id="answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Paste the AI-generated answer here..."
              className="min-h-[320px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none ring-0 placeholder:text-slate-400 focus:border-teal-400/50"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Best for testing pasted model output, summaries, and answers.</span>
              <span>{answer.trim().length} chars</span>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-2xl bg-teal-400 px-5 py-3 text-base font-semibold text-slate-950 hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Evaluating..." : "Evaluate Answer"}
              </button>
              {error ? (
                <p className="text-sm text-rose-300">{error}</p>
              ) : (
                <p className="text-sm text-slate-400">
                  {hasResult
                    ? "Your latest evaluation is shown in the result cards."
                    : "Use the sample button or paste your own AI answer to begin."}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur sm:col-span-2">
              <p className="text-sm font-medium text-slate-300">Summary</p>
              {isLoading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  {result?.summary ||
                    "A short overall summary will appear here after the evaluation finishes."}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-medium text-slate-300">
                Reliability Score
              </p>
              {isLoading ? (
                <div className="mt-4 h-16 animate-pulse rounded-2xl bg-white/10" />
              ) : result ? (
                <p className="mt-3 text-4xl font-semibold text-white">
                  {result.reliabilityScore}
                  <span className="ml-1 text-lg text-slate-400">/10</span>
                </p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  The trust score will appear here after evaluation.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-medium text-slate-300">
                Hallucination Risk
              </p>
              {isLoading ? (
                <div className="mt-4 h-10 w-32 animate-pulse rounded-full bg-white/10" />
              ) : result ? (
                <div
                  className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
                    riskStyles[result.hallucinationRisk]
                  }`}
                >
                  {result.hallucinationRisk}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Risk level will show as Low, Medium, or High.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur sm:col-span-2">
              <p className="text-sm font-medium text-slate-300">Issues Found</p>
              {isLoading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-11 animate-pulse rounded-2xl bg-white/10" />
                  <div className="h-11 animate-pulse rounded-2xl bg-white/10" />
                </div>
              ) : result?.issues.length ? (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                  {result.issues.map((issue) => (
                    <li
                      key={issue}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3"
                    >
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {answer.trim()
                    ? "Run an evaluation to see what the model may have gotten wrong or overstated."
                    : "Paste an answer or load the sample text to see detected issues here."}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur sm:col-span-2">
              <p className="text-sm font-medium text-slate-300">
                Improved Answer
              </p>
              {isLoading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {result?.improvedAnswer ||
                    "A more careful rewritten answer will appear here once the evaluation is complete."}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
