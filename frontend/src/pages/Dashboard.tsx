import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { getAuthSession } from "../lib/session";
import { supabase } from "../lib/supabase";

interface DashboardCandidate {
    id: string;
    name: string;
    github_url: string;
    score: number;
    authenticity_level: string;
    report_id: string;
    created_by: string;
    created_at: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<DashboardCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = getAuthSession();
    const isRecruiter = session?.role !== "candidate";

    useEffect(() => {
        let cancelled = false;

        async function loadCandidates() {
            setLoading(true);
            setError(null);

            try {
                // Get current Supabase user
                const { data: userData, error: userError } = await supabase.auth.getUser();
                const user = userData?.user;

                if (userError) {
                    console.error("[Dashboard] getUser error:", userError.message);
                }

                console.log("[Dashboard] User ID:", user?.id ?? "none");

                if (!user?.id) {
                    console.log("[Dashboard] No Supabase user — showing empty state");
                    if (!cancelled) {
                        setCandidates([]);
                        setLoading(false);
                    }
                    return;
                }

                // Fetch candidates from Supabase
                const { data, error: fetchError } = await supabase
                    .from("candidates")
                    .select("*")
                    .eq("created_by", user.id)
                    .order("created_at", { ascending: false });

                console.log("[Dashboard] Fetched candidates:", data);
                console.log("[Dashboard] Error:", fetchError);

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

                if (!cancelled) {
                    setCandidates((data as DashboardCandidate[]) ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load candidates");
                    setCandidates([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCandidates();
        return () => {
            cancelled = true;
        };
    }, []);

    /** Extract GitHub username from URL for display */
    const getGithubUsername = (url: string): string => {
        try {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            return parts[0] || "-";
        } catch {
            return "-";
        }
    };

    /** Color badge for authenticity level */
    const levelColor = (level: string) => {
        switch (level) {
            case "High":
                return "text-green-400 bg-green-500/10 border border-green-500/20";
            case "Medium":
                return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
            default:
                return "text-red-400 bg-red-500/10 border border-red-500/20";
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-auto h-screen relative">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

                <div className="p-10 max-w-7xl mx-auto relative z-10">
                    {/* Top Navbar Area */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {isRecruiter ? "Recruiter Intelligence Dashboard" : "Candidate Intelligence Dashboard"}
                            </h2>
                            <p className="text-white/40 text-sm mt-1">Manage and track your analyzed candidates.</p>
                        </div>

                        {isRecruiter ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate("/compare")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                    Compare
                                </button>
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Candidate
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-white/[0.1] rounded-2xl bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-white/60 text-sm">Loading candidates...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-red-500/30 rounded-2xl bg-red-500/5">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    ) : candidates.length === 0 ? (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-3xl bg-white/[0.02]">
                            <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No candidates scanned yet</h3>
                            <p className="text-white/40 text-sm mb-6 max-w-xs text-center">
                                Scan a GitHub profile to get deep insights into a candidate's skills and authenticity.
                            </p>
                            {isRecruiter ? (
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white"
                                >
                                    Scan First Candidate
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden pb-2">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[920px] text-sm">
                                    <thead className="bg-white/[0.03] text-white/60">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium">Name</th>
                                            <th className="text-left px-4 py-3 font-medium">GitHub</th>
                                            <th className="text-left px-4 py-3 font-medium">Score</th>
                                            <th className="text-left px-4 py-3 font-medium">Level</th>
                                            <th className="text-left px-4 py-3 font-medium">Scanned</th>
                                            <th className="text-left px-4 py-3 font-medium">Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.map((c) => (
                                            <tr key={c.id} className="border-t border-white/[0.06] hover:bg-white/[0.03]">
                                                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                                                <td className="px-4 py-3 text-white/80">{getGithubUsername(c.github_url)}</td>
                                                <td className="px-4 py-3 text-white font-semibold">{c.score}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${levelColor(c.authenticity_level)}`}>
                                                        {c.authenticity_level}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-white/50 text-xs">
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => navigate(`/candidate/${c.report_id}`)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                                                    >
                                                        View Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
