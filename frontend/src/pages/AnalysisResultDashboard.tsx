import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';

// TypeScript interfaces
interface Skill {
  name: string;
  confidence: number;
  verified: boolean;
}

interface Project {
  name: string;
  technologies: string[];
  confidence: number;
  authenticity: string;
}

interface AnalysisResult {
  authenticityScore: number;
  confidenceLevel: string;
  recommendation: string;
  skills: Skill[];
  projects: Project[];
  risks: string[];
  roleMatchScore: number;
  summary: string;
}

// Mock data - embedded directly in frontend
const mockAnalysisData: AnalysisResult = {
  authenticityScore: 85,
  confidenceLevel: "High",
  recommendation: "SHORTLIST",
  skills: [
    {
      name: "React",
      confidence: 92,
      verified: true
    },
    {
      name: "Node.js",
      confidence: 85,
      verified: true
    },
    {
      name: "TypeScript",
      confidence: 88,
      verified: true
    },
    {
      name: "MongoDB",
      confidence: 78,
      verified: true
    },
    {
      name: "Machine Learning",
      confidence: 60,
      verified: false
    },
    {
      name: "AWS",
      confidence: 55,
      verified: false
    }
  ],
  projects: [
    {
      name: "Canteen Management System",
      technologies: ["React", "Node.js", "MongoDB"],
      confidence: 90,
      authenticity: "High"
    },
    {
      name: "E-Commerce Platform",
      technologies: ["React", "Express", "PostgreSQL"],
      confidence: 87,
      authenticity: "High"
    },
    {
      name: "Task Management App",
      technologies: ["TypeScript", "Node.js", "Redis"],
      confidence: 82,
      authenticity: "Medium"
    }
  ],
  risks: [
    "Machine Learning skill not strongly verified",
    "AWS experience claims need validation"
  ],
  roleMatchScore: 88,
  summary: "Candidate demonstrates strong backend and frontend skills with real project evidence. The profile shows consistent commit history and well-documented projects. Technical skills align well with modern web development practices."
};

export default function AnalysisResultDashboard() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAnalysisResult();
  }, []);

  const fetchAnalysisResult = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Try to fetch from backend first
      try {
        const response = await fetch('http://localhost:5000/api/analysis-result', {
          signal: AbortSignal.timeout(2000) // 2 second timeout
        });
        
        if (response.ok) {
          const result: AnalysisResult = await response.json();
          setData(result);
          console.log("✅ Loaded data from backend");
          return;
        }
      } catch (backendError) {
        console.log("⚠️ Backend not available, using mock data");
      }
      
      // Fallback to mock data if backend is not available
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
      setData(mockAnalysisData);
      console.log("✅ Loaded mock data");
      
    } catch (err) {
      console.error('Error fetching analysis result:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    return 'from-red-500/20 to-pink-500/20 border-red-500/30';
  };

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'SHORTLIST':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REVIEW':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'REJECT':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={fetchAnalysisResult}
              className="px-6 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/60">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-white">Resume Analysis Dashboard</h1>
              <p className="text-white/50">AI-powered authenticity and skill verification report</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* SECTION 1: Authenticity Score */}
              <div className={`rounded-2xl border bg-gradient-to-br ${getScoreBgColor(data.authenticityScore)} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Authenticity Score</h3>
                  <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-6xl font-bold ${getScoreColor(data.authenticityScore)}`}>
                    {data.authenticityScore}
                  </span>
                  <span className="text-2xl text-white/40 mb-2">/100</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Confidence: <span className="font-semibold text-white">{data.confidenceLevel}</span>
                </p>
              </div>

              {/* SECTION 2: Recommendation Badge */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Recommendation</h3>
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border ${getRecommendationStyle(data.recommendation)} text-xl font-bold`}>
                  {data.recommendation === 'SHORTLIST' && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {data.recommendation}
                </div>
                <p className="mt-4 text-sm text-white/60">
                  Based on comprehensive skill verification and project authenticity analysis
                </p>
              </div>

              {/* SECTION 3: Role Match */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Role Match</h3>
                  <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-bold text-purple-400">{data.roleMatchScore}</span>
                  <span className="text-2xl text-white/40 mb-2">%</span>
                </div>
                <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.roleMatchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Skills List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                Skills Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                      {skill.verified ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Confidence</span>
                        <span className={`font-semibold ${getScoreColor(skill.confidence)}`}>
                          {skill.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            skill.verified ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${skill.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Projects */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{project.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {project.confidence}%
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          project.authenticity === 'High'
                            ? 'bg-green-500/20 text-green-400'
                            : project.authenticity === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {project.authenticity} Authenticity
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 6: Risk Flags */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Risk Flags
                </h2>
                {data.risks.length > 0 ? (
                  <ul className="space-y-3">
                    {data.risks.map((risk, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
                      >
                        <svg className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <span className="text-white/80">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 font-semibold">No risks detected</p>
                    <p className="text-white/40 text-sm mt-1">Profile appears authentic and verified</p>
                  </div>
                )}
              </div>

              {/* SECTION 7: Summary */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Summary
                </h2>
                <p className="text-white/80 leading-relaxed">{data.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}