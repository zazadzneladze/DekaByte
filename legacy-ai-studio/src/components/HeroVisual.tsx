import React from "react";
import { Sparkles, Terminal, Activity, Smartphone, LineChart, Code2, ShieldCheck, Zap } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="w-full relative min-h-[400px] lg:min-h-[480px] flex items-center justify-center select-none p-2 sm:p-4 overflow-hidden">
      
      {/* Decorative Glow Effects & Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.10)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:18px_18px]" />
      
      {/* Container for the layered composition */}
      <div className="relative w-full max-w-[490px] lg:max-w-[530px] aspect-[4/3]">
        
        {/* Layer 1: High-fidelity SaaS Web Dashboard (Large main backdrop card) */}
        <div className="absolute w-[88%] h-[82%] top-0 left-0 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:border-brand-primary/40 group">
          
          {/* Dashboard Header */}
          <div className="px-4 py-3 bg-zinc-50/80 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-850/80 flex items-center justify-between">
            <div className="flex space-x-1.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/90 block shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 block shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 block shadow-sm" />
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pl-2">dashboard.dekabyte.ge</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">SYSTEM ACTIVE</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 space-y-3.5">
            
            {/* Real Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850/60 shadow-2xs">
                <p className="text-[8px] font-mono text-zinc-400 uppercase font-extrabold tracking-wider">მომხმარებლები</p>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-sm font-black text-zinc-900 dark:text-white font-mono">18,420</span>
                  <span className="text-[7px] text-emerald-500 font-bold">▲ +14%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850/60 shadow-2xs">
                <p className="text-[8px] font-mono text-zinc-400 uppercase font-extrabold tracking-wider">შემოსავალი</p>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-sm font-black text-zinc-900 dark:text-white font-mono">₾12,850</span>
                  <span className="text-[7px] text-emerald-500 font-bold">▲ +22%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850/60 shadow-2xs">
                <p className="text-[8px] font-mono text-zinc-400 uppercase font-extrabold tracking-wider">სიჩქარე</p>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-sm font-black text-zinc-900 dark:text-white font-mono">0.14s</span>
                  <span className="text-[7px] text-brand-cyan font-bold">● FAST</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Sales/Analytics Chart */}
            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850/60 space-y-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-sans font-extrabold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <LineChart className="w-3 h-3 text-brand-primary dark:text-brand-cyan" />
                  რეალურ დროში გაყიდვების დინამიკა
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-brand-primary/10 dark:bg-brand-cyan/10 text-brand-primary dark:text-brand-cyan font-bold">
                  PROD-API V2
                </span>
              </div>
              
              {/* Chart bars and path simulation */}
              <div className="flex items-end justify-between h-14 pt-2 gap-1.5">
                {[45, 65, 50, 85, 60, 98, 80].map((val, idx) => (
                  <div key={idx} className="w-full bg-zinc-200/60 dark:bg-zinc-800/80 rounded-t-md h-full flex flex-col justify-end">
                    <div 
                      style={{ height: `${val}%` }} 
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        idx === 5 
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm" 
                          : idx === 6 
                          ? "bg-gradient-to-t from-sky-500 to-cyan-400 shadow-sm" 
                          : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Bottom labels */}
              <div className="flex justify-between text-[7px] font-mono text-zinc-400 font-bold pt-1">
                <span>ორშ</span>
                <span>სამ</span>
                <span>ოთხ</span>
                <span>ხუთ</span>
                <span>პარ</span>
                <span>შაბ</span>
                <span>კვ</span>
              </div>
            </div>

          </div>
        </div>

        {/* Layer 2: Sleek Native Android/iOS App Overlay (Floating Phone) */}
        <div className="absolute w-[42%] h-[76%] bottom-0 right-0 rounded-[32px] bg-zinc-950 text-white border-4 border-zinc-800/90 shadow-[0_30px_70px_rgba(0,0,0,0.4)] p-3.5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:translate-y-[-6px] hover:border-brand-cyan/40">
          
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 block" />
          </div>

          {/* Mini App Header */}
          <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500 pt-2">
            <span className="font-bold text-zinc-400">12:45</span>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-1.5 border border-zinc-700 rounded-xs block bg-emerald-500" />
            </div>
          </div>

          {/* App Body Content */}
          <div className="space-y-2 mt-2 flex-1">
            <div className="flex items-center space-x-1.5 pt-1">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[8px] font-sans font-black tracking-tight text-white">DekaByte Native</p>
                <p className="text-[6px] font-mono text-zinc-400">Android Kotlin</p>
              </div>
            </div>

            {/* Quick Balance Card */}
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-1">
              <p className="text-[6px] text-zinc-400 uppercase tracking-wider font-mono font-bold">ბალანსი</p>
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-extrabold font-mono text-white">₾2,480.00</span>
                <span className="text-[6px] text-emerald-400 font-bold">+28%</span>
              </div>
            </div>

            {/* Simulated List Items */}
            <div className="space-y-1">
              <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800/60 flex justify-between items-center text-[6px]">
                <span className="text-zinc-200 font-medium">ონლაინ შეკვეთა</span>
                <span className="text-emerald-400 font-mono font-bold">₾42.50</span>
              </div>
              <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800/60 flex justify-between items-center text-[6px]">
                <span className="text-zinc-200 font-medium">სტატუსი #102</span>
                <span className="text-brand-cyan font-mono font-bold">მზადდება</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-sans font-bold text-[8px] py-1.5 rounded-lg text-center shadow-md transition-all hover:opacity-90 cursor-pointer">
              დადასტურება
            </button>
          </div>
        </div>

        {/* Layer 3: Tech stack badge - TypeScript & React (Left float) */}
        <div className="absolute top-[28%] -left-[3%] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl p-2 sm:p-2.5 shadow-xl flex items-center space-x-2 text-[9px] transition-all duration-300 hover:scale-105">
          <div className="p-1.5 bg-blue-500/10 text-brand-primary rounded-lg">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-extrabold text-zinc-900 dark:text-zinc-100">TS & React 19</p>
            <p className="text-[8px] text-zinc-500 dark:text-zinc-400">სუფთა არქიტექტურა</p>
          </div>
        </div>

        {/* Layer 4: Tech stack badge - Kotlin & Android (Top right float) */}
        <div className="absolute -top-[4%] right-[8%] bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center space-x-2 text-[8px] font-mono text-zinc-200">
          <Terminal className="w-3.5 h-3.5 text-brand-cyan shrink-0 animate-pulse" />
          <span className="font-bold">KOTLIN / JETPACK COMPOSE</span>
        </div>

        {/* Layer 5: Performance Badge (Middle float) */}
        <div className="absolute top-[48%] right-[40%] bg-emerald-500 text-white rounded-full px-2.5 py-1 shadow-xl flex items-center space-x-1.5 text-[8px] font-bold tracking-wider font-mono">
          <Zap className="w-2.5 h-2.5 fill-current" />
          <span>99/100 SPEED SCORE</span>
        </div>

      </div>
    </div>
  );
}

