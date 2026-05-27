import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Laptop, Cpu, Zap, FolderOpen, ChevronDown, ChevronUp } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  detail: string;
}

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      number: 1,
      title: "Define Brand settings",
      description: "Establish your core company name, tone settings, and targeted audience context once.",
      icon: <FolderOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      detail: "All marketing agents on the workspace read this global project brand profile. It allows them to generate matching material personalized to your company culture without manual prompt prefixing."
    },
    {
      number: 2,
      title: "drag-and-drop AI Agents",
      description: "Assemble specialized agents on our visual interactive grid canvas.",
      icon: <Laptop className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      detail: "Add SEO planners, viral social calendar draftsmen, and copywriting agents. Connect nodes visually to establish standard operational sequences."
    },
    {
      number: 3,
      title: "Configure & trigger",
      description: "Click any canvas node to enter specific inputs and run automated generation.",
      icon: <Cpu className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      detail: "Our user interfaces adapt dynamically matching the agent's input schema. Generate beautiful, professional ad copy, newsletters or Imagen design prompts immediately using Gemini 3.5-flash."
    },
    {
      number: 4,
      title: "Download or Chaining",
      description: "Instantly copy formatted materials, download assets, or track credits usage.",
      icon: <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      detail: "Copy to clipboard, download documents directly, or view generation historical records. Free tier includes 100 free credits to test all capabilities easily!"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50/50 dark:bg-gray-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Streamlined Multi-Agent Chaining
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            Launch multi-channel marketing campaigns under 2 minutes. Tap below to expand technical workflows.
          </p>
        </div>

        {/* Desktop timeline connectors */}
        <div className="relative">
          <div className="hidden lg:absolute lg:top-1/2 lg:left-8 lg:right-8 lg:h-0.5 lg:-mt-6 lg:bg-indigo-100 dark:lg:bg-gray-800 -z-10" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {steps.map((step) => {
              const isExpanded = expandedStep === step.number;
              return (
                <div
                  id={`how-it-works-step-${step.number}`}
                  key={step.number}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950 flex flex-col justify-between"
                >
                  <div>
                    {/* step index indicator */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                        {step.number}
                      </span>
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                        className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Toggle workflow facts"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {step.icon}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Expandable info block */}
                  <div className="mt-4">
                    <AnimatePresence initial={false}>
                      {(isExpanded) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 border-t border-gray-150 dark:border-gray-800 text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed font-sans bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded">
                            {step.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isExpanded && (
                      <button
                        onClick={() => setExpandedStep(step.number)}
                        className="mt-3 text-xs text-indigo-500 hover:text-indigo-400 font-semibold tracking-wide flex items-center gap-1"
                      >
                        Learn more...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
