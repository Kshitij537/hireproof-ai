interface Props {
    score: number;
}

interface BreakdownItem {
    label: string;
    value: number;
    max: number;
    color: string;
    isNegative?: boolean;
}

function deriveBreakdown(score: number): BreakdownItem[] {
    // Deterministic heuristic distribution from the overall score
    const seed = score;
    const jitter = (base: number, range: number) => {
        const h = ((seed * 7 + base * 13) % 100) / 100;
        return Math.round(base + (h - 0.5) * range);
    };

    const activity = Math.min(30, Math.max(5, jitter(Math.round(score * 0.3), 6)));
    const complexity = Math.min(25, Math.max(3, jitter(Math.round(score * 0.25), 5)));
    const consistency = Math.min(20, Math.max(2, jitter(Math.round(score * 0.2), 4)));
    const originality = Math.min(15, Math.max(1, jitter(Math.round(score * 0.15), 3)));
    const raw = activity + complexity + consistency + originality;
    const aiRisk = Math.max(0, raw - score);

    return [
        { label: "GitHub Activity", value: activity, max: 30, color: "#a855f7" },
        { label: "Project Complexity", value: complexity, max: 25, color: "#3b82f6" },
        { label: "Consistency", value: consistency, max: 20, color: "#06b6d4" },
        { label: "Originality", value: originality, max: 15, color: "#10b981" },
        { label: "AI-risk adjustment", value: aiRisk, max: 10, color: "#ef4444", isNegative: true },
    ];
}

export default function ScoreBreakdownPanel({ score }: Props) {
    const items = deriveBreakdown(score);

    return (
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl shadow-black/20">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
                Score Breakdown
            </h3>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-white/60 font-medium">{item.label}</span>
                            <span className={`text-xs font-semibold ${item.isNegative ? "text-red-400" : "text-white/50"}`}>
                                {item.isNegative ? `−${item.value}` : `${item.value}/${item.max}`}
                            </span>
                        </div>
                        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${(item.value / item.max) * 100}%`,
                                    backgroundColor: item.color,
                                    opacity: item.isNegative ? 0.7 : 1,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-white/40">Composite Score</span>
                <span className="text-sm font-bold text-white">{score}/100</span>
            </div>
        </div>
    );
}
