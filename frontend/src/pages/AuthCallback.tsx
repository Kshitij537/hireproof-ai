import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { API } from "../lib/api";
import { clearAuthSession, setAuthSession, type AuthRole } from "../lib/session";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session?.user?.email) {
          clearAuthSession();
          navigate("/recruiter/login", { replace: true });
          return;
        }

        const intendedRoleRaw = localStorage.getItem("oauthRole");
        const role: AuthRole = intendedRoleRaw === "candidate" ? "candidate" : "recruiter";
        localStorage.removeItem("oauthRole");

        const oauthExchange = await fetch(`${API}/api/auth/oauth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? "OAuth User",
            role,
          }),
        });

        if (!oauthExchange.ok) {
          clearAuthSession();
          navigate("/recruiter/login", { replace: true });
          return;
        }

        const payload = await oauthExchange.json();
        setAuthSession({
          token: payload.token,
          role: payload.user.role,
          user: payload.user,
        });

        navigate(payload.user.role === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard", {
          replace: true,
        });
      } catch {
        clearAuthSession();
        navigate("/recruiter/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <div className="min-h-screen grid place-items-center text-white/80 bg-[#0a0a0f]">Completing sign in...</div>;
}
