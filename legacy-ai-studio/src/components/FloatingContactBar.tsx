import React from "react";
import { Phone, MessageSquare, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "../data/site";

export function FloatingContactBar() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-850 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2.5">
        
        {/* Phone Call */}
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex-1 py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center space-x-1.5 active:bg-zinc-850 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="text-[10px] font-sans font-bold text-zinc-200">დარეკვა</span>
        </a>

        {/* WhatsApp Chat */}
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 px-3 bg-brand-primary/20 border border-brand-primary/30 rounded-xl flex items-center justify-center space-x-1.5 active:bg-brand-primary/40 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span className="text-[10px] font-sans font-bold text-white">WhatsApp</span>
        </a>

        {/* Mail Contact */}
        <a
          href={`mailto:${siteConfig.email}`}
          className="flex-1 py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center space-x-1.5 active:bg-zinc-850 transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] font-sans font-bold text-zinc-200">ფოსტა</span>
        </a>

      </div>
    </div>
  );
}
