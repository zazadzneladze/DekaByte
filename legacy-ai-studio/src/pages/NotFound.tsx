import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

export function NotFound() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 text-center">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-8 sm:p-12 rounded-3xl max-w-md shadow-md space-y-6">
        
        {/* Animated Icon Container */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40">
          <HelpCircle className="w-10 h-10 text-zinc-400 dark:text-zinc-500 animate-pulse" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            404
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-sans font-extrabold text-zinc-950 dark:text-white">
            გვერდი ვერ მოიძებნა
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
            სამწუხაროდ, გვერდი რომელსაც ეძებთ არ არსებობს, წაშლილია ან შეცვლილია მისი მისამართი.
          </p>
        </div>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 py-3.5 px-6 rounded-xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>მთავარ გვერდზე დაბრუნება</span>
        </Link>
      </div>
    </div>
  );
}
