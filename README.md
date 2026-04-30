# AI Trust Check

AI Trust Check is a simple Next.js app that reviews AI-generated answers and returns:

- `reliabilityScore`
- `hallucinationRisk`
- `issues`
- `improvedAnswer`
- `summary`

The app has a clean landing page, a mobile-friendly evaluator UI, and a server-side API route that securely calls OpenAI using an environment variable.

## What The App Does

Users can paste an AI-generated answer into the evaluator and get a structured review:

- A reliability score out of 10
- A hallucination risk level: `Low`, `Medium`, or `High`
- A short list of issues found
- A stronger rewritten version of the answer
- A concise overall summary

The app is intentionally simple:

- No login
- No database
- No user accounts

## How To Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```text
http://localhost:3000
```

## Required Environment Variable

The app requires this environment variable:

```env
OPENAI_API_KEY
```

This key is used only on the server in the API route at [app/api/evaluate/route.ts](/Users/kindusamra/Downloads/any-main/app/api/evaluate/route.ts).

## How To Deploy On Vercel

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Click `Add New` -> `Project`.
4. Import the GitHub repository.
5. In the Vercel project settings, add this environment variable:

```text
OPENAI_API_KEY
```

6. Paste your real OpenAI API key as the value.
7. Deploy the project.

Vercel should detect this as a Next.js app automatically, so no special build configuration is required.

After deployment:

- Open the live app URL
- Go to the evaluator page
- Paste sample AI output or use the built-in sample button
- Run an evaluation to confirm the API route works in production

## Short Demo Script For BYOP Submission

Use this short script during your demo:

1. Open the deployed AI Trust Check homepage.
2. Explain that the app helps review AI-generated answers for trustworthiness and hallucination risk.
3. Click `Try AI Trust Check` or `Open Evaluator`.
4. On the evaluator page, click `Use sample text`.
5. Click `Evaluate Answer`.
6. Point out the returned `summary`, `reliabilityScore`, `hallucinationRisk`, `issues`, and `improvedAnswer`.
7. Mention that the OpenAI key is kept secure on the server through the Next.js API route.
8. Highlight that the app is lightweight and simple: no login, no database, and mobile-friendly UI.

## Notes

- If the model returns invalid JSON, the API route now handles that safely and returns a structured error.
- If you change the model or prompt later, keep the JSON schema aligned with the evaluator UI.
