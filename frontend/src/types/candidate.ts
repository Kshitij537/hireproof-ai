export interface Skills {
    frontend: number;
    backend: number;
    dsa: number;
    system: number;
    testing: number;
}

export interface CommitPoint {
    month: string;
    commits: number;
}

export interface GitHubMonitoring {
    username: string;
    repoCount: number;
    totalCommits: number;
    contributionConsistency: number;
    complexityScore: number;
    collaborationScore: number;
    suggestions: string[];
    automation: string[];
    monitorSummary: string[];
}

export interface GitHubProfile {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
    followers: number;
    following: number;
    public_repos: number;
    created_at: string;
}

export interface TopRepo {
    name: string;
    stars: number;
    description: string | null;
    language: string | null;
    url: string;
    lastUpdated: string;
}

export interface Candidate {
    id: string;
    name: string;
    profileUrl: string;
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
    summary?: string;
    github?: string;
    role?: string;
    riskLevel?: "Low" | "Medium" | "High";
    aiRisk?: number;
    contributionDepth?: number;
    commitTimeline?: CommitPoint[];
    githubMonitoring?: GitHubMonitoring;
    githubProfile?: GitHubProfile;
    topRepos?: TopRepo[];
}
