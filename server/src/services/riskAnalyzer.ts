export function detectRisks(data: any): string[] {
    const risks: string[] = [];

    if (data.totalCommits < 20) {
        risks.push("Low development activity");
    }

    if (data.complexityScore > 90 && data.contributionConsistency < 30) {
        risks.push("Sudden complexity spike detected");
    }

    return risks;
}
