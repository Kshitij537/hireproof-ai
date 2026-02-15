import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Candidate, Skills, TopRepo } from "../types/candidate";
import { API } from "../lib/api";

// Existing report sections
import InterviewSection from "../components/report/InterviewSection";
import AssessmentSection from "../components/report/AssessmentSection";

/* ═══════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════ */
function extractUsername(c: Candidate): string {
    if (c.githubProfile?.login) return c.githubProfile.login;
    if (c.githubMonitoring?.username) return c.githubMonitoring.username;
    try {
        return new URL(c.profileUrl).pathname.split("/").filter(Boolean)[0] || "unknown";
    } catch {
        return "unknown";
    }
}

function riskLabel(score: number): string {
    return score > 70 ? "Low Risk" : score >= 40 ? "Medium Risk" : "High Risk";
}

function riskColor(score: number) {
    if (score > 70) return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", ring: "#34d399" };
    if (score >= 40) return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", ring: "#fbbf24" };
    return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", ring: "#f87171" };
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
}

function langColor(lang: string): string {
    const map: Record<string, string> = {
        TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5", Java: "#b07219",
        Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d", C: "#555555", Ruby: "#701516",
        PHP: "#4F5D95", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Dart: "#00B4AB",
        Kotlin: "#A97BFF", Swift: "#F05138", Vue: "#41b883", Svelte: "#ff3e00",
    };
    return map[lang] ?? "#8b8b8b";
}

/* ═══════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════ */
function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-6">
                <div className="h-56 bg-white/[0.03] rounded-2xl border border-white/[0.06] animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-white/[0.03] rounded-2xl border border-white/[0.06] animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-72 bg-white/[0.03] rounded-2xl border border-white/[0.06] animate-pulse" />
                    <div className="h-72 bg-white/[0.03] rounded-2xl border border-white/[0.06] animate-pulse" />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   ERROR STATE
   ═══════════════════════════════════════ */
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
                <button onClick={onBack} className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer">
                    Go to Scan
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   1. GITHUB PROFILE HEADER
   ═══════════════════════════════════════ */
function ProfileHeader({ c }: { c: Candidate }) {
    const username = extractUsername(c);
    const rc = riskColor(c.score);
    const profile = c.githubProfile;
    const avatarUrl = profile?.avatar_url ?? `https://github.com/${username}.png`;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/6 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 p-8 md:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400/70 mb-6">Recruiter Intelligence Report</p>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-20 h-20 rounded-2xl border-2 border-white/10 shadow-xl shadow-black/30"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white truncate">
                            {profile?.name || c.name}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap text-sm">
                            <a href={profile?.html_url || c.profileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                @{username}
                            </a>
                            {profile?.followers !== undefined && (
                                <>
                                    <span className="text-white/15">·</span>
                                    <span className="text-white/40">{profile.followers} followers</span>
                                </>
                            )}
                            {profile?.public_repos !== undefined && (
                                <>
                                    <span className="text-white/15">·</span>
                                    <span className="text-white/40">{profile.public_repos} repos</span>
                                </>
                            )}
                        </div>
                        {profile?.bio && (
                            <p className="text-white/35 text-sm leading-relaxed max-w-xl">{profile.bio}</p>
                        )}
                    </div>

                    {/* Score + Badge */}
                    <div className="flex items-center gap-5 shrink-0">
                        <div className="text-center">
                            <span className="text-5xl font-extrabold bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">{c.score}</span>
                            <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mt-1">Authenticity</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${rc.bg} ${rc.text} ${rc.border}`}>
                                {riskLabel(c.score)}
                            </span>
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${c.authenticityLevel === "High" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                                    c.authenticityLevel === "Medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                                        "bg-red-500/15 text-red-400 border-red-500/30"
                                }`}>
                                {c.authenticityLevel} Auth
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   2. REPOSITORY INSIGHTS — STAT CARDS
   ═══════════════════════════════════════ */
function RepoInsights({ c }: { c: Candidate }) {
    const repos = c.topRepos ?? [];
    const totalStars = repos.reduce((s, r) => s + r.stars, 0);
    const mostStarred = repos.length > 0 ? repos.reduce((a, b) => a.stars > b.stars ? a : b) : null;
    const lastActive = repos.length > 0 ? repos.reduce((a, b) => new Date(a.lastUpdated) > new Date(b.lastUpdated) ? a : b) : null;

    const stats = [
        { label: "Total Repos", value: c.githubMonitoring?.repoCount ?? c.githubProfile?.public_repos ?? 0, icon: "📦" },
        { label: "Total Stars", value: totalStars, icon: "⭐" },
        { label: "Most Starred", value: mostStarred?.name ?? "-", icon: "🏆", sub: mostStarred ? `${mostStarred.stars} ⭐` : undefined },
        { label: "Last Active", value: lastActive ? timeAgo(lastActive.lastUpdated) : "-", icon: "🕐" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
                    <span className="text-lg">{s.icon}</span>
                    <p className="mt-3 text-xl font-bold text-white truncate">{s.value}</p>
                    <p className="text-[11px] text-white/35 font-medium uppercase tracking-wider mt-1">{s.label}</p>
                    {s.sub && <p className="text-[11px] text-amber-400/70 mt-0.5">{s.sub}</p>}
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   3. LANGUAGE / SKILL CHART
   ═══════════════════════════════════════ */
function SkillChart({ skills }: { skills: Skills }) {
    const entries = (Object.entries(skills) as [string, number][]).sort((a, b) => b[1] - a[1]);
    const labels: Record<string, string> = { frontend: "Frontend", backend: "Backend", dsa: "DSA", system: "System Design", testing: "Testing" };
    const colors: Record<string, string> = { frontend: "#a78bfa", backend: "#60a5fa", dsa: "#f472b6", system: "#34d399", testing: "#fbbf24" };

    return (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                Skill Breakdown
            </h3>
            <div className="space-y-4">
                {entries.map(([key, val]) => (
                    <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-white/60 font-medium">{labels[key] ?? key}</span>
                            <span className="text-xs text-white/40">{val}/10</span>
                        </div>
                        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${val * 10}%`, backgroundColor: colors[key] ?? "#8b8b8b" }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   4. TOP REPOSITORIES LIST
   ═══════════════════════════════════════ */
function TopReposList({ repos }: { repos: TopRepo[] }) {
    if (!repos || repos.length === 0) return null;

    return (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                Top Repositories
            </h3>
            <div className="space-y-3">
                {repos.map((repo, i) => (
                    <a
                        key={i}
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate">{repo.name}</span>
                                    {repo.language && (
                                        <span className="flex items-center gap-1 text-[10px] text-white/40 shrink-0">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor(repo.language) }} />
                                            {repo.language}
                                        </span>
                                    )}
                                </div>
                                {repo.description && (
                                    <p className="text-xs text-white/30 truncate">{repo.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-amber-400/70 text-xs shrink-0">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                {repo.stars}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   5. AUTHENTICITY SCORE CARD (detailed)
   ═══════════════════════════════════════ */
function AuthenticityCard({ c }: { c: Candidate }) {
    const rc = riskColor(c.score);
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference - (c.score / 100) * circumference;

    return (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Authenticity Score
            </h3>

            <div className="flex items-center gap-8">
                {/* Ring */}
                <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                        <circle
                            cx="60" cy="60" r="54" fill="none"
                            stroke={rc.ring}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{c.score}</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">/ 100</span>
                    </div>
                </div>

                {/* Explanation */}
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${rc.bg} ${rc.text} ${rc.border} border`}>{riskLabel(c.score)}</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${c.authenticityLevel === "High" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                                c.authenticityLevel === "Medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                                    "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}>{c.authenticityLevel} Authenticity</span>
                    </div>

                    <div className="space-y-1.5">
                        {c.strengths.slice(0, 3).map((s, i) => (
                            <p key={i} className="text-xs text-white/35 flex items-start gap-1.5">
                                <span className="text-emerald-400/60 mt-0.5">✓</span> {s}
                            </p>
                        ))}
                    </div>

                    {c.risks.length > 0 && (
                        <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                            {c.risks.slice(0, 2).map((r, i) => (
                                <p key={i} className="text-xs text-red-400/50 flex items-start gap-1.5">
                                    <span className="mt-0.5">⚠</span> {r}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   6. RECRUITER ACTIONS
   ═══════════════════════════════════════ */
function RecruiterActionBar() {
    const [shortlisted, setShortlisted] = useState(false);
    const [toast, setToast] = useState("");

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

    return (
        <>
            {/* Toast */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 px-5 py-3.5 bg-purple-500/15 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl">
                    <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-purple-300 text-sm font-medium">{toast}</span>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    Recruiter Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => { setShortlisted(true); showToast("Candidate shortlisted!"); }}
                        disabled={shortlisted}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${shortlisted
                                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-emerald-500/25"
                            }`}
                    >
                        {shortlisted ? "✓ Shortlisted" : "⭐ Shortlist"}
                    </button>
                    <button onClick={() => showToast("Compare feature coming soon!")} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/[0.1] text-white/70 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer">
                        ⚖️ Compare
                    </button>
                    <button onClick={() => showToast("Report exported!")} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/[0.1] text-white/70 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer">
                        📄 Export
                    </button>
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   STRENGTHS & WEAKNESSES
   ═══════════════════════════════════════ */
function StrengthsWeaknesses({ strengths, weaknesses }: { strengths: string[]; weaknesses: string[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-emerald-500/10 p-5">
                <h4 className="text-sm font-semibold text-emerald-400 mb-3">✓ Strengths</h4>
                <ul className="space-y-2">
                    {strengths.map((s, i) => (
                        <li key={i} className="text-xs text-white/40 leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-400/50 mt-0.5 shrink-0">•</span> {s}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-amber-500/10 p-5">
                <h4 className="text-sm font-semibold text-amber-400 mb-3">⚡ Areas for Improvement</h4>
                <ul className="space-y-2">
                    {weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-white/40 leading-relaxed flex items-start gap-2">
                            <span className="text-amber-400/50 mt-0.5 shrink-0">•</span> {w}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
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

            if (id) {
                try {
                    const res = await fetch(`${API}/candidate/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (!cancelled) { setCandidate(data); setLoading(false); return; }
                    }
                } catch { /* fallback below */ }
            }

            try {
                const raw = localStorage.getItem("candidate");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (!cancelled) { setCandidate(parsed); setLoading(false); return; }
                }
            } catch { /* nothing */ }

            if (!cancelled) { setError(true); setLoading(false); }
        }

        fetchCandidate();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) return <LoadingSkeleton />;
    if (error || !candidate) return <ErrorState onBack={() => navigate("/scan")} />;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
            {/* Background blurs */}
            <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px] pointer-events-none" />

            {/* Header Bar */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06]">
                <button onClick={() => navigate("/scan")} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    <span className="text-sm font-medium">Back</span>
                </button>
                <h1 className="text-xl font-bold text-white tracking-tight">
                    Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                    <span className="text-white/60 font-light">AI</span>
                </h1>
                <div className="w-20" />
            </header>

            {/* Report Content */}
            <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-6">
                {/* 1. GitHub Profile Header */}
                <ProfileHeader c={candidate} />

                {/* 2. Repository Insights */}
                <RepoInsights c={candidate} />

                {/* 3. Skill Chart  +  5. Authenticity Score */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkillChart skills={candidate.skills} />
                    <AuthenticityCard c={candidate} />
                </div>

                {/* 4. Top Repositories */}
                <TopReposList repos={candidate.topRepos ?? []} />

                {/* Strengths & Weaknesses */}
                <StrengthsWeaknesses strengths={candidate.strengths} weaknesses={candidate.weaknesses} />

                {/* 6. Recruiter Actions */}
                <RecruiterActionBar />

                {/* AI Interview Questions */}
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

                {/* AI Hiring Test */}
                <AssessmentSection
                    candidateData={{
                        name: candidate.name,
                        skills: Object.keys(candidate.skills || {}),
                        score: candidate.score,
                        strengths: candidate.strengths,
                        weaknesses: candidate.weaknesses,
                    }}
                />
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
