import type { Candidate } from "../../types/candidate";

type SignalStrength = "strong" | "medium" | "weak";

interface Signal {
    label: string;
    icon: string;
    status: SignalStrength;
}

const strengthStyles: Record<SignalStrength, { bg: string; text: string; border: string }> = {
    strong: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
    medium: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
    weak: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
};

function deriveSignals(c: Candidate): Signal[] {
    const s = c.score;
    const mon = c.githubMonitoring;

    const commitConsistency: SignalStrength =
        (mon?.contributionConsistency ?? s) > 70 ? "strong" : (mon?.contributionConsistency ?? s) >= 40 ? "medium" : "weak";

    const repoDepth: SignalStrength =
        (mon?.complexityScore ?? s) > 70 ? "strong" : (mon?.complexityScore ?? s) >= 40 ? "medium" : "weak";

    const techDiversity: SignalStrength =
        (c.topRepos?.length ?? 0) >= 4 ? "strong" : (c.topRepos?.length ?? 0) >= 2 ? "medium" : "weak";

    const ownership: SignalStrength =
        (mon?.collaborationScore ?? s) > 65 ? "strong" : (mon?.collaborationScore ?? s) >= 35 ? "medium" : "weak";

    const aiRisk: SignalStrength =
        (c.aiRisk ?? 0) < 15 ? "strong" : (c.aiRisk ?? 0) < 40 ? "medium" : "weak";

    const projectScale: SignalStrength =
        s > 70 ? "strong" : s >= 40 ? "medium" : "weak";

    return [
        { label: "Commit consistency", icon: "📊", status: commitConsistency },
        { label: "Repo depth", icon: "🔍", status: repoDepth },
        { label: "Tech diversity", icon: "🧩", status: techDiversity },
        { label: "Contribution ownership", icon: "👤", status: ownership },
        { label: "AI pattern risk", icon: "🤖", status: aiRisk },
        { label: "Project scale", icon: "📐", status: projectScale },
    ];
}

interface Props {
    candidate: Candidate;
}

export default function EvidenceSignalsPanel({ candidate }: Props) {
    const signals = deriveSignals(candidate);

    return (
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl shadow-black/20">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Evidence Signals Used
            </h3>

            <div className="space-y-3">
                {signals.map((sig) => {
                    const style = strengthStyles[sig.status];
                    return (
                        <div
                            key={sig.label}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-base">{sig.icon}</span>
                                <span className="text-xs text-white/60 font-medium">{sig.label}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                                {sig.status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
