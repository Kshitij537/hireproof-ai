export type GithubData = {
    totalCommits: number;
    repoCount: number;
    languages: string[];
    contributionConsistency: number;
    complexityScore: number;
    collaborationScore: number;
};

export async function fetchGithubData(username: string): Promise<GithubData> {
    const seed = username.length;

    return {
        totalCommits: 20 + (seed * 7) % 220,
        repoCount: 3 + (seed % 12),
        languages: ["TypeScript", "Python", "SQL"],
        contributionConsistency: 40 + (seed * 9) % 60,
        complexityScore: 45 + (seed * 11) % 55,
        collaborationScore: 35 + (seed * 13) % 65,
    };
}
