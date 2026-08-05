import React from "react";
import { Zap, HelpCircle, ArrowRight, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { BudgetCalculator } from "../components/BudgetCalculator";
import { Link } from "react-router-dom";

export function CalculatorPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-20 pb-16 relative">
      
      {/* Subtle brand glow backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-brand-primary/5 dark:bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-brand-primary/5 dark:bg-brand-primary/15 border border-brand-primary/10 dark:border-brand-primary/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-brand-primary dark:text-brand-cyan">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE ESTIMATOR</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            პროექტის ბიუჯეტის კალკულატორი
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
            მონიშნეთ თქვენთვის სასურველი პროდუქტი, მოცულობა და დამატებითი მოდულები, რათა მყისიერად მიიღოთ საწყისი სავარაუდო შეფასება.
          </p>
        </div>

        {/* Professional starting-range alert message (MANDATORY REQUIREMENT) */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-400 flex items-start space-x-3 text-xs leading-relaxed font-sans">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <p className="font-bold">მნიშვნელოვანი ინფორმაცია ფასებთან დაკავშირებით:</p>
            <p>
              კალკულატორი აჩვენებს საწყის სავარაუდო შეფასებას. საბოლოო ღირებულება ზუსტდება პროექტის განხილვის შემდეგ. ეს არის საწყისი სავარაუდო დიაპაზონი და არა ფიქსირებული საბოლოო შემოთავაზება.
            </p>
          </div>
        </div>

        {/* Budget Calculator Card Container */}
        <div className="shadow-lg rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-850">
          <BudgetCalculator />
        </div>

        {/* Additional details underneath */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-850 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-sans font-bold text-zinc-900 dark:text-white flex items-center">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-primary dark:text-brand-cyan mr-2" />
              როგორ განისაზღვრება ფასი?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              ფასი გამოითვლება სავარაუდო სამუშაო საათებისა და პროექტის სირთულის მიხედვით. საბოლოო შეფასებისა და ოფიციალური შემოთავაზებისთვის დაგვიკავშირდით.
            </p>
          </div>

          <div className="text-center md:text-right">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-1.5 bg-brand-primary hover:bg-blue-600 dark:bg-brand-cyan dark:hover:bg-sky-500 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>გააგზავნე მოთხოვნა</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
