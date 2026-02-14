import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="bg-slate-950 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-12 text-center shadow-2xl shadow-slate-950/40 sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Make Smarter Hiring Decisions with Confidence
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Start using HireProof AI to verify real skills, reduce hiring risk, and move from guesswork to evidence-backed hiring.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 sm:w-auto"
            >
              Get Started as Candidate
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-slate-500 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-slate-300 hover:bg-white/10 sm:w-auto"
            >
              Get Started as Recruiter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
