import React from "react";

type PriceCardProps = {
  title: string;
  price: string;
  description: string;
};

const PriceCard: React.FC<PriceCardProps> = ({ title, price, description }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{price}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
};

export default PriceCard;
