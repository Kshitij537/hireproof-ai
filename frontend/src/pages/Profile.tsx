import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { clearAuthSession, getAuthSession } from "../lib/session";
import { API } from "../lib/api";

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  if (!session) {
    return <Navigate to="/recruiter/login" replace />;
  }

  const payload = decodeTokenPayload(session.token);
  const expiresAt =
    payload && typeof payload.exp === "number"
      ? new Date(payload.exp * 1000).toLocaleString()
      : "Not available";

  const handleSignOut = () => {
    clearAuthSession();
    navigate(session.role === "candidate" ? "/candidate/login" : "/recruiter/login");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, string>;
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };

    loadProfile();
  }, [session.token]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-white/50 mt-1">Session and role details for the signed-in account.</p>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">Identity</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="text-white/50">Name:</span> {profile?.name ?? session.user.name}</p>
              <p><span className="text-white/50">Email:</span> {profile?.email ?? session.user.email}</p>
              <p><span className="text-white/50">Role:</span> {profile?.role ?? session.user.role}</p>
              {(profile?.company || session.user.company) ? <p><span className="text-white/50">Company:</span> {profile?.company ?? session.user.company}</p> : null}
              {(profile?.github || session.user.github) ? <p><span className="text-white/50">GitHub:</span> {profile?.github ?? session.user.github}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">Session</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="text-white/50">Status:</span> Active</p>
              <p><span className="text-white/50">Expires:</span> {expiresAt}</p>
              <p className="break-all"><span className="text-white/50">Token:</span> {session.token.slice(0, 28)}...</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">Role Access</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {session.role === "recruiter" ? (
              <>
                <li>Recruiter dashboard access is enabled.</li>
                <li>Candidate scan and analysis access is enabled.</li>
              </>
            ) : (
              <>
                <li>Candidate dashboard access is enabled.</li>
                <li>Candidate profile and report viewing is enabled.</li>
              </>
            )}
          </ul>
        </section>

        <button
          onClick={handleSignOut}
          className="mt-8 px-5 py-2.5 rounded-xl border border-red-400/30 text-red-300 hover:bg-red-500/10 transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
