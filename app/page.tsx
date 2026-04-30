import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200/80">
              AI Trust Check
            </p>
            <p className="mt-1 text-sm text-slate-400">
              A simple AI output evaluation tool
            </p>
          </div>
          <Link
            href="/evaluate"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Open Evaluator
          </Link>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm text-teal-100">
              Review AI responses with clarity and confidence
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                AI Trust Check
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Quickly assess whether an AI-generated answer sounds reliable,
                where it may be hallucinating, and how to rewrite it more
                carefully.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/evaluate"
                className="inline-flex items-center justify-center rounded-2xl bg-teal-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-soft hover:bg-teal-300"
              >
                Try AI Trust Check
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
              >
                View Features
              </a>
            </div>
            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Fast</p>
                <p className="mt-2 leading-6">
                  Paste a response and get an instant structured review.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Focused</p>
                <p className="mt-2 leading-6">
                  Surface reliability, risk, and issues without clutter.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Simple</p>
                <p className="mt-2 leading-6">
                  No login, no database, just an evaluator that works.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-soft backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Example evaluation
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Product-style results preview
                  </p>
                </div>
                <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-200">
                  Live format
                </span>
              </div>
              <div className="mt-5 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="font-medium text-slate-300">Reliability Score</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    8.4<span className="text-lg text-slate-400">/10</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="font-medium text-slate-300">
                    Hallucination Risk
                  </p>
                  <p className="mt-3 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                    Medium
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:col-span-2">
                  <p className="font-medium text-slate-300">Issues Found</p>
                  <p className="mt-3 leading-7 text-slate-200">
                    Includes a broad claim without evidence and doesn&apos;t
                    explain uncertainty clearly.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:col-span-2">
                  <p className="font-medium text-slate-300">Improved Answer</p>
                  <p className="mt-3 leading-7 text-slate-200">
                    A stronger version would narrow the claim, mention the
                    limits of the information, and point to a source the reader
                    can verify.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="grid gap-4 border-t border-white/10 py-8 sm:grid-cols-3"
        >
          {[
            {
              title: "Reliability scoring",
              text: "See a clear score out of ten for how trustworthy an answer appears."
            },
            {
              title: "Hallucination awareness",
              text: "Flag weak factual grounding, uncertainty, and unsupported claims."
            },
            {
              title: "Actionable rewrite",
              text: "Get a sharper improved answer you can learn from or reuse."
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 leading-7 text-slate-300">{feature.text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
