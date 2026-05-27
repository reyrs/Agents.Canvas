import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Sophia Vance",
      role: "VP of Growth Marketing",
      company: "InnovateSaaS",
      quote: "Creating canvas structures with specialized agents transformed how we plan our marketing calendars. The integration with Gemini generates copy that perfectly matches our brand instructions on the first try. Standard draft setup is now 10x faster.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Devon Chen",
      role: "Founder & Lead Copywriter",
      company: "DraftSprints Agency",
      quote: "Being able to visually map out an Ad Copywriter connected to an SEO Keyword Planner in one unified canvas is brilliant. No more repetitive copy-pasting of company descriptions. The mock database system is extremely robust and fast.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Marcella Thorne",
      role: "E-Commerce Director",
      company: "VelvetGlow Cosmetics",
      quote: "The Product Benefit Mapper agent turns raw technical spreadsheets into absolute emotional art. Our landing page conversion spiked by 32% since shifting copy creation into these connected visual maps.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-gray-50/50 dark:bg-gray-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Lauded by Growing Marketing Teams
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">
            Hear from media buyers, brand storytellers, and startup founders who launched connected agents.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              id={`testimonial-${idx}`}
              key={idx}
              className="bento-card p-6 flex flex-col justify-between space-y-6 text-left bento-glow-indigo"
            >
              <div className="space-y-4 relative z-10 text-left">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed font-sans">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-805 relative z-10 text-left">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-zinc-800"
                />
                <div className="text-left">
                  <h4 className="bento-header text-sm font-bold text-gray-900 dark:text-white leading-none">
                    {t.name}
                  </h4>
                  <span className="text-xs text-gray-400 font-sans mt-1 block">
                    {t.role}, {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
