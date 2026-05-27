import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { Search as SearchIcon, Filter, X, ArrowRight, CornerDownRight } from "lucide-react";
import { Agent, AgentCategory } from "../../types";

// Static copy of the seeded agents for layout integrity
const AGENT_CATALOG: Agent[] = [
  {
    _id: "agent-ad-copywriter",
    name: "Ad Copywriter Pro",
    description: "Generates high-converting copy variants for Facebook, Instagram, LinkedIn, and Google Ads.",
    category: "content",
    icon: "Megaphone",
    outputFormat: "text",
    promptTemplate: "Generates variants based on: brand, audience, and targeted feature.",
    inputs: [{ name: "productFeature", label: "Product Feature / Offer", type: "text", required: true }]
  },
  {
    _id: "agent-seo-blog",
    name: "SEO Blog Architect",
    description: "Constructs highly detailed SEO-optimized blog outlines and keyword clusters.",
    category: "seo",
    icon: "Search",
    outputFormat: "text",
    promptTemplate: "Creates headings, secondary keywords, and metadata structures.",
    inputs: [{ name: "topic", label: "Blog Topic / Main Focus", type: "text", required: true }]
  },
  {
    _id: "agent-social-ideas",
    name: "Viral Social Planner",
    description: "Produces weekly calendars of viral reels hooks, interactive threads, and high-impact captions.",
    category: "social",
    icon: "Share2",
    outputFormat: "text",
    promptTemplate: "Produces viral hooks and scheduling tables.",
    inputs: [{ name: "brandGoal", label: "Weekly Growth Goal", type: "text", required: true }]
  },
  {
    _id: "agent-email-outreach",
    name: "Email Sales Crafter",
    description: "Drafts persuasive cold outreach sequences or weekly authority-building newsletters.",
    category: "content",
    icon: "Mail",
    outputFormat: "text",
    promptTemplate: "Generates compelling newsletter copy with high-impact CTAs.",
    inputs: [{ name: "offer", label: "Email Offer / Pitch", type: "text", required: true }]
  },
  {
    _id: "agent-tone-tuner",
    name: "Brand Voice Harmonizer",
    description: "Establishes a unified corporate voice, brand vocabulary guidelines, and positioning matrix.",
    category: "strategy",
    icon: "Sparkles",
    outputFormat: "text",
    promptTemplate: "Synthesizes positioning, brand personas, and style limitations.",
    inputs: [{ name: "brandAttributes", label: "Core Values & Adjectives", type: "textarea", required: true }]
  },
  {
    _id: "agent-product-descriptor",
    name: "Product Benefit Mapper",
    description: "Transforms technical properties into emotionally compelling, benefit-focused descriptions.",
    category: "content",
    icon: "FileText",
    outputFormat: "text",
    promptTemplate: "Maps physical specs to deep emotional lifestyle benefits.",
    inputs: [{ name: "techDetails", label: "Technical Specs / Raw details", type: "textarea", required: true }]
  },
  {
    _id: "agent-go-to-market",
    name: "30-Day Launch Strategist",
    description: "Drafts hyper-tactical launch plans, channels to prioritize, and KPI tracking matrices.",
    category: "strategy",
    icon: "Compass",
    outputFormat: "text",
    promptTemplate: "Creates chief operations launch calendar grids by week.",
    inputs: [{ name: "productLaunch", label: "Product or Feature to Launch", type: "text", required: true }]
  },
  {
    _id: "agent-press-release",
    name: "PR Broadcast Officer",
    description: "Drafts formal corporate announcements, media pitches, and executive quote packages.",
    category: "social",
    icon: "FileDigit",
    outputFormat: "text",
    promptTemplate: "Outputs formal journalist announcements with executive quotes.",
    inputs: [{ name: "announcement", label: "Core News Announcement", type: "textarea", required: true }]
  },
  {
    _id: "agent-prompt-engineer",
    name: "Visual Prompt Architect",
    description: "Translates marketing concepts into stunning visual directives for AI image generators.",
    category: "visual",
    icon: "Image",
    outputFormat: "image",
    promptTemplate: "Tuning volumetric lighting coordinates and engine commands.",
    inputs: [{ name: "visualConcept", label: "Visual Concept / Vibe", type: "text", required: true }]
  },
  {
    _id: "agent-competitor-auditor",
    name: "Competitor positioning Auditor",
    description: "Dissects direct competitors weaknesses to form custom tactical counter-messaging frames.",
    category: "strategy",
    icon: "Activity",
    outputFormat: "text",
    promptTemplate: "Inspects competitor gaps and formats objection killers.",
    inputs: [
      { name: "productCategory", label: "Product Category / Competitors", type: "text", required: true },
      { name: "painPoint", label: "Main Customer Complaint", type: "text", required: true }
    ]
  }
];

export default function Agents() {
  const [activeCategory, setActiveCategory] = useState<"all" | AgentCategory>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const categories: { value: "all" | AgentCategory; label: string }[] = [
    { value: "all", label: "All Agencies" },
    { value: "content", label: "Content Copywriting" },
    { value: "social", label: "Social Media" },
    { value: "seo", label: "SEO Growth" },
    { value: "visual", label: "Visual Prompting" },
    { value: "strategy", label: "Launch Strategy" }
  ];

  const filteredAgents = activeCategory === "all"
    ? AGENT_CATALOG
    : AGENT_CATALOG.filter((a) => a.category === activeCategory);

  // Dynamic Lucide rendering fallback helper
  const renderAgentIcon = (iconName: string, category: AgentCategory) => {
    const IconComponent = (Icons as any)[iconName];
    const baseColorClass = 
      category === "content" ? "text-indigo-500 bg-indigo-500/10" :
      category === "social" ? "text-pink-500 bg-pink-500/10" :
      category === "seo" ? "text-emerald-500 bg-emerald-500/10" :
      category === "visual" ? "text-purple-500 bg-purple-500/10" :
      "text-amber-500 bg-amber-500/10";

    if (IconComponent) {
      return (
        <div className={`p-3 rounded-xl ${baseColorClass}`}>
          <IconComponent className="h-6 w-6" />
        </div>
      );
    }
    return (
      <div className={`p-3 rounded-xl ${baseColorClass}`}>
        <Icons.Bot className="h-6 w-6" />
      </div>
    );
  };

  return (
    <section id="agents" className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Meet Your Specialized AI Agent Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            A standard squad of 10 digital specialists engineered to handle high-fidelity campaign structures.
          </p>
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              id={`agent-filter-${cat.value}`}
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                activeCategory === cat.value
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => {
            const glowClass = 
              agent.category === "seo" ? "bento-glow-emerald" :
              agent.category === "content" ? "bento-glow-indigo" : "";
            
            return (
              <motion.div
                id={`agent-card-${agent._id}`}
                key={agent._id}
                whileHover={{ y: -4 }}
                className={`group bento-card p-6 flex flex-col justify-between ${glowClass}`}
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    {renderAgentIcon(agent.icon, agent.category)}
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                      agent.category === "content" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400" :
                      agent.category === "social" ? "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" :
                      agent.category === "seo" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" :
                      agent.category === "visual" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}>
                      {agent.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="bento-header text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug font-sans">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between relative z-10">
                  <span className="text-xs font-mono text-gray-400 uppercase">
                    Format: {agent.outputFormat}
                  </span>
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    Explore specifications
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Explorer Modal overlay */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 p-6 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {renderAgentIcon(selectedAgent.icon, selectedAgent.category)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedAgent.name}
                    </h3>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                      {selectedAgent.category} SPECIALIST
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Role Summary
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-sans">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Required Inputs Schema
                  </h4>
                  <div className="space-y-2 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <CornerDownRight className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Input Fields:</span>
                    </div>
                    {selectedAgent.inputs.map((inp, idx) => (
                      <div key={idx} className="flex justify-between text-xs pl-5">
                        <span className="font-mono text-gray-500">&quot;{inp.name}&quot; ({inp.type})</span>
                        <span className="text-gray-400 italic">{inp.required ? "Required" : "Optional"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Prompt Framework Sample
                  </h4>
                  <p className="rounded-lg bg-gray-900 p-3 font-mono text-xs text-gray-300 leading-relaxed max-h-[140px] overflow-y-auto">
                    {selectedAgent.promptTemplate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
                >
                  Understood, close specifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
