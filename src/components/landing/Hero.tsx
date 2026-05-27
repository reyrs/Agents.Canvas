import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play, Server, RefreshCw } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export default function Hero({ onGetStarted, onWatchDemo }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Dynamic Ambient Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute top-20 right-1/4 -z-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Main Content Areas */}
          <div className="space-y-8 text-center lg:col-span-7 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-md dark:border-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-300"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Next-Gen Visual Multi-Agent Workflow Launcher</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white"
            >
              Automate Marketing with <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">AI Multi-Agent</span> Canvas
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-2xl font-sans text-lg text-gray-600 dark:text-gray-300 lg:mx-0"
            >
              Construct your ultimate marketing and copywriting team on an interactive drag-and-drop workspace. Chain special SEO planners, ad copywriters, and content visualizers directly to launch full-scale campaigns.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <button
                id="hero-cta-get-started"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                Launch Workspace
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-cta-demo"
                onClick={onWatchDemo}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-[0.98]"
              >
                <Play className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                Watch Quick Tour
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-center lg:justify-start gap-8 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              <div>
                <span className="block text-xl font-bold text-indigo-600 dark:text-indigo-400">10+ Specialized</span>
                Marketing Agent Types
              </div>
              <div className="border-l border-gray-200 dark:border-gray-800 pl-8">
                <span className="block text-xl font-bold text-emerald-500 dark:text-emerald-400">Gemini Pro</span>
                Integrated Engine
              </div>
              <div className="border-l border-gray-200 dark:border-gray-800 pl-8">
                <span className="block text-xl font-bold text-gray-900 dark:text-white">100% Client</span>
                Sandboxed Control
              </div>
            </motion.div>
          </div>

          {/* Interactive Hero Banner Art (Right Side) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-950/60 backdrop-blur-lg">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-150 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 font-mono text-xs text-gray-400 tracking-wide">Workspace.settings</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Server className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-mono text-emerald-500">Live Server Connected</span>
                </div>
              </div>

              {/* Mock visual canvas preview */}
              <div className="rounded-xl bg-gray-900 p-6 font-sans text-sm text-gray-200 space-y-4 shadow-inner relative overflow-hidden h-[340px] flex flex-col justify-center">
                {/* SVG connection lines overlay */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full">
                  <line x1="28%" y1="50%" x2="72%" y2="28%" stroke="rgb(99 102 241 / 0.4)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="28%" y1="50%" x2="72%" y2="72%" stroke="rgb(16 185 129 / 0.4)" strokeWidth="2" strokeDasharray="4 2" />
                </svg>

                {/* Left Origin Node */}
                <div className="relative z-10 w-2/5 p-3 rounded-lg border border-indigo-500/30 bg-indigo-950/60 shadow-lg self-start">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs">A</span>
                    <span className="font-bold text-xs uppercase text-indigo-300">Creator Hub</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">brand = &quot;AuraAI&quot;</p>
                </div>

                {/* Right Output Node 1 */}
                <div className="relative z-10 w-2/5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/60 shadow-lg self-end -mt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">🚀</span>
                    <span className="font-bold text-xs uppercase text-emerald-300">Viral Copy</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Generating 3 variants...</p>
                </div>

                {/* Right Output Node 2 */}
                <div className="relative z-10 w-2/5 p-3 rounded-lg border border-amber-500/30 bg-amber-950/60 shadow-lg self-end mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold text-xs">🔍</span>
                    <span className="font-bold text-xs uppercase text-amber-300">SEO Keyword</span>
                  </div>
                  <p className="text-[11px] text-gray-400">15 keyword tags mapped</p>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded bg-gray-800/80 p-2 backdrop-blur-sm border border-gray-700/50">
                  <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 text-indigo-400 animate-spin" />
                    Chaining active assets
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">Campaign ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
