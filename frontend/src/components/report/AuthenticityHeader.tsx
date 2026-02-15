import type { Candidate } from "../../types/candidate";

interface Props {
    candidate: Candidate;
}

export default function AuthenticityHeader({ candidate }: Props) {
    const score = candidate.score;
    const confidence = score > 75 ? "High" : score >= 45 ? "Medium" : "Low";
    const confColor =
        confidence === "High"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : confidence === "Medium"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-red-500/15 text-red-400 border-red-500/30";
    const scoreColor =
        score > 75 ? "from-emerald-400 to-cyan-400" : score >= 45 ? "from-amber-400 to-orange-400" : "from-red-400 to-pink-400";

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-32 bg-cyan-500/8 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left — Score */}
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/[0.1] flex items-center justify-center">
                                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">Authenticity Score</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-extrabold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                                    {score}
                                </span>
                                <span className="text-lg text-white/20 font-medium">/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${confColor}`}>
                            Confidence: {confidence}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verified via GitHub behavior analysis
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
