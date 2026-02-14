import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecruiterLogin } from './pages/RecruiterLogin';
import { CandidateLogin } from './pages/CandidateLogin';
import CandidateScan from "./pages/CandidateScan";
import CandidateReport from "./pages/CandidateReport";
import Dashboard from "./pages/Dashboard";

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">HireProof AI</h1>
        <div className="space-x-6">
          <a href="#features" className="text-gray-600 hover:text-indigo-600">
            Features
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-indigo-600">
            Pricing
          </a>
          <a href="/recruiter/login" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-10 py-20 text-center">
        <h2 className="text-5xl font-extrabold leading-tight">
          Stop Fake Skills.  
          <span className="text-indigo-600"> Hire with Proof.</span>
        </h2>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          HireProof AI analyzes real developer activity from GitHub and projects
          to calculate authenticity, skill depth, and hiring risk.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <a 
            href="/candidate/login"
            className="px-6 py-3 text-lg text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
          >
            Login as Candidate
          </a>
          <a 
            href="/recruiter/login"
            className="px-6 py-3 text-lg border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
          >
            Login as Recruiter
          </a>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gray-50 px-10 py-16">
        <h3 className="text-3xl font-bold text-center">The Hiring Problem</h3>
        <p className="mt-6 text-center text-gray-600 max-w-3xl mx-auto">
          Resumes are inflated. Projects are copied. Online profiles don't reflect
          real skill. Recruiters waste time interviewing candidates who look good
          on paper but lack depth.
        </p>
      </section>

      {/* Value Proposition */}
      <section id="features" className="px-10 py-20">
        <h3 className="text-3xl font-bold text-center">
          What HireProof AI Does
        </h3>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            title="Skill Authenticity Score"
            desc="AI-powered score (0–100) based on real contributions, originality, and consistency."
          />
          <Feature
            title="Candidate Ranking"
            desc="Automatically ranks candidates by skill match, experience, and hiring risk."
          />
          <Feature
            title="AI Interview Copilot"
            desc="Generates project-specific interview questions instantly."
          />
          <Feature
            title="Skill Radar Graph"
            desc="Visual breakdown of frontend, backend, DSA, system design & testing."
          />
          <Feature
            title="Hiring Risk Detection"
            desc="Flags fake skills, shallow projects, and inconsistent activity."
          />
          <Feature
            title="End-to-End Hiring"
            desc="From candidate analysis to interview and assessment generation."
          />
        </div>
      </section>

      {/* Screenshots Placeholder */}
      <section className="bg-gray-50 px-10 py-20 text-center">
        <h3 className="text-3xl font-bold">Product Preview</h3>
        <p className="mt-4 text-gray-600">
          Candidate reports, skill graphs, recruiter dashboard, and rankings.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center">
            Candidate Report
          </div>
          <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center">
            Recruiter Dashboard
          </div>
          <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center">
            Skill Radar Graph
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="px-10 py-20">
        <h3 className="text-3xl font-bold text-center">Pricing</h3>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <PriceCard title="Starter" price="Free" desc="Limited candidate scans" />
          <PriceCard title="Pro" price="₹999 / month" desc="Unlimited scans & reports" />
          <PriceCard
            title="Enterprise"
            price="Custom"
            desc="Advanced analytics & ATS integration"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-8 text-center">
        <p>© 2026 HireProof AI. Built for smarter hiring.</p>
      </footer>
    </div>
  );
}

/* Components */
function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-lg transition">
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="mt-3 text-gray-600">{desc}</p>
    </div>
  );
}

function PriceCard({
  title,
  price,
  desc,
}: {
  title: string;
  price: string;
  desc: string;
}) {
  return (
    <div className="p-8 border rounded-xl text-center hover:shadow-xl transition">
      <h4 className="text-2xl font-bold">{title}</h4>
      <p className="mt-4 text-3xl text-indigo-600">{price}</p>
      <p className="mt-4 text-gray-600">{desc}</p>
    </div>
  );
}

// Main App with Routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/scan" element={<CandidateScan />} />
        <Route path="/candidate/:id" element={<CandidateReport />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidate/dashboard" element={<Dashboard />} />
        <Route path="/recruiter/dashboard" element={<Dashboard />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
