import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API } from "../lib/api";
import { clearAuthSession, getAuthSession, type AuthRole } from "../lib/session";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: AuthRole[];
};

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState<AuthRole | null>(null);

  useEffect(() => {
    const verify = async () => {
      const session = getAuthSession();
      if (!session) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      if (allowedRoles && !allowedRoles.includes(session.role)) {
        setAuthorized(false);
        setRole(session.role);
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) {
          clearAuthSession();
          setAuthorized(false);
          setChecking(false);
          return;
        }

        setRole(session.role);
        setAuthorized(true);
        setChecking(false);
      } catch {
        setAuthorized(false);
        setChecking(false);
      }
    };

    verify();
  }, [allowedRoles]);

  if (checking) {
    return <div className="min-h-screen grid place-items-center text-white/70 bg-[#0a0a0f]">Checking session...</div>;
  }

  if (!authorized) {
    const session = getAuthSession();
    const fallbackRole = role ?? session?.role;
    const redirectPath = fallbackRole === "candidate" ? "/candidate/login" : "/recruiter/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
