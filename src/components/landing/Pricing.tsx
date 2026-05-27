import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, Zap, Star, Sparkles } from "lucide-react";

interface PricingProps {
  onUpgrade: (plan: "pro" | "enterprise") => void;
  isLoading: boolean;
  activePlan: string;
}

export default function Pricing({ onUpgrade, isLoading, activePlan }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      id: "free" as const,
      name: "Starter Sandbox",
      price: 0,
      description: "Perfect for testing canvas flows and agent schemas safely.",
      credits: 100,
      icon: <ShieldCheck className="h-5 w-5 text-gray-500" />,
      features: [
        "100 campaign generation credits",
        "Visual drag-and-drop SVG canvas",
        "Standard 10 specialized AI agents",
        "Basic Markdown asset exports",
        "Community support levels"
      ],
      buttonLabel: "Current Active Tier",
      popular: false
    },
    {
      id: "pro" as const,
      name: "Pro Copywriter",
      price: isAnnual ? 27 : 39,
      description: "For agencies and ambitious solo founders scaling copy production.",
      credits: 1000,
      icon: <Zap className="h-5 w-5 text-indigo-500" />,
      features: [
        "1,000 monthly execution credits",
        "Visual drag-and-drop SVG canvas",
        "Premium speed Gemini 3.5-Flash priority",
        "Infinite campaign workspace exports",
        "Text file direct document downloads",
        "Priority live feature updates & support"
      ],
      buttonLabel: "Upgrade to Pro Master",
      popular: true
    },
    {
      id: "enterprise" as const,
      name: "Autonomous Agency",
      price: isAnnual ? 69 : 99,
      description: "Enterprise scale for large marketing departments and high volume.",
      credits: 5000,
      icon: <Star className="h-5 w-5 text-emerald-500" />,
      features: [
        "5,000 monthly execution credits",
        "Visual drag-and-drop SVG canvas",
        "Premium speed Gemini 3.5-Flash priority",
        "Imagen-4 High-Res Image Generative agents",
        "Text file direct document downloads",
        "Dedicated corporate accounts & live SLAs"
      ],
      buttonLabel: "Upgrade to Enterprise Core",
      popular: false
    }
  ];

  const comparisons = [
    { feature: "AI Campaign Credits", free: "100 credits", pro: "1,000 credits", enterprise: "5,000 credits" },
    { feature: "Drag-drop visual canvas", free: "✔ Included", pro: "✔ Included", enterprise: "✔ Included" },
    { feature: "Access to 10 Agents", free: "✔ Included", pro: "✔ Included", enterprise: "✔ Included" },
    { feature: "Gemini Model Priority", free: "Standard Sandbox", pro: "⚡ Ultra Priority", enterprise: "⚡ Premium Edge" },
    { feature: "Imagen Generation Support", free: "✖ Not included", pro: "Mocks only", enterprise: "✔ Included" },
    { feature: "Document Exports", free: "Copy/Markdown", pro: "Copy + TXT Download", enterprise: "Copy + TXT + API Sync" }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50/50 dark:bg-gray-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Flexible, Value-Packed Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            Choose a plan that fits your execution volume. Annual plans receive a **30% cash discount** instantly.
          </p>
        </div>

        {/* Toggle billing */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-xs font-semibold ${!isAnnual ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600/20 transition-all focus:outline-none"
            aria-label="Toggle annual pricing"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-indigo-600 transition-all ${
                isAnnual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>
            Annual Billing (Save 30%)
            <span className="bg-emerald-500/15 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
              Special offer
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-20 items-stretch">
          {plans.map((p) => {
            const isCurrent = activePlan === p.id;
            return (
              <div
                id={`pricing-card-${p.id}`}
                key={p.id}
                className={`group bento-card p-6 flex flex-col justify-between transition-all bento-glow-indigo ${
                  p.popular
                    ? "ring-2 ring-indigo-500/20 scale-[1.02] !border-indigo-500"
                    : ""
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md z-10">
                    <Sparkles className="h-3 w-3 animate-spin" />
                    Most popular choice
                  </div>
                )}

                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    {p.icon}
                    <h3 className="bento-header text-base font-bold text-gray-900 dark:text-white">
                      {p.name}
                    </h3>
                  </div>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      ${p.price}
                    </span>
                    <span className="text-sm font-semibold text-gray-500 ml-1 font-sans">
                      / month
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mb-6">
                    {p.description}
                  </p>

                  {/* Limits Badge */}
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-500/10 rounded-xl p-3 text-center mb-6">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 block font-mono">
                      Provides {p.credits} Campaign Credits List
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-sans">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 relative z-10">
                  <button
                    onClick={() => p.id !== "free" && onUpgrade(p.id)}
                    disabled={isCurrent || isLoading}
                    className={`w-full rounded-xl py-3.5 text-xs font-bold transition-all active:scale-[0.98] ${
                      isCurrent
                        ? "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400 cursor-default"
                        : p.popular
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
                        : "border border-gray-350 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {isCurrent ? "Active Plan Tier" : p.buttonLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/70 shadow-sm">
          <div className="p-6 border-b border-gray-150 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Full Feature Comparison Grid
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 font-bold">
                  <th className="p-4">Operational Metric</th>
                  <th className="p-4">Starter Sandbox</th>
                  <th className="p-4 text-indigo-600 dark:text-indigo-400">Pro Copywriter</th>
                  <th className="p-4">Autonomous Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {comparisons.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-indigo-950/10 font-sans">
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{c.feature}</td>
                    <td className="p-4 text-gray-500">{c.free}</td>
                    <td className="p-4 text-indigo-600 font-semibold dark:text-indigo-400">{c.pro}</td>
                    <td className="p-4 text-gray-500">{c.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
