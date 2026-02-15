export interface GitHubSignals {
    repoCount: number;
    stars: number;
    languages: string[];
    activityScore: number;
    projectDepthScore: number;
}

export interface Skills {
    frontend: number;
    backend: number;
    dsa: number;
    system: number;
    testing: number;
}

export interface ScoreResult {
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
}

export interface AIInsights {
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
}

export interface CandidateReport {
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
    githubProfile?: {
        login: string;
        name: string | null;
        avatar_url: string;
        html_url: string;
        bio: string | null;
        followers: number;
        following: number;
        public_repos: number;
        created_at: string;
    };
    topRepos?: {
        name: string;
        stars: number;
        description: string | null;
        language: string | null;
        url: string;
        lastUpdated: string;
    }[];
    githubMonitoring?: {
        username: string;
        repoCount: number;
        totalCommits: number;
        contributionConsistency: number;
        complexityScore: number;
        collaborationScore: number;
        suggestions: string[];
        automation: string[];
        monitorSummary: string[];
    };
}
