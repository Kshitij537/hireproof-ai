import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthSession } from "../../lib/session";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const session = getAuthSession();
    const role = session?.role ?? "recruiter";

    const recruiterItems = [
        {
            name: "Dashboard", path: "/dashboard", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        },
        {
            name: "Scan Candidate", path: "/scan", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            )
        },
        {
            name: "Profile", path: "/profile", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        },
        {
            name: "Compare", path: "/compare", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
            )
        },
    ];

    const candidateItems = [
        {
            name: "Dashboard", path: "/candidate/dashboard", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        },
        {
            name: "Profile", path: "/profile", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        },
    ];

    const menuItems = role === "candidate" ? candidateItems : recruiterItems;

    const handleLogout = () => {
        clearAuthSession();
        navigate(role === "candidate" ? "/candidate/login" : "/recruiter/login");
    };

    return (
        <div className="w-64 h-screen bg-[#0f0f16] border-r border-white/[0.06] flex flex-col sticky top-0">
            {/* Logo */}
            <div className="p-6">
                <h1 className="text-xl font-bold text-white tracking-tight">
                    Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                    <span className="text-white/60 font-light">AI</span>
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-purple-600/10 text-purple-400 font-medium border border-purple-600/20"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <div>
                        <p className="text-sm font-medium text-white">{session?.user?.name ?? "User"}</p>
                        <p className="text-xs text-white/40">{role === "candidate" ? "Candidate" : "Recruiter"}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-3 py-2 rounded-lg text-sm text-red-300 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
