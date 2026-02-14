import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { API } from "../lib/api";
import { clearAuthSession, setAuthSession, type AuthRole } from "../lib/session";

export default function AuthCallback() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-execution
    if (handledRef.current) return;
    handledRef.current = true;

    // Read role IMMEDIATELY, before any async work
    const storedRole =
      localStorage.getItem("hireproof_role") ||
      localStorage.getItem("oauthRole");
    const role: AuthRole = storedRole === "candidate" ? "candidate" : "recruiter";

    // Clean up the stored role keys right away
    localStorage.removeItem("hireproof_role");
    localStorage.removeItem("oauthRole");

    const handleAuthCallback = async () => {
      try {
        // Wait a tick for Supabase to process the URL hash/code
        const { data, error: sessionError } = await supabase.auth.getSession();
        const session = data.session;

        if (!session?.user?.email || sessionError) {
          clearAuthSession();
          navigate("/", { replace: true });
          return;
        }

        // Exchange with backend for app JWT
        const oauthExchange = await fetch(`${API}/api/auth/oauth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ??
              session.user.user_metadata?.name ??
              "OAuth User",
            role,
          }),
        });

        if (!oauthExchange.ok) {
          clearAuthSession();
          navigate("/", { replace: true });
          return;
        }

        const payload = await oauthExchange.json();
        setAuthSession({
          token: payload.token,
          role,
          user: { ...payload.user, role },
        });

        // Role-based redirect
        navigate(
          role === "candidate" ? "/candidate/home" : "/recruiter/dashboard",
          { replace: true }
        );
      } catch {
        clearAuthSession();
        navigate("/", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-[#0a0a0f]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}
