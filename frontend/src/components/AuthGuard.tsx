import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API } from "../lib/api";
import { supabase } from "../lib/supabase";
import { clearAuthSession, getAuthSession, setAuthSession, type AuthRole } from "../lib/session";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: AuthRole[];
};

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState<AuthRole | null>(null);

  /* DEBUG LOGS */
  console.log("Route:", location.pathname);
  // console.log("Session:", getAuthSession()); // Avoid spamming full object
  console.log("Role:", role);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      // ── 1. Try localStorage session first ──
      const session = getAuthSession();
      console.log("Session:", session);

      if (session) {
        // Check role match
        if (allowedRoles && !allowedRoles.includes(session.role)) {
          if (!cancelled) {
            setRole(session.role);
            setAuthorized(false);
            setChecking(false);
          }
          return;
        }

        // Try to verify the custom JWT with backend
        try {
          const res = await fetch(`${API}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${session.token}` },
          });

          if (res.ok) {
            if (!cancelled) {
              setRole(session.role);
              setAuthorized(true);
              setChecking(false);
            }
            return;
          }
        } catch {
          // Backend verify failed — don't immediately redirect,
          // fall through to Supabase session check below
          console.warn("[AuthGuard] Backend verify failed, trying Supabase session...");
        }
      }

      // ── 2. Fallback: check Supabase session ──
      // This handles cases where the custom JWT expired or
      // backend restarted, but Supabase OAuth session is still valid
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession();

        if (sbSession?.user) {
          console.log("[AuthGuard] Supabase session found:", sbSession.user.email);

          // Determine role from stored preferences or existing session
          const storedRole =
            localStorage.getItem("hireproof_role") ||
            localStorage.getItem("authRole") ||
            session?.role;
          const effectiveRole: AuthRole = storedRole === "recruiter" ? "recruiter" : "candidate";

          // Check role
          if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
            if (!cancelled) {
              setRole(effectiveRole);
              setAuthorized(false);
              setChecking(false);
            }
            return;
          }

          // Rebuild the localStorage session from Supabase data
          setAuthSession({
            token: sbSession.access_token,
            role: effectiveRole,
            user: {
              email: sbSession.user.email ?? "",
              role: effectiveRole,
              name:
                sbSession.user.user_metadata?.full_name ??
                sbSession.user.user_metadata?.name ??
                "User",
            },
          });

          if (!cancelled) {
            setRole(effectiveRole);
            setAuthorized(true);
            setChecking(false);
          }
          return;
        }
      } catch {
        console.warn("[AuthGuard] Supabase session check failed");
      }

      // ── 3. No valid session anywhere — redirect to login ──
      if (!cancelled) {
        clearAuthSession();
        setAuthorized(false);
        setRole(session?.role ?? null);
        setChecking(false);
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [allowedRoles]);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-white/70 bg-[#0a0a0f]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {


    // Smart redirect based on URL context
    const isCandidateRoute = location.pathname.startsWith("/candidate");
    const isRecruiterRoute =
      location.pathname.startsWith("/recruiter") ||
      location.pathname.startsWith("/compare") ||
      location.pathname.startsWith("/scan");

    let redirectPath = "/";

    // 1. If currently logged in but unauthorized (wrong role), redirect to own dashboard
    if (role === "candidate") {
      return <Navigate to="/candidate/home" state={{ from: location }} replace />;
    }
    if (role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" state={{ from: location }} replace />;
    }

    // 2. If not logged in, redirect based on URL context
    if (isCandidateRoute) {
      redirectPath = "/candidate/login";
    } else if (isRecruiterRoute) {
      redirectPath = "/recruiter/login";
    } else {
      // Fallback
      redirectPath = "/recruiter/login";
    }

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
