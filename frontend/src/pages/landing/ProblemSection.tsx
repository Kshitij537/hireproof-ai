import React from "react";

const ProblemSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            The Hiring Problem
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Hiring teams are flooded with fake resumes, copied portfolio projects, and online profiles that do not reliably reflect real skills. As a result, companies waste time, miss strong candidates, and make costly hiring mistakes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
