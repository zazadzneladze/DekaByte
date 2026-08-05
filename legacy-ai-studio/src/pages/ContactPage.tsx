import React from "react";
import { Mail, Phone, MessageSquare, AlertTriangle, Sparkles, MapPin } from "lucide-react";
import { InquiryForm } from "../components/InquiryForm";
import { siteConfig } from "../data/site";

interface ContactPageProps {
  sharedBrief?: string;
}

export function ContactPage({ sharedBrief = "" }: ContactPageProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-24 pb-16 relative">
      {/* Dynamic primary and cyan gradients */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[350px] h-[350px] bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-brand-primary dark:text-brand-cyan">
            <Mail className="w-3.5 h-3.5 mr-1" />
            <span>კონტაქტი & შეკვეთა</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            დაიწყე პროექტი <span className="text-brand-primary dark:text-brand-cyan">ჩვენთან ერთად</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
            გაგვიზიარეთ თქვენი პროექტის მოკლე აღწერა ან AI კონსულტანტის მიერ შედგენილი ბრიფი, და ჩვენი გუნდი მყისიერად დაგიკავშირდებათ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-zinc-50/50 dark:bg-zinc-900/15 border border-zinc-200/50 dark:border-zinc-850 p-6 sm:p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-sans font-extrabold text-zinc-900 dark:text-white">
                საკონტაქტო ინფორმაცია
              </h3>
              
              <div className="space-y-4 font-sans text-sm">
                
                {/* Whatsapp / Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary dark:text-brand-cyan flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">ტელეფონი / WhatsApp</p>
                    <a 
                      href={`https://wa.me/${siteConfig.phone.replace("+", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-primary dark:hover:text-brand-cyan transition-colors mt-0.5 block"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-primary dark:text-brand-cyan flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">ელფოსტა</p>
                    <a 
                      href={`mailto:${siteConfig.email}`}
                      className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-primary dark:hover:text-brand-cyan transition-colors mt-0.5 block"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/5 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">მისამართი</p>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      თბილისი, საქართველო
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Premium service guarantee banner */}
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono font-black text-brand-cyan uppercase tracking-widest block">
                ✦ DEKABYTE GUARANTEE
              </span>
              <h4 className="text-base font-sans font-bold text-zinc-100">
                სწრაფი გამოხმაურების გარანტია
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                გაგზავნიდან მაქსიმუმ 2 საათის განმავლობაში ჩვენი პროექტის არქიტექტორი დაგიკავშირდებათ დეტალური განხილვისთვის.
              </p>
            </div>
          </div>

          {/* Right panel: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="shadow-2xl rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-850">
              <InquiryForm prefilledDescription={sharedBrief} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
