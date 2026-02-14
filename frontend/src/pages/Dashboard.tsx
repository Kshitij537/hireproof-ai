import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import CandidateCard from "../components/ui/CandidateCard";
import type { Candidate } from "../types/candidate"; // Ensure this matches your project structure
import { getMockCandidate } from "../lib/mockData"; // Mock data util
import { getAuthSession } from "../lib/session";

export default function Dashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const session = getAuthSession();
    const isRecruiter = session?.role !== "candidate";

    useEffect(() => {
        // Basic loading from local storage, fallback to array with one mock for demo
        try {
            const stored = localStorage.getItem("candidates");
            if (stored) {
                setCandidates(JSON.parse(stored));
            } else {
                // Fallback: Create a list of mock candidates
                const mock1 = getMockCandidate();
                const mock2 = {
                    ...mock1,
                    id: "mock-2",
                    name: "Sarah Connor",
                    score: 92,
                    authenticityLevel: "High" as const
                };
                const mock3 = {
                    ...mock1,
                    id: "mock-3",
                    name: "John Doe",
                    score: 45,
                    authenticityLevel: "Low" as const
                };

                // Use these mocks if nothing in localStorage
                setCandidates([mock1, mock2, mock3]);
            }
        } catch {
            setCandidates([]);
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-auto h-screen relative">
                {/* Slight background gradient for the main area */}
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
                            <button
                                onClick={() => navigate("/scan")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Candidate
                            </button>
                        ) : null}
                    </div>

                    {/* Content */}
                    {candidates.length === 0 ? (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-3xl bg-white/[0.02]">
                            <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No candidates analyzed yet</h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                            {candidates.map((candidate) => (
                                <CandidateCard key={candidate.id} candidate={candidate} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
