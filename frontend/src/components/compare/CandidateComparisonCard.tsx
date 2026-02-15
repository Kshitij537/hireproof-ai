import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import type { Candidate, Skills } from "../../types/candidate";

interface Props {
    candidate: Candidate;
    isWinner: boolean;
}

const SKILL_MAP: { key: keyof Skills; label: string }[] = [
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "dsa", label: "DSA" },
    { key: "system", label: "System" },
    { key: "testing", label: "Testing" },
];

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = score > 75 ? "#10b981" : score >= 45 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="transparent"
                    stroke={color} strokeWidth={6} strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{score}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/40">Score</span>
            </div>
        </div>
    );
}

export default function CandidateComparisonCard({ candidate, isWinner }: Props) {
    const radarData = SKILL_MAP.map(({ key, label }) => ({
        skill: label,
        value: (candidate.skills[key] ?? 0) * 10,
        fullMark: 100,
    }));

    const badgeColor =
        candidate.authenticityLevel === "High"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : candidate.authenticityLevel === "Medium"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-red-500/15 text-red-400 border-red-500/30";

    return (
        <div
            className={`flex-1 rounded-2xl border p-6 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all ${isWinner
                ? "bg-emerald-500/[0.04] border-emerald-500/30"
                : "bg-white/[0.03] border-white/[0.08]"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                    <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                        {candidate.authenticityLevel} Authenticity
                    </span>
                </div>
                <ScoreRing score={candidate.score} />
            </div>

            {isWinner && (
                <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-2.52.952m0 0a6.003 6.003 0 01-2.52-.952" />
                    </svg>
                    <span className="text-xs font-semibold text-emerald-400">Recommended</span>
                </div>
            )}

            {/* Radar Chart */}
            <div className="h-[220px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            dataKey="value"
                            stroke={isWinner ? "#10b981" : "#a855f7"}
                            fill={isWinner ? "#10b981" : "#a855f7"}
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Strengths */}
            <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Strengths</h4>
                <ul className="space-y-1.5">
                    {candidate.strengths.slice(0, 4).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {s}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Weaknesses</h4>
                <ul className="space-y-1.5">
                    {candidate.weaknesses.slice(0, 4).map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {w}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Risks */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Risks</h4>
                <ul className="space-y-1.5">
                    {candidate.risks.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                            {r}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
