import React from "react";
import PriceCard from "../../components/ui/PriceCard";

const plans = [
  {
    title: "Starter",
    price: "Free",
    description:
      "Get started with core verification tools for early-stage hiring and pilot workflows.",
  },
  {
    title: "Pro",
    price: "\u20B9999 / month",
    description:
      "Scale hiring decisions with deeper analysis, collaboration features, and smarter ranking.",
  },
  {
    title: "Enterprise",
    price: "Custom",
    description:
      "Tailored deployment, advanced controls, and dedicated support for high-volume teams.",
  },
] as const;

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pricing Preview
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Choose the plan that fits your hiring stage, from startup teams to enterprise talent operations.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <PriceCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              description={plan.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
