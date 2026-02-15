import { useNavigate, useLocation } from "react-router-dom";
import { getAuthSession, clearAuthSession } from "../../lib/session";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getAuthSession();

  const handleLogout = () => {
    clearAuthSession();
    navigate(session?.role === "candidate" ? "/candidate/login" : "/recruiter/login");
  };

  const handleAnalysisClick = () => {
    // AuthGuard on /analysis handles authentication — no need to check here
    navigate("/analysis");
  };

  const handleDashboardClick = () => {
    // Route to role-appropriate dashboard
    if (session?.role === "candidate") {
      navigate("/candidate/home");
    } else {
      navigate("/recruiter/dashboard");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-56 border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <h1 className="text-xl font-bold">
          Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
          <span className="text-white/60 font-light">AI</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={handleDashboardClick}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${isActive("/dashboard") || isActive("/recruiter/dashboard") || isActive("/candidate/home")
              ? "bg-purple-500/10 text-purple-400"
              : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Dashboard
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${isActive("/profile")
              ? "bg-purple-500/10 text-purple-400"
              : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Profile
        </button>

        <button
          onClick={handleAnalysisClick}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${isActive("/analysis")
              ? "bg-purple-500/10 text-purple-400"
              : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
          Analysis
        </button>
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {session?.user?.name?.charAt(0) || "C"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name || "Candidate"}
            </p>
            <p className="text-xs text-white/40 capitalize">{session?.user?.role || "Candidate"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium border border-white/[0.1] text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}