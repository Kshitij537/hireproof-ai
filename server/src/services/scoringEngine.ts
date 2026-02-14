export function calculateAuthenticity(data: any): number {
    const score =
        0.3 * data.contributionConsistency +
        0.25 * data.complexityScore +
        0.2 * data.collaborationScore +
        0.15 * (data.totalCommits / 5) +
        0.1 * 80;

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return clamped;
}
