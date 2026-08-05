import React, { useState } from "react";

interface ProjectMockupProps {
  type: "dashboard" | "website" | "mobile" | "calculator" | "ai-tool";
  accentColor: string;
  theme: "light" | "dark";
  title: string;
}

export function ProjectMockup({ type, accentColor, theme, title }: ProjectMockupProps) {
  // Calculator state
  const [area, setArea] = useState(85);
  const [quality, setQuality] = useState("premium"); // standard, premium, lux
  
  // AI Prompt Generator state
  const [room, setRoom] = useState("მისაღები ოთახი");
  const [style, setStyle] = useState("მინიმალისტური");
  const [copied, setCopied] = useState(false);

  // Calculate price dynamically
  const calculatePrice = () => {
    const basePrice = quality === "lux" ? 250 : quality === "premium" ? 150 : 80;
    return (area * basePrice).toLocaleString();
  };

  // Generate AI prompt dynamically
  const getPrompt = () => {
    const styleEng = style === "მინიმალისტური" ? "minimalist" : style === "კლასიკური" ? "classic classicist" : "modern scandinavian";
    const roomEng = room === "მისაღები ოთახი" ? "living room" : room === "საძინებელი" ? "bedroom" : "kitchen space";
    return `/imagine prompt: A stunning ${styleEng} ${roomEng}, cinematic lighting, photorealistic rendering, archdaily showcase, 8k resolution, ultra-detailed --ar 16:9`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme === "dark";

  return (
    <div 
      className={`w-full rounded-2xl shadow-xl overflow-hidden border border-zinc-200/20 transition-all duration-300 ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-800"
      }`}
    >
      {/* Browser chrome header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-100"
      }`}>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 block"></span>
          <span className="w-3 h-3 rounded-full bg-green-400 block"></span>
          <span className={`text-xs ml-3 font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            {title.toLowerCase().replace(/\s+/g, "-")}.dekabyte.ge
          </span>
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
          isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200/60 text-zinc-600"
        }`}>
          {type}
        </div>
      </div>

      {/* Main viewport */}
      <div className="p-4 sm:p-6 min-h-[280px] sm:min-h-[340px] flex flex-col justify-between">
        
        {/* Render different mockups based on type */}
        {type === "dashboard" && (
          <div className="flex flex-col h-full justify-between gap-4">
            {/* Stats Header */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-3 rounded-xl border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                <p className="text-[10px] opacity-60">აქტიური შეკვეთა</p>
                <p className="text-lg font-bold text-amber-500">12</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                <p className="text-[10px] opacity-60">მზადდება</p>
                <p className="text-lg font-bold text-blue-500">3</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-100"}`}>
                <p className="text-[10px] opacity-60">დასრულებული</p>
                <p className="text-lg font-bold text-emerald-500">148</p>
              </div>
            </div>

            {/* Orders Feed */}
            <div className="space-y-2">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                isDark ? "bg-zinc-900/30 border-zinc-800/80" : "bg-zinc-50/50 border-zinc-100"
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <div>
                    <span className="font-semibold">შეკვეთა #1024</span>
                    <p className="text-[10px] opacity-50">ორმაგი ბურგერი • კოკა-კოლა</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-amber-500">24.50 ₾</span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                isDark ? "bg-zinc-900/30 border-zinc-800/80" : "bg-zinc-50/50 border-zinc-100"
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <div>
                    <span className="font-semibold">შეკვეთა #1023</span>
                    <p className="text-[10px] opacity-50">პეპერონი პიცა • ფორთოხლის წვენი</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-blue-500">32.00 ₾</span>
              </div>
            </div>

            {/* Simulated Live Connection indicator */}
            <div className="flex items-center justify-between text-[10px] opacity-60 font-mono pt-2 border-t border-zinc-200/10">
              <span>სერვერი: მუშაობს</span>
              <span className="text-emerald-500 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 inline-block"></span>
                LIVE კავშირი
              </span>
            </div>
          </div>
        )}

        {type === "calculator" && (
          <div className="flex flex-col h-full justify-between gap-4">
            <p className="text-xs font-semibold opacity-80">ინტერიერის ღირებულების კალკულატორი</p>
            
            {/* Interactive Inputs */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-70">ფართობი:</span>
                  <span className="font-bold font-mono">{area} მ²</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  value={area} 
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs opacity-70 block mb-1.5">დიზაინის პაკეტი:</span>
                <div className="grid grid-cols-3 gap-1">
                  {["standard", "premium", "lux"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-1 px-1.5 rounded text-[10px] font-medium transition-all capitalize ${
                        quality === q 
                          ? "bg-emerald-500 text-white" 
                          : isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      {q === "standard" ? "სტანდარტ" : q === "premium" ? "პრემიუმ" : "ლუქსი"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary display */}
            <div className={`p-3 rounded-xl border flex items-center justify-between mt-1 ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-emerald-100"
            }`}>
              <div>
                <p className="text-[10px] opacity-60">სავარაუდო ბიუჯეტი</p>
                <p className="text-sm font-semibold opacity-80">პროექტის შეფასება</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-500 font-mono">{calculatePrice()} ₾</span>
                <p className="text-[9px] opacity-40">მოიცავს სრულ ნახაზებს</p>
              </div>
            </div>
          </div>
        )}

        {type === "website" && (
          <div className="flex flex-col h-full justify-between gap-3">
            {/* Custom SVG/CSS browser header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/10">
              <span className="text-xs font-bold text-pink-500 tracking-wide font-mono">GBP Kinder</span>
              <div className="flex space-x-2 text-[9px] opacity-70 font-semibold">
                <span>ჩვენს შესახებ</span>
                <span>პროგრამები</span>
                <span>გალერეა</span>
              </div>
            </div>

            {/* Cute Hero Illustration */}
            <div className={`p-4 rounded-xl text-center border relative overflow-hidden ${
              isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-pink-50/40 border-pink-100"
            }`}>
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-pink-400 opacity-60 animate-bounce"></div>
              <div className="absolute bottom-2 right-4 w-4 h-4 rounded-full bg-yellow-400 opacity-60 animate-pulse"></div>
              
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">
                საუკეთესო გარემო თქვენი პატარებისთვის
              </h4>
              <p className="text-[10px] opacity-60 max-w-[200px] mx-auto mb-2">
                თბილი, უსაფრთხო და საგანმანათლებლო სივრცე
              </p>
              <button className="bg-pink-500 text-white text-[9px] font-semibold py-1 px-3 rounded-full hover:bg-pink-600 transition-colors">
                რეგისტრაცია
              </button>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[9px] text-center font-medium">
              <div className={`p-1.5 rounded ${isDark ? "bg-zinc-900/80" : "bg-zinc-100"}`}>
                🎨 ხატვა
              </div>
              <div className={`p-1.5 rounded ${isDark ? "bg-zinc-900/80" : "bg-zinc-100"}`}>
                🇬🇧 ინგლისური
              </div>
              <div className={`p-1.5 rounded ${isDark ? "bg-zinc-900/80" : "bg-zinc-100"}`}>
                🧩 ლოგიკა
              </div>
            </div>
          </div>
        )}

        {type === "ai-tool" && (
          <div className="flex flex-col h-full justify-between gap-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold opacity-80">Render Prompt AI Studio</span>
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            </div>

            {/* Dropdowns simulation */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] opacity-50 block mb-1">ოთახის ტიპი:</label>
                <select 
                  value={room} 
                  onChange={(e) => setRoom(e.target.value)}
                  className={`w-full p-1.5 text-[10px] rounded border ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                  }`}
                >
                  <option value="მისაღები ოთახი">მისაღები ოთახი</option>
                  <option value="საძინებელი">საძინებელი</option>
                  <option value="სამზარეულო">სამზარეულო</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] opacity-50 block mb-1">დიზაინის სტილი:</label>
                <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className={`w-full p-1.5 text-[10px] rounded border ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                  }`}
                >
                  <option value="მინიმალისტური">მინიმალისტური</option>
                  <option value="კლასიკური">კლასიკური</option>
                  <option value="სკანდინავიური">სკანდინავიური</option>
                </select>
              </div>
            </div>

            {/* Generated prompt box */}
            <div className={`p-2 rounded-lg border font-mono text-[9px] relative ${
              isDark ? "bg-zinc-900/80 border-zinc-800 text-violet-300" : "bg-violet-50/50 border-violet-100 text-violet-950"
            }`}>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-12">
                {getPrompt()}
              </div>
              <button 
                onClick={handleCopy}
                className="absolute right-1 top-1 bottom-1 px-2 rounded bg-violet-600 text-white text-[8px] font-semibold uppercase hover:bg-violet-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="text-[9px] opacity-50 text-center italic">
              რენდერისთვის მზა ინგლისური AI ინსტრუქცია გენერირდება მყისიერად.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
