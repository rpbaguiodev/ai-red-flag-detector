import { getScoreColor } from "@/lib/score-color";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ShareCardProps {
  score: number;
  label: string;
  explanation: string;
}

export function ShareCard({ score, label, explanation }: ShareCardProps) {
  return (
    <div
      className="relative isolate mx-auto flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#140F27] via-[#0F0A1B] to-black px-6 pb-8 pt-6 text-white shadow-[0_40px_120px_-40px_rgba(12,6,32,0.8)]"
      style={{ aspectRatio: "9 / 16" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-x-0 -top-12 mx-auto size-60 rounded-full bg-pink-500/20 blur-[120px]" />
        <div className="absolute -bottom-16 right-0 size-64 rounded-full bg-indigo-500/20 blur-[140px]" />
      </div>

      <div className="flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-white/70">
        <p>AI Red Flag Detector</p>
      </div>

      <div className="relative mx-auto my-2 flex size-44 items-center justify-center rounded-full border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,1)]">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          strokeWidth={12}
          styles={buildStyles({
            textSize: "32px",
            pathColor: getScoreColor(score),
            textColor: "#FFFFFF",
            trailColor: "rgba(255,255,255,0.1)",
          })}
        />
        <div className="absolute bottom-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em]">
          score
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-lg font-semibold tracking-wide">{label}</p>
      </div>

      <div className="rounded-2xl bg-white/5 p-4 text-left">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
          flag insight
        </p>
        <p className="mt-2 text-sm text-white/90">{explanation}</p>
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 text-center text-xs text-white/70">
        <p className="text-[11px] text-white/60">
          Screenshot, post, and tag a friend who needs the wake-up call.
        </p>
        <p className="text-[11px] text-white/60">
          https://ai-red-flag-detector.vercel.app
        </p>
        <p className="text-[11px] text-white/60">
          #AIRedFlagDetector • @CodeWithMerk
        </p>
      </div>
    </div>
  );
}
