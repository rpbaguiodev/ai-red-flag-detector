"use client";

import { useState, useTransition } from "react";

import { detectRedFlag } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareCard } from "@/components/share-card";

type Analysis = {
  score: number;
  label: string;
  explanation: string;
};

const defaultAnalysis: Analysis = {
  score: 0,
  label: "Awaiting tea ☕",
  explanation: "Paste the wildest message you got to see how spicy it is.",
};

export default function Page() {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<Analysis>(defaultAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startAnalysis] = useTransition();

  const handleDetect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setError("Please drop in a message first.");
      return;
    }

    setError(null);
    startAnalysis(async () => {
      try {
        const result = await detectRedFlag(message);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : "Unable to analyze that message right now.";

        const display = message.includes("Groq request failed")
          ? "Groq could not finish that request. Try again in a few seconds."
          : message;

        setError(display);
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10 text-white">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-2 pb-8 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          code with merk
        </p>
        <h1 className="text-3xl font-semibold text-white">
          AI Red Flag Detector
        </h1>
        <p className="text-sm text-white/70">
          Drop in the message that gave you pause—our AI Red Flag detector
          grades the red flag energy.
        </p>
      </header>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 md:flex-row md:items-start">
        {/* Input Card */}
        <Card className="w-full border-white/5 bg-white/5 text-white shadow-2xl backdrop-blur">
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleDetect}>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type the message here..."
                  className="min-h-40 text-base text-white"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </div>
              {error ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? "Detecting..." : "Detect"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-center text-xs text-white/70">
              We’ll never store your chat history. Promise.
            </p>
          </CardFooter>
        </Card>

        {/* Share-ready layout */}
         <ShareCard
            score={analysis.score}
            label={analysis.label}
            explanation={analysis.explanation}
          />
      </div>
      <footer className="mt-10 text-center text-xs text-white/60">
        Made with <span aria-hidden="true">❤️</span> @CodeWithMerk
      </footer>
    </div>
  );
}
