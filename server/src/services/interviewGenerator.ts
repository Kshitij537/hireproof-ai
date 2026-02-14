export function generateInterviewQuestions(role: string): string[] {
    if (role === "Backend Developer") {
        return [
            "How do you design a scalable REST API for high traffic?",
            "How would you optimize a slow SQL query in production?",
            "How do you handle authentication and authorization in Node.js services?",
            "How do you design retry and timeout strategies for external API calls?",
            "How do you structure logging and monitoring for backend systems?",
        ];
    }

    return [
        "Tell us about a complex project you have built.",
        "How do you debug production issues under time pressure?",
        "How do you prioritize features against technical debt?",
        "Describe a time you improved code quality in a team project.",
        "How do you approach learning a new technology quickly?",
    ];
}
