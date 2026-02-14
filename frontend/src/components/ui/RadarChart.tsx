import { useEffect, useRef, useState } from "react";
import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { Skills } from "../../types/candidate";

interface RadarChartProps {
    skills: Skills;
}

const SKILL_LABELS: Record<keyof Skills, string> = {
    frontend: "Frontend",
    backend: "Backend",
    dsa: "DSA",
    system: "System Design",
    testing: "Testing",
};

export default function RadarChart({ skills }: RadarChartProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const update = () => {
            const { width, height } = el.getBoundingClientRect();
            setReady(width > 0 && height > 0);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const data = (Object.keys(SKILL_LABELS) as (keyof Skills)[]).map((key) => ({
        skill: SKILL_LABELS[key],
        value: skills[key],
        fullMark: 10,
    }));

    return (
        <div ref={containerRef} className="w-full h-[320px] min-w-0 min-h-[320px]">
            {ready ? (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                        tickCount={6}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15,15,25,0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: 13,
                        }}
                        itemStyle={{ color: "#a78bfa" }}
                    />
                    <Radar
                        name="Skill Level"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.25}
                        strokeWidth={2}
                    />
                </RechartsRadarChart>
            </ResponsiveContainer>
            ) : null}
        </div>
    );
}
