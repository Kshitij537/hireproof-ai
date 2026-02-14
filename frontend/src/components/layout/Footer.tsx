import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-white">HireProof AI</p>
        <p className="mt-2 text-sm text-slate-300">
          Smarter hiring with verified skills and evidence-based decisions.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          © 2026 HireProof AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
