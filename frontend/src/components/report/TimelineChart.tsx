import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import type { CommitPoint } from "../../types/candidate";

interface Props {
    data?: CommitPoint[];
}

const DEFAULT_TIMELINE: CommitPoint[] = [
    { month: "Sep", commits: 12 },
    { month: "Oct", commits: 18 },
    { month: "Nov", commits: 8 },
    { month: "Dec", commits: 25 },
    { month: "Jan", commits: 30 },
    { month: "Feb", commits: 15 },
];

export default function TimelineChart({ data }: Props) {
    const timeline = data && data.length > 0 ? data : DEFAULT_TIMELINE;

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Activity Timeline
            </h3>

            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline}>
                        <defs>
                            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(10,10,15,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "13px",
                            }}
                            formatter={(value: number | string | undefined) => [`${value ?? 0}`, "Commits"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="commits"
                            stroke="#a855f7"
                            strokeWidth={2.5}
                            fill="url(#timelineGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
