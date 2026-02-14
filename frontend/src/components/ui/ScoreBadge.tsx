interface ScoreBadgeProps {
    score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
    const color =
        score > 75
            ? "bg-green-500/15 text-green-400 border-green-500/20"
            : score > 45
                ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                : "bg-red-500/15 text-red-400 border-red-500/20";

    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${color}`}
        >
            {score}
        </div>
    );
}
