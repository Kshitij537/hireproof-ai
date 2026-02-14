import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(15,23,42,0.08),_transparent_35%)]" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Stop Fake Skills. Hire with Proof.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          HireProof AI uses advanced skill authenticity analysis to help teams verify real capabilities, reduce hiring risk, and make faster, evidence-backed hiring decisions.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <button
            type="button"
            className="w-full rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:w-auto"
          >
            Login as Candidate
          </button>

          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 sm:w-auto"
          >
            Login as Recruiter
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
