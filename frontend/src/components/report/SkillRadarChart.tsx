import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { Skills } from "../../types/candidate";

interface Props {
    skills: Skills;
}

const SKILL_MAP: { key: keyof Skills; label: string }[] = [
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "dsa", label: "DSA" },
    { key: "system", label: "System Design" },
    { key: "testing", label: "Testing" },
    { key: "devops", label: "DevOps" },
];

export default function SkillRadarChart({ skills }: Props) {
    const safeSkills = { ...skills, devops: skills.devops ?? 0 };
    const data = SKILL_MAP.map(({ key, label }) => ({
        skill: label,
        value: (safeSkills[key] ?? 0) * 10, // normalize 0-10 to 0-100
        fullMark: 100,
    }));

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
                Skill Radar
            </h3>
            <p className="text-[10px] text-white/30 mb-4 ml-7">Based on repo depth and commit activity</p>

            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                            tickCount={5}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(10,10,15,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "13px",
                            }}
                            formatter={(value: number | undefined) => [`${value ?? 0}%`, "Proficiency"]}
                            labelFormatter={(label) => `${String(label)} — repo depth & commit analysis`}
                        />
                        <Radar
                            name="Skills"
                            dataKey="value"
                            stroke="#a855f7"
                            fill="url(#radarGradient)"
                            fillOpacity={0.35}
                            strokeWidth={2}
                        />
                        <defs>
                            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

