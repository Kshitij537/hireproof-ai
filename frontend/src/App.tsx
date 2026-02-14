import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecruiterLogin } from './pages/RecruiterLogin';
import { CandidateLogin } from './pages/CandidateLogin';
import CandidateScan from "./pages/CandidateScan";
import CandidateReport from "./pages/CandidateReport";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CandidateHome from "./pages/CandidateHome";
import CandidateAnalysis from "./pages/Candidateanalysis"; // ADD THIS IMPORT
import CompareCandidates from "./pages/CompareCandidates";
import AuthGuard from "./components/AuthGuard";
import { getAuthSession } from "./lib/session";
import AuthCallback from "./pages/AuthCallback";

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">HireProof AI</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="hidden sm:inline text-sm text-white/50 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hidden sm:inline text-sm text-white/50 hover:text-white transition-colors">
            Pricing
          </a>
          <a
            href="/recruiter/login"
            className="px-4 py-2 text-sm font-semibold bg-white/[0.07] border border-white/10 rounded-lg hover:bg-white/[0.12] transition-all"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-40 left-1/2 w-56 h-56 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/60">AI-Powered Hiring Intelligence</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="block text-white">Stop Fake Skills.</span>
            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Hire with Proof.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 md:mt-8 max-w-2xl mx-auto text-base md:text-lg text-white/40 leading-relaxed">
            HireProof AI analyzes real developer activity from GitHub and projects to calculate
            authenticity, skill depth, and hiring risk — so you never make a bad hire again.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/candidate/login"
              className="group relative w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                Login as Candidate
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
            <a
              href="/recruiter/login"
              className="group w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] hover:border-white/20 transition-all active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                Login as Recruiter
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <TrustBadge icon="🔒" label="Secure by Design" />
            <TrustBadge icon="⚡" label="Real-time Analysis" />
            <TrustBadge icon="🎯" label="98% Accuracy" />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative px-6 md:px-10 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400/60">The Problem</span>
          <h3 className="mt-4 text-3xl md:text-4xl font-bold text-white">Hiring is Broken</h3>
          <p className="mt-6 text-white/40 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Resumes are inflated. Projects are copied. Online profiles don't reflect real skill.
            Recruiters waste time interviewing candidates who look good on paper but lack real depth.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProblemCard emoji="📄" title="Inflated Resumes" desc="60% of resumes contain exaggerated skills" />
            <ProblemCard emoji="🔄" title="Copied Projects" desc="Cloned repos mask lack of real experience" />
            <ProblemCard emoji="⏰" title="Wasted Time" desc="Interviewers spend hours on unqualified candidates" />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="features" className="px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400/60">Features</span>
            <h3 className="mt-4 text-3xl md:text-4xl font-bold text-white">What HireProof AI Does</h3>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              End-to-end hiring intelligence powered by AI and real developer data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
              title="Skill Authenticity Score"
              desc="AI-powered score (0–100) based on real contributions, code originality, and consistency."
              color="text-purple-400"
              borderColor="border-purple-500/20"
            />
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
              title="Candidate Ranking"
              desc="Automatically ranks candidates by skill match, experience depth, and hiring risk."
              color="text-blue-400"
              borderColor="border-blue-500/20"
            />
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>}
              title="AI Interview Copilot"
              desc="Generates project-specific interview questions and hiring tests instantly."
              color="text-cyan-400"
              borderColor="border-cyan-500/20"
            />
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>}
              title="Skill Radar Graph"
              desc="Visual breakdown of frontend, backend, DSA, system design & testing."
              color="text-emerald-400"
              borderColor="border-emerald-500/20"
            />
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
              title="Hiring Risk Detection"
              desc="Flags fake skills, shallow projects, bot activity, and inconsistent patterns."
              color="text-amber-400"
              borderColor="border-amber-500/20"
            />
            <FeatureCard
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>}
              title="End-to-End Hiring"
              desc="From candidate analysis to AI-generated interview questions and assessments."
              color="text-pink-400"
              borderColor="border-pink-500/20"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-10 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/60">Pricing</span>
            <h3 className="mt-4 text-3xl md:text-4xl font-bold text-white">Simple, Transparent Pricing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PriceCard title="Starter" price="Free" desc="5 candidate scans per month" />
            <PriceCard title="Pro" price="₹999/mo" desc="Unlimited scans & reports" highlight />
            <PriceCard title="Enterprise" price="Custom" desc="Advanced analytics & ATS integration" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20">
        <div className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/[0.08] p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white">Ready to hire smarter?</h3>
            <p className="mt-4 text-white/40 max-w-lg mx-auto">
              Join recruiters who verify real skills before the interview.
            </p>
            <a
              href="/recruiter/login"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 active:scale-[0.98]"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 md:px-10 py-10 text-center">
        <p className="text-white/20 text-xs tracking-wider">
          © 2026 <span className="text-white/30 font-medium">HireProof AI</span> · Built for smarter hiring
        </p>
      </footer>
    </div>
  );
}

/* Sub-components */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-white/30 text-sm">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ProblemCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-red-500/10 text-left">
      <span className="text-2xl">{emoji}</span>
      <h4 className="mt-3 text-sm font-semibold text-white">{title}</h4>
      <p className="mt-1 text-xs text-white/40">{desc}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
  borderColor,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  borderColor: string;
}) {
  return (
    <div className={`group p-5 rounded-2xl bg-white/[0.02] border ${borderColor} hover:bg-white/[0.05] transition-all`}>
      <div className={`w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center ${color} mb-4`}>
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-2 text-xs text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function PriceCard({
  title,
  price,
  desc,
  highlight,
}: {
  title: string;
  price: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-2xl text-center transition-all ${highlight
          ? "bg-gradient-to-b from-purple-500/10 to-blue-500/5 border-2 border-purple-500/30 shadow-lg shadow-purple-500/5"
          : "bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]"
        }`}
    >
      {highlight && (
        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-4">
          Popular
        </span>
      )}
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className={`mt-3 text-3xl font-extrabold ${highlight ? "text-purple-300" : "text-white"}`}>{price}</p>
      <p className="mt-3 text-sm text-white/40">{desc}</p>
      <a
        href="/recruiter/login"
        className={`inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${highlight
            ? "bg-white text-black hover:bg-gray-100"
            : "bg-white/[0.07] border border-white/10 text-white hover:bg-white/[0.12]"
          }`}
      >
        Get Started
      </a>
    </div>
  );
}

// Main App with Routing
export default function App() {
  const session = getAuthSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <Navigate
              to={session?.role === "candidate" ? "/candidate/home" : "/recruiter/dashboard"}
              replace
            />
          }
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/dashboard"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/home"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <CandidateHome />
            </AuthGuard>
          }
        />
        {/* ADD THIS NEW ROUTE FOR ANALYSIS */}
        <Route
          path="/analysis"
          element={
            <AuthGuard allowedRoles={["candidate"]}>
              <CandidateAnalysis />
            </AuthGuard>
          }
        />
        <Route
          path="/scan"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <CandidateScan />
            </AuthGuard>
          }
        />
        <Route
          path="/candidate/:id"
          element={
            <AuthGuard allowedRoles={["recruiter", "candidate"]}>
              <CandidateReport />
            </AuthGuard>
          }
        />
        <Route
          path="/compare"
          element={
            <AuthGuard allowedRoles={["recruiter"]}>
              <CompareCandidates />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard allowedRoles={["recruiter", "candidate"]}>
              <Profile />
            </AuthGuard>
          }
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}