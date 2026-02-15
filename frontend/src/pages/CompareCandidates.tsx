import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Candidate } from "../types/candidate";
import { getMockCandidate } from "../lib/mockData";
import CandidateSelector from "../components/compare/CandidateSelector";
import CandidateComparisonCard from "../components/compare/CandidateComparisonCard";
import ComparisonAIRecommendation from "../components/compare/ComparisonAIRecommendation";

export default function CompareCandidates() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedA, setSelectedA] = useState<string | null>(null);
    const [selectedB, setSelectedB] = useState<string | null>(null);

    useEffect(() => {
        // --- Prefill from candidate report Compare button ---
        let preselectedId: string | null = null;
        let prefilledCandidate: Candidate | null = null;
        try {
            const prefill = localStorage.getItem("compare_candidate_A");
            if (prefill) {
                prefilledCandidate = JSON.parse(prefill) as Candidate;
                preselectedId = prefilledCandidate.id;
                localStorage.removeItem("compare_candidate_A");
            }
        } catch {
            // ignore bad JSON
        }

        // --- Load candidate list ---
        let list: Candidate[] = [];
        try {
            const stored = localStorage.getItem("candidates");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    list = parsed;
                }
            }
        } catch {
            // ignore
        }

        if (list.length === 0) {
            // Fallback mock data
            const mock1 = getMockCandidate();
            const mock2 = {
                ...getMockCandidate(),
                id: "compare-mock-2",
                name: "Sarah Connor",
                score: 92,
                authenticityLevel: "High" as const,
                skills: { frontend: 9, backend: 7, dsa: 6, system: 5, testing: 8 },
                strengths: [
                    "Exceptional frontend architecture skills",
                    "Strong testing habits with high coverage",
                    "Active open-source contributor",
                    "Clean, well-documented code",
                ],
                weaknesses: [
                    "Limited system design experience",
                    "No DevOps or cloud exposure",
                ],
                risks: [
                    "May need training on distributed systems",
                ],
            };
            const mock3 = {
                ...getMockCandidate(),
                id: "compare-mock-3",
                name: "John Doe",
                score: 45,
                authenticityLevel: "Low" as const,
                skills: { frontend: 3, backend: 6, dsa: 4, system: 7, testing: 2 },
                strengths: [
                    "Good backend fundamentals",
                    "Experience with microservices",
                ],
                weaknesses: [
                    "Weak frontend skills",
                    "Minimal testing in projects",
                    "Inconsistent commit history",
                ],
                risks: [
                    "Questionable project originality",
                    "Low code contribution depth",
                ],
            };
            list = [mock1, mock2, mock3];
        }

        // Merge prefilled candidate into list if not already present
        if (prefilledCandidate && !list.some((c) => c.id === prefilledCandidate!.id)) {
            list = [prefilledCandidate, ...list];
        }

        setCandidates(list);

        // Auto-select Candidate A if prefilled
        if (preselectedId) {
            setSelectedA(preselectedId);
        }
    }, []);

    const candidateA = candidates.find((c) => c.id === selectedA) ?? null;
    const candidateB = candidates.find((c) => c.id === selectedB) ?? null;

    // Winner logic for card highlighting

    const winnerA = candidateA && candidateB ? candidateA.score > candidateB.score && Math.abs(candidateA.score - candidateB.score) > 10 : false;
    const winnerB = candidateA && candidateB ? candidateB.score > candidateA.score && Math.abs(candidateA.score - candidateB.score) > 10 : false;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06]">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <h1 className="text-xl font-bold text-white tracking-tight">
                    Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                    <span className="text-white/60 font-light">AI</span>
                </h1>

                <div className="w-20" />
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10">
                {/* Title */}
                <div className="text-center mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400/80 mb-2">
                        Recruiter Intelligence
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                        Compare Candidates
                    </h2>
                    <p className="text-white/40 text-sm mt-2 max-w-md mx-auto">
                        Select two candidates below to see a full side-by-side comparison of skills, strengths, and risks.
                    </p>
                </div>

                {/* Selectors */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <CandidateSelector
                        label="Candidate A"
                        candidates={candidates}
                        selectedId={selectedA}
                        onSelect={setSelectedA}
                        disabledId={selectedB}
                    />

                    <div className="hidden md:flex items-end pb-3">
                        <span className="text-white/20 text-xl font-bold">VS</span>
                    </div>

                    <CandidateSelector
                        label="Candidate B"
                        candidates={candidates}
                        selectedId={selectedB}
                        onSelect={setSelectedB}
                        disabledId={selectedA}
                    />
                </div>

                {/* Comparison Area */}
                {candidateA && candidateB ? (
                    <>
                        <div className="flex flex-col lg:flex-row gap-6 mb-8">
                            <CandidateComparisonCard candidate={candidateA} isWinner={winnerA} />
                            <CandidateComparisonCard candidate={candidateB} isWinner={winnerB} />
                        </div>

                        {/* AI Hiring Recommendation */}
                        <ComparisonAIRecommendation candidateA={candidateA} candidateB={candidateB} />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                        </div>
                        <p className="text-white/30 text-sm">Select two candidates above to start comparing.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-8 border-t border-white/[0.06]">
                <p className="text-white/20 text-xs tracking-wider">
                    Powered by <span className="text-white/30 font-medium">HireProof AI</span> · Intelligence you can trust
                </p>
            </footer>
        </div>
    );
}
