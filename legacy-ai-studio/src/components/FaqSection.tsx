import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqData } from "../data/faq";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  return (
    <section id="faq" className="py-20 bg-zinc-50 dark:bg-zinc-950/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-center gap-1.5 mb-2">
            <HelpCircle className="w-4 h-4 text-zinc-400" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-900 dark:text-white tracking-tight">
            ხშირად დასმული კითხვები
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            გაეცანით პასუხებს ჩვენს მუშაობასთან დაკავშირებულ ყველაზე გავრცელებულ კითხვებზე.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-btn-${faq.id}`}
                >
                  <span className="font-sans font-semibold text-zinc-800 dark:text-zinc-200 text-sm sm:text-base group-hover:text-zinc-950 dark:group-hover:text-white transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                {/* Expandable Panel */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? "max-h-[500px] border-t border-zinc-100 dark:border-zinc-800/60 opacity-100" 
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-5 py-4 sm:px-6 sm:py-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
