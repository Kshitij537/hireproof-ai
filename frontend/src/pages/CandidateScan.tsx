import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../lib/api";
import { getMockCandidate } from "../lib/mockData";
import { getAuthSession } from "../lib/session";
import { supabase } from "../lib/supabase";
import type { Candidate } from "../types/candidate";

const LOADING_STEPS = [
    "Fetching URL content...",
    "Extracting technical signals...",
    "Building plotted report...",
];

export default function CandidateScan() {
    const navigate = useNavigate();
    const [profileUrl, setProfileUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState("");
    const [dots, setDots] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 2000);
        return () => clearInterval(interval);
    }, [loading]);

    const isValidUrl = (value: string): boolean => {
        try {
            const parsed = new URL(value.trim());
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    const handleAnalyze = async () => {
        setError("");

        if (!profileUrl.trim()) {
            setError("Please enter a valid URL.");
            return;
        }

        if (!isValidUrl(profileUrl)) {
            setError("Invalid URL. Use format: https://example.com/profile");
            return;
        }

        setLoading(true);
        setLoadingStep(0);

        try {
            const res = await fetch(`${API}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: profileUrl.trim() }),
            });

            if (!res.ok) throw new Error("API returned error");

            const candidate: Candidate = await res.json();
            localStorage.setItem("candidate", JSON.stringify(candidate));
            saveToCandidatesList(candidate);
            await trySupabaseInsert(candidate, profileUrl.trim());
            navigate(`/candidate/${candidate.id}`);
        } catch (err) {
            console.error("[CandidateScan] API failed:", err);
            setError("URL analysis failed. Using demo data.");

            const mock = getMockCandidate();
            localStorage.setItem("candidate", JSON.stringify(mock));
            saveToCandidatesList(mock);
            await trySupabaseInsert(mock, profileUrl.trim());

            setTimeout(() => {
                navigate(`/candidate/${mock.id}`);
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    /** Append to localStorage candidates array for immediate dashboard use */
    const saveToCandidatesList = (candidate: Candidate) => {
        try {
            const stored = localStorage.getItem("candidates");
            const list: Candidate[] = stored ? JSON.parse(stored) : [];
            if (!list.some((c) => c.id === candidate.id)) {
                list.unshift(candidate);
            }
            localStorage.setItem("candidates", JSON.stringify(list));
        } catch {
            // ignore
        }
    };

    /** Insert into Supabase only if recruiter, never blocks navigation */
    const trySupabaseInsert = async (candidate: Candidate, githubUrl: string) => {
        // Lock to prevent double insert from double-click or rerender
        if (isSaving) {
            console.log("[Supabase Insert] Already saving, skipping");
            return;
        }
        setIsSaving(true);

        try {
            // Check role from multiple sources
            const role =
                localStorage.getItem("hireproof_role") ||
                localStorage.getItem("authRole") ||
                getAuthSession()?.role;

            console.log("[Supabase Insert] Role detected:", role);

            if (role !== "recruiter") {
                console.log("[Supabase Insert] Skipping — not a recruiter");
                return;
            }

            // Get Supabase auth user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            const user = userData?.user;

            if (userError) {
                console.error("[Supabase Insert] getUser error:", userError.message);
            }

            if (!user) {
                console.error("[Supabase Insert] No Supabase user found — skipping insert");
                return;
            }

            console.log("[Supabase Insert] Attempt insert:", candidate.id);

            // Check for duplicate by github_url (not report_id) to prevent
            // re-scanning the same profile from creating a new row
            const { data: existing, error: dupError } = await supabase
                .from("candidates")
                .select("id")
                .eq("github_url", githubUrl)
                .eq("created_by", user.id)
                .maybeSingle();

            console.log("[Supabase Insert] Existing found:", existing);

            if (dupError) {
                console.error("[Supabase Insert] Duplicate check error:", dupError.message);
            }

            if (existing) {
                // Update existing row instead of inserting a duplicate
                console.log("[Supabase Insert] Candidate already exists, updating");
                const { error: updateError } = await supabase
                    .from("candidates")
                    .update({
                        name: candidate.name,
                        score: candidate.score,
                        authenticity_level: candidate.authenticityLevel,
                        report_id: candidate.id,
                    })
                    .eq("id", existing.id);

                if (updateError) {
                    console.error("[Supabase Insert] Update error:", updateError.message);
                } else {
                    console.log("[Supabase Insert] ✅ Candidate updated successfully!");
                }
                return;
            }

            const payload = {
                name: candidate.name,
                github_url: githubUrl,
                score: candidate.score,
                authenticity_level: candidate.authenticityLevel,
                report_id: candidate.id,
                created_by: user.id,
            };

            console.log("[Supabase Insert] Insert payload:", payload);

            const { error: insertError } = await supabase
                .from("candidates")
                .insert(payload);

            if (insertError) {
                console.error("[Supabase Insert] Insert error:", insertError.message, insertError);
            } else {
                console.log("[Supabase Insert] ✅ Candidate inserted successfully!");
            }
        } catch (err) {
            console.error("[Supabase Insert] Exception (non-blocking):", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                        <span className="text-white/60 font-light">AI</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Automated candidate intelligence</p>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
                    <h2 className="text-xl font-semibold text-white mb-1">Scan Candidate</h2>
                    <p className="text-white/40 text-sm mb-6">
                        Paste any portfolio, GitHub, or profile URL to generate an automated plotted report.
                    </p>

                    <div className="mb-4">
                        <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                            Profile URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-white/30"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M10.59 13.41a1.996 1.996 0 0 1 0-2.82l3.17-3.17a2 2 0 0 1 2.83 2.83l-1.58 1.58a1 1 0 1 0 1.41 1.41L18 11.66a4 4 0 0 0-5.66-5.66l-3.17 3.17a4 4 0 0 0 0 5.66 1 1 0 0 0 1.42-1.42zm2.82-2.82a1 1 0 0 0-1.41-1.41l-5.66 5.66a4 4 0 0 0 5.66 5.66l3.17-3.17a4 4 0 0 0 0-5.66 1 1 0 1 0-1.41 1.41 2 2 0 0 1 0 2.83l-3.17 3.17a2 2 0 0 1-2.83-2.83z" />
                                </svg>
                            </div>
                            <input
                                type="url"
                                value={profileUrl}
                                onChange={(e) => setProfileUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
                                placeholder="https://example.com/profile"
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                            Resume Upload <span className="text-white/25 normal-case">(optional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-white/[0.05] border border-white/[0.1] border-dashed rounded-xl text-white/40 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white/60 hover:file:bg-white/15 file:cursor-pointer cursor-pointer transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                            <svg
                                className="w-4 h-4 mt-0.5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="mb-4 px-4 py-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                            {LOADING_STEPS.map((step, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${i < loadingStep
                                        ? "text-green-400"
                                        : i === loadingStep
                                            ? "text-purple-300"
                                            : "text-white/20"
                                        } ${i > 0 ? "mt-2" : ""}`}
                                >
                                    {i < loadingStep ? (
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    ) : i === loadingStep ? (
                                        <div className="w-4 h-4 shrink-0 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <div className="w-4 h-4 shrink-0 rounded-full border border-white/15" />
                                    )}
                                    <span>
                                        {step}
                                        {i === loadingStep && <span className="text-purple-400">{dots}</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
                    >
                        {loading ? "Analyzing..." : "Analyze Candidate"}
                    </button>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">Powered by URL automation</p>
            </div>
        </div>
    );
}
