import { useNavigate } from "react-router-dom";
import type { Candidate } from "../../types/candidate";
import ScoreBadge from "./ScoreBadge";

interface CandidateCardProps {
    candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
    const navigate = useNavigate();

    const riskColor =
        candidate.authenticityLevel === "High"
            ? "text-green-400 bg-green-500/10 border-green-500/20"
            : candidate.authenticityLevel === "Medium"
                ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20";

    return (
        <div className="group bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all hover:shadow-xl hover:shadow-black/20 relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-purple-500/20 transition-colors" />

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-white font-bold text-lg shadow-inner shadow-white/5">
                        {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg tracking-tight">{candidate.name}</h3>
                        <p className="text-white/40 text-xs mt-0.5 font-medium uppercase tracking-wide">
                            Analyzed {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <ScoreBadge score={candidate.score} />
            </div>

            <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${riskColor}`}>
                    {candidate.authenticityLevel} Authenticity
                </div>

                <button
                    onClick={() => navigate(`/candidate/${candidate.id}`)}
                    className="text-white/60 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors group/btn"
                >
                    View Report
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
