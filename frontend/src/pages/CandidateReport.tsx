import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Candidate } from "../types/candidate";
import { API } from "../lib/api";

// Report sections
import CandidateHeader from "../components/report/CandidateHeader";
import AuthenticityScoreCard from "../components/report/AuthenticityScoreCard";
import SkillRadarChart from "../components/report/SkillRadarChart";
import SkillsList from "../components/report/SkillsList";
import ContributionCard from "../components/report/ContributionCard";
import RiskCard from "../components/report/RiskCard";
import StrengthWeakness from "../components/report/StrengthWeakness";
import TimelineChart from "../components/report/TimelineChart";
import InterviewSection from "../components/report/InterviewSection";
import AssessmentSection from "../components/report/AssessmentSection";
import RecruiterActions from "../components/report/RecruiterActions";

/* ── Loading Skeleton ── */
function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-white/[0.03] rounded-2xl border border-white/[0.06] animate-pulse ${className}`} />
    );
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-8">
                <SkeletonBlock className="h-48" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonBlock className="h-72" />
                    <SkeletonBlock className="h-72" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonBlock className="h-64" />
                    <SkeletonBlock className="h-64" />
                </div>
                <SkeletonBlock className="h-40" />
                <SkeletonBlock className="h-52" />
                <SkeletonBlock className="h-32" />
            </div>
        </div>
    );
}

/* ── Error State ── */
function ErrorState({ onBack }: { onBack: () => void }) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Candidate not found</h2>
                <p className="text-white/40 text-sm mb-8">The candidate report could not be loaded.</p>
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
                >
                    Go to Scan
                </button>
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function CandidateReport() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchCandidate() {
            setLoading(true);
            setError(false);

            // 1. Try fetching from backend API
            if (id) {
                try {
                    const res = await fetch(`${API}/candidate/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (!cancelled) {
                            setCandidate(data);
                            setLoading(false);
                            return;
                        }
                    }
                } catch {
                    // API failed, try localStorage fallback
                }
            }

            // 2. Fallback to localStorage
            try {
                const raw = localStorage.getItem("candidate");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (!cancelled) {
                        setCandidate(parsed);
                        setLoading(false);
                        return;
                    }
                }
            } catch {
                // localStorage also failed
            }

            if (!cancelled) {
                setError(true);
                setLoading(false);
            }
        }

        fetchCandidate();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) return <LoadingSkeleton />;
    if (error || !candidate) return <ErrorState onBack={() => navigate("/scan")} />;

    const riskLevel: "Low" | "Medium" | "High" =
        candidate.riskLevel ?? (candidate.score > 75 ? "Low" : candidate.score >= 45 ? "Medium" : "High");

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
            {/* Background blurs */}
            <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Bar */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06]">
                <button
                    onClick={() => navigate("/scan")}
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

                <div className="w-20" /> {/* Spacer for centering */}
            </header>

            {/* Report Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 space-y-8">
                {/* 1. Header Hero */}
                <CandidateHeader candidate={candidate} />

                {/* 2. Score Card + 3. Radar Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuthenticityScoreCard
                        score={candidate.score}
                        riskLevel={riskLevel}
                        authenticityLevel={candidate.authenticityLevel}
                    />
                    <SkillRadarChart skills={candidate.skills} />
                </div>

                {/* 4. Skills List + 5. Contribution Depth */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkillsList skills={candidate.skills} />
                    <ContributionCard
                        monitoring={candidate.githubMonitoring}
                        score={candidate.score}
                    />
                </div>

                {/* 6. AI Risk Card */}
                <RiskCard score={candidate.score} aiRisk={candidate.aiRisk} />

                {/* 6.1 Analysis Table */}
                <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.08]">
                        <h3 className="text-lg font-semibold text-white">Analysis Table</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-sm">
                            <thead className="bg-white/[0.03] text-white/60">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">Metric</th>
                                    <th className="text-left px-4 py-3 font-medium">Value</th>
                                    <th className="text-left px-4 py-3 font-medium">Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Candidate</td>
                                    <td className="px-4 py-3 text-white">{candidate.name}</td>
                                    <td className="px-4 py-3 text-white/50">Profile</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Authenticity Score</td>
                                    <td className="px-4 py-3 text-white">{candidate.score}</td>
                                    <td className="px-4 py-3 text-white/50">Computed</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Authenticity Level</td>
                                    <td className="px-4 py-3 text-white">{candidate.authenticityLevel}</td>
                                    <td className="px-4 py-3 text-white/50">Computed</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">GitHub Username</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.username ?? "-"}</td>
                                    <td className="px-4 py-3 text-white/50">GitHub</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Repos</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.repoCount ?? 0}</td>
                                    <td className="px-4 py-3 text-white/50">GitHub API</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Commits (30d)</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.totalCommits ?? 0}</td>
                                    <td className="px-4 py-3 text-white/50">GitHub Events API</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Consistency</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.contributionConsistency ?? 0}%</td>
                                    <td className="px-4 py-3 text-white/50">Computed</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Complexity</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.complexityScore ?? 0}%</td>
                                    <td className="px-4 py-3 text-white/50">Computed</td>
                                </tr>
                                <tr className="border-t border-white/[0.06]">
                                    <td className="px-4 py-3 text-white/80">Collaboration</td>
                                    <td className="px-4 py-3 text-white">{candidate.githubMonitoring?.collaborationScore ?? 0}%</td>
                                    <td className="px-4 py-3 text-white/50">Computed</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 7. Strengths & Weaknesses */}
                <StrengthWeakness
                    strengths={candidate.strengths}
                    weaknesses={candidate.weaknesses}
                />

                {/* 8. Activity Timeline */}
                <TimelineChart data={candidate.commitTimeline} />

                {/* 9. Interview Copilot */}
                <InterviewSection
                    questions={candidate.questions}
                    candidateData={{
                        name: candidate.name,
                        skills: Object.keys(candidate.skills || {}),
                        score: candidate.score,
                        strengths: candidate.strengths,
                        weaknesses: candidate.weaknesses,
                    }}
                />

                {/* 10. Assessment Generator */}
                <AssessmentSection />

                {/* 11. Recruiter Actions */}
                <RecruiterActions />
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-10 border-t border-white/[0.06]">
                <p className="text-white/20 text-xs tracking-wider">
                    Powered by <span className="text-white/30 font-medium">HireProof AI</span> · Intelligence you can trust
                </p>
            </footer>
        </div>
    );
}
