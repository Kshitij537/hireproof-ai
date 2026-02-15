import type { Candidate, Skills } from "../../types/candidate";

interface Props {
    candidate: Candidate;
}

const SKILL_LABELS: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    dsa: "DSA",
    system: "System Design",
    testing: "Testing",
    devops: "DevOps",
};

export default function VisualHighlightBadges({ candidate }: Props) {
    // Top verified skill — pick the highest from skills map
    const skills = candidate.skills;
    const topSkill = (Object.entries(skills) as [keyof Skills, number][])
        .filter(([, v]) => typeof v === "number")
        .sort((a, b) => b[1] - a[1])[0];
    const topSkillLabel = topSkill ? (SKILL_LABELS[topSkill[0]] ?? topSkill[0]) : "N/A";

    // Most active tech — pick top language from topRepos
    const repos = candidate.topRepos ?? [];
    const langCounts: Record<string, number> = {};
    for (const r of repos) {
        if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1;
    }
    const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];
    const topLangLabel = topLang ? topLang[0] : "TypeScript";

    return (
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl shadow-black/20">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Verified Highlights
            </h3>

            {/* Badge Row */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                    <span className="text-purple-400 text-sm">🏆</span>
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Top verified skill</p>
                        <p className="text-sm font-bold text-white">{topSkillLabel}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                    <span className="text-cyan-400 text-sm">⚡</span>
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Most active tech</p>
                        <p className="text-sm font-bold text-white">{topLangLabel}</p>
                    </div>
                </div>
            </div>

            {/* AI Explanation Text — sells the moat */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-xs text-white/40 leading-relaxed">
                    <span className="text-purple-400/70 font-semibold">How this score is generated: </span>
                    This score is generated using repository analysis, commit patterns, and project depth signals
                    to estimate real-world coding ability. Our engine evaluates code ownership, contribution frequency,
                    technology diversity, and AI-pattern risk to produce a holistic authenticity assessment.
                </p>
            </div>
        </div>
    );
}
