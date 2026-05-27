import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Loader2, Sparkles, CheckCircle2, AlertTriangle, Eye, HelpCircle } from "lucide-react";
import { Agent, Project } from "../../types";

interface AgentModalProps {
  agent: Agent;
  project: Project;
  onClose: () => void;
  onGenerate: (inputs: Record<string, string>) => Promise<any>;
}

export default function AgentModal({ agent, project, onClose, onGenerate }: AgentModalProps) {
  // Setup inputs dictionary based on agent schemas
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    agent.inputs.forEach((inp) => {
      // Put a nice default preview help if available to make testing frictionless for the user
      if (inp.name === "productFeature") {
        initial[inp.name] = "Advanced active noise-cancellation with ergonomic custom memory silicone ear tips.";
      } else if (inp.name === "topic") {
        initial[inp.name] = "Top 5 digital marketing automation mistakes and how to solve them.";
      } else if (inp.name === "brandGoal") {
        initial[inp.name] = "Promote product-market fit to early stage technical SaaS founders.";
      } else if (inp.name === "offer") {
        initial[inp.name] = "20% Discount for early beta users who book a quick feedback call.";
      } else if (inp.name === "brandAttributes") {
        initial[inp.name] = "Bold, authoritative, modern, transparent, and slightly creative.";
      } else if (inp.name === "techDetails") {
        initial[inp.name] = "Titanium framework grade 5, 24-hour battery reserve, modular clips, open source firmware API.";
      } else if (inp.name === "productLaunch") {
        initial[inp.name] = "Mobile local travel scheduler with smart calendar syncing and flight scraping.";
      } else if (inp.name === "announcement") {
        initial[inp.name] = "ScheduleAI merges with PlannerCorp and secures $4.2M seed extension investment.";
      } else if (inp.name === "visualConcept") {
        initial[inp.name] = "Futuristic metallic smartphone resting beautifully on an organic raw volcanic stone backdrop.";
      } else if (inp.name === "productCategory") {
        initial[inp.name] = "Premium SaaS personal tax software";
      } else if (inp.name === "painPoint") {
        initial[inp.name] = "Confusing tax codes, hidden filing charges, and terrible live support agents.";
      } else {
        initial[inp.name] = "";
      }
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reassuring messages showing progress during generation
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Reading company brand personality guidelines...",
    "Harmonizing tone rules and targeting audience demographics...",
    "Executing custom direct-response framework prompts...",
    "Running Gemini 3.5-Flash model pipelines...",
    "Creating high-converting headings and polishing formatting..."
  ];

  const handleInputChange = (name: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Dynamic timer to increment the comforting visual prompt guidelines text
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      await onGenerate(formValues);
      clearInterval(timer);
      setIsLoading(false);
      onClose(); // Close modal to view in output preview section
    } catch (err: any) {
      clearInterval(timer);
      setIsLoading(false);
      setErrorMessage(err.message || "An unexpected generation processor error occurred.");
    }
  };

  const getFormInputDescription = (name: string) => {
    if (name === "productFeature") return "E.g. 50% discount offer, robust water filtration system";
    if (name === "topic") return "What main content theme should this optimize for?";
    if (name === "techDetails") return "Paste technical traits, bullet specifications, or raw values";
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/45">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 p-6 space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-bold tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">
              Configure {agent.category} specialist
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Execute {agent.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info summary regarding the campaign brand attributes loaded */}
        <div className="rounded-xl bg-indigo-50/50 p-3 text-left flex gap-2 border border-indigo-100/50 dark:bg-indigo-950/20 dark:border-indigo-500/15">
          <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-indigo-900/80 dark:text-indigo-300 space-y-1">
            <p className="font-bold">Automatic Brand Association Active</p>
            <p className="font-sans leading-relaxed">
              This node automatically inherits brand settings **&ldquo;{project.settings.brand}&rdquo;** matching tone **&ldquo;{project.settings.tone}&rdquo;** oriented to **&ldquo;{project.settings.targetAudience}&rdquo;**.
            </p>
          </div>
        </div>

        {/* Dynamic Form Generation Base */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto space-y-5">
          <div className="space-y-4 text-left">
            {agent.inputs.map((inp) => (
              <div key={inp.name} className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span>{inp.label}</span>
                  {inp.required && <span className="text-[10px] text-indigo-500 italic">Required field</span>}
                </label>
                
                {inp.type === "textarea" ? (
                  <textarea
                    required={inp.required}
                    rows={4}
                    placeholder={inp.placeholder || "Enter details here..."}
                    value={formValues[inp.name] || ""}
                    onChange={(e) => handleInputChange(inp.name, e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-white p-3 text-xs text-gray-800 placeholder-gray-450 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                ) : (
                  <input
                    type="text"
                    required={inp.required}
                    placeholder={inp.placeholder || "Enter values here..."}
                    value={formValues[inp.name] || ""}
                    onChange={(e) => handleInputChange(inp.name, e.target.value)}
                    className="w-full rounded-xl border border-gray-250 bg-white px-3 py-2.5 text-xs text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                )}
                
                <p className="text-[10px] text-gray-400 font-sans pl-1">
                  {getFormInputDescription(inp.name)}
                </p>
              </div>
            ))}
          </div>

          {/* Loader Overlay when executing */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 dark:bg-gray-900 dark:border-gray-800 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Generating campaign asset...</span>
              </div>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse font-sans">
                {loadingSteps[loadingStep]}
              </p>
            </div>
          )}

          {/* Errored guidelines alerts */}
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 flex gap-2 text-left dark:bg-rose-950/20 dark:border-rose-950">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 dark:text-rose-400 space-y-1">
                <p className="font-bold">Generation Cancelled or Limit Met</p>
                <p className="font-sans leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Buttons footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-xs font-bold text-white shadow shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-white text-white" />
              Analyze & Run Campaign
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
