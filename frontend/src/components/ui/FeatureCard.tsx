import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
};

export default FeatureCard;
