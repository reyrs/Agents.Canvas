import React from "react";
import { motion } from "motion/react";
import { 
  Workflow, Cpu, Database, CreditCard, Layers, Smartphone, Eye, ShieldAlert 
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Features() {
  const list: Feature[] = [
    {
      title: "Interactive SVG Connection Canvas",
      description: "Map operational lines visually. Connect brand definition inputs directly to specialized output agents.",
      icon: <Workflow className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    },
    {
      title: "Gemini 3.5-Flash Core Integrator",
      description: "Generates high-fidelity direct-response copy, target matrices, and authority newsletters within seconds.",
      icon: <Cpu className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    },
    {
      title: "Local DB Campaign Records",
      description: "Full mock database keeps your historical assets secure inside persistent file stores across restarts.",
      icon: <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    },
    {
      title: "Credit-Based Balance Control",
      description: "Simulates actual campaign credit cost depletion. Get 100 free tokens, upgrade anytime to top up.",
      icon: <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
    },
    {
      title: "Clean Dynamic Input Adapters",
      description: "Form boundaries update on-the-fly according to your chosen agent's input properties.",
      icon: <Layers className="h-5 w-5 text-pink-600 dark:text-pink-400" />
    },
    {
      title: "Complete Responsive Architecture",
      description: "Smooth collapsible drawer menus and drag control coordinates styled to fit mobile screens elegantly.",
      icon: <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    },
    {
      title: "Output Campaign Sandbox Preview",
      description: "Copy to clipboard, preview output styling, or trigger instant local text file downloads.",
      icon: <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    },
    {
      title: "Zero API Key Cold-Start Safelines",
      description: "App runs flawlessly in simulated showcase mode if your Google Gemini API Key is not yet configured.",
      icon: <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50/30 dark:bg-gray-900/10 border-y border-gray-150 dark:border-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Powerhouse Infrastructure Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            Engineered with modern full-stack foundations, giving you pristine workflow layout control.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((feat, idx) => (
            <motion.div
              id={`features-block-${idx}`}
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bento-card p-6 flex flex-col items-start gap-4 hover:border-indigo-500/30 transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 relative z-10">
                {feat.icon}
              </div>
              <div className="space-y-2 relative z-10 text-left">
                <h3 className="bento-header text-sm font-bold text-gray-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
