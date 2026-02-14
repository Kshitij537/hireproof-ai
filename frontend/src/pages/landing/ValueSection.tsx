import React from "react";
import FeatureCard from "../../components/ui/FeatureCard";

const features = [
  {
    title: "Skill Authenticity Score",
    description:
      "Measure how genuine each candidate's stated skills are using multi-signal AI verification.",
  },
  {
    title: "Candidate Ranking",
    description:
      "Automatically rank applicants by verified capability, role fit, and interview readiness.",
  },
  {
    title: "AI Interview Copilot",
    description:
      "Guide interviewers with tailored questions and real-time prompts based on candidate skill data.",
  },
  {
    title: "Skill Radar Graph",
    description:
      "Visualize strengths, gaps, and confidence levels across core technical and soft-skill dimensions.",
  },
  {
    title: "Hiring Risk Detection",
    description:
      "Flag risk signals early, including inconsistent claims, overstatements, and weak project evidence.",
  },
  {
    title: "End-to-End Hiring",
    description:
      "Connect screening, evaluation, interview workflows, and final decisions in one unified platform.",
  },
] as const;

const ValueSection: React.FC = () => {
  return (
    <section id="features" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What HireProof AI Does
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
