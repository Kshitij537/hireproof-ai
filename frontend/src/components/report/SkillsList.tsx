import type { Skills } from "../../types/candidate";

interface Props {
    skills: Skills;
}

const SKILL_META: { key: keyof Skills; label: string; color: string }[] = [
    { key: "frontend", label: "Frontend", color: "from-purple-500 to-blue-500" },
    { key: "backend", label: "Backend", color: "from-blue-500 to-cyan-500" },
    { key: "dsa", label: "Data Structures & Algorithms", color: "from-cyan-500 to-emerald-500" },
    { key: "system", label: "System Design", color: "from-emerald-500 to-yellow-500" },
    { key: "testing", label: "Testing & QA", color: "from-yellow-500 to-orange-500" },
];

function getStrengthLabel(value: number): { label: string; color: string } {
    if (value >= 8) return { label: "Expert", color: "text-emerald-400" };
    if (value >= 6) return { label: "Strong", color: "text-blue-400" };
    if (value >= 4) return { label: "Medium", color: "text-amber-400" };
    if (value >= 2) return { label: "Developing", color: "text-orange-400" };
    return { label: "Weak", color: "text-red-400" };
}

export default function SkillsList({ skills }: Props) {
    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Detected Skills
            </h3>

            <div className="space-y-4">
                {SKILL_META.map(({ key, label, color }) => {
                    const value = skills[key] ?? 0;
                    const strength = getStrengthLabel(value);
                    const pct = (value / 10) * 100;

                    return (
                        <div key={key} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white/70">{label}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold ${strength.color}`}>{strength.label}</span>
                                    <span className="text-sm font-semibold text-white/80">{value}/10</span>
                                </div>
                            </div>
                            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
