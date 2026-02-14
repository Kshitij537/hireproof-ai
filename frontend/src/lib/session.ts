export type AuthRole = "recruiter" | "candidate";

export type AuthUser = {
  email: string;
  role: AuthRole;
  name: string;
  company?: string;
  github?: string;
};

export type AuthSession = {
  token: string;
  role: AuthRole;
  user: AuthUser;
};

const AUTH_TOKEN_KEY = "authToken";
const AUTH_ROLE_KEY = "authRole";
const AUTH_USER_KEY = "authUser";
const LEGACY_RECRUITER_TOKEN_KEY = "recruiterToken";
const LEGACY_CANDIDATE_TOKEN_KEY = "candidateToken";

function isValidRole(role: unknown): role is AuthRole {
  return role === "recruiter" || role === "candidate";
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  localStorage.setItem(AUTH_ROLE_KEY, session.role);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));

  if (session.role === "recruiter") {
    localStorage.setItem(LEGACY_RECRUITER_TOKEN_KEY, session.token);
    localStorage.removeItem(LEGACY_CANDIDATE_TOKEN_KEY);
  } else {
    localStorage.setItem(LEGACY_CANDIDATE_TOKEN_KEY, session.token);
    localStorage.removeItem(LEGACY_RECRUITER_TOKEN_KEY);
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_RECRUITER_TOKEN_KEY);
  localStorage.removeItem(LEGACY_CANDIDATE_TOKEN_KEY);
}

export function getAuthSession(): AuthSession | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const role = localStorage.getItem(AUTH_ROLE_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  if (token && role && userRaw) {
    try {
      const user = JSON.parse(userRaw) as AuthUser;
      if (isValidRole(role) && isValidRole(user.role)) {
        return { token, role, user };
      }
    } catch {
      return null;
    }
  }

  const recruiterToken = localStorage.getItem(LEGACY_RECRUITER_TOKEN_KEY);
  const candidateToken = localStorage.getItem(LEGACY_CANDIDATE_TOKEN_KEY);
  if (recruiterToken) {
    return {
      token: recruiterToken,
      role: "recruiter",
      user: { role: "recruiter", email: "recruiter@test.com", name: "Recruiter" },
    };
  }
  if (candidateToken) {
    return {
      token: candidateToken,
      role: "candidate",
      user: { role: "candidate", email: "candidate@test.com", name: "Candidate" },
    };
  }

  return null;
}
