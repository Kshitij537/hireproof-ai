import React from "react";

const previews = [
  "Candidate Report",
  "Recruiter Dashboard",
  "Skill Radar Graph",
] as const;

const ScreenshotSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Product Preview
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Explore how HireProof AI presents candidate intelligence through actionable dashboards, detailed reports, and clear skill visualizations.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((item) => (
            <div
              key={item}
              className="flex h-56 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-center text-sm font-medium text-slate-600"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotSection;
