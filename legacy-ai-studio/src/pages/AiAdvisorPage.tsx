import React from "react";
import { Sparkles, Terminal, ArrowRight, ShieldCheck, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { AiConsultant } from "../components/AiConsultant";

interface AiAdvisorPageProps {
  onApplyBrief: (briefText: string) => void;
}

export function AiAdvisorPage({ onApplyBrief }: AiAdvisorPageProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-20 pb-16 relative">
      
      {/* Subtle brand glow backgrounds */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-primary/5 dark:bg-brand-primary/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Information & Instructions Panel */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-brand-primary/5 dark:bg-brand-primary/15 border border-brand-primary/10 dark:border-brand-primary/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-brand-primary dark:text-brand-cyan uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
              <span>DekaByte AI Core</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              AI პროექტის არქიტექტორი
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              ეს არის ინტერაქტიული ასისტენტი, რომელიც დაგეხმარებათ იდეის გაზიარებისთანავე ჩამოაყალიბოთ სავარაუდო ფუნქციონალი, საჭირო არქიტექტურა და სამუშაო ეტაპები. ჩატის ბოლოს შეგიძლიათ ავტომატურად გადაიტანოთ ბრიფი შეკვეთის ფორმაში!
            </p>

            {/* Quick Benefits Checklist */}
            <div className="space-y-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary dark:text-brand-cyan shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-zinc-800 dark:text-white">ტექნოლოგიური სტრუქტურა</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">ავტომატურად გირჩევთ საუკეთესო ტექნოლოგიურ გადაწყვეტას თქვენი იდეისთვის.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850">
                <FileText className="w-4.5 h-4.5 text-brand-primary dark:text-brand-cyan shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-zinc-800 dark:text-white">მყისიერი ტექნიკური ბრიფი</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">ჩატის ბოლოს შეგიძლიათ გადაიტანოთ ბრიფი შეკვეთის ფორმაში ერთი კლიკით.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-sans leading-relaxed text-left max-w-md mx-auto lg:mx-0">
              💡 <strong>რჩევა:</strong> დაწერეთ მარტივი წინადადება, მაგალითად: <em>„მინდა ტანსაცმლის ონლაინ მაღაზია“</em> ან <em>„სასტუმროს ჯავშნების სისტემა“</em> და დანარჩენს AI დაგაკვალიანებთ.
            </div>
          </div>

          {/* Interactive Chat Frame */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl shadow-md">
              <AiConsultant onApplyBrief={onApplyBrief} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
