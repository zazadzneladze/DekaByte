import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const dimensions = {
    sm: { svg: "w-6 h-6", text: "text-lg font-bold tracking-tight" },
    md: { svg: "w-8 h-8", text: "text-xl sm:text-2xl font-extrabold tracking-tight" },
    lg: { svg: "w-16 h-16", text: "text-4xl font-black tracking-tight" },
  };

  const selectedSize = dimensions[size];

  return (
    <div className={`flex items-center space-x-2 select-none ${className}`}>
      {/* Sleek, minimal digital monogram icon */}
      <svg
        viewBox="0 0 40 40"
        className={`${selectedSize.svg} shrink-0 shadow-sm rounded-lg`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="#090d16" /> {/* Graphite Background */}
        <path
          d="M11 10H22C25.5 10 27.5 11.5 27.5 14.5C27.5 16.5 26.5 18 24.5 18.8C27 19.5 28 21.2 28 24.2C28 27.5 25.5 30 22 30H11V10Z"
          fill="url(#logoGrad)"
        />
        {/* Knockout paths for the D and B holes */}
        <path
          d="M15 13.5H21C22.5 13.5 23.5 14.2 23.5 15.2C23.5 16.2 22.5 17 21 17H15V13.5Z"
          fill="#090d16"
        />
        <path
          d="M15 21.5H21.5C23 21.5 24 22.2 24 23.2C24 24.2 23 25 21.5 25H15V21.5Z"
          fill="#090d16"
        />
        <defs>
          <linearGradient id="logoGrad" x1="11" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" /> {/* Electric Blue */}
            <stop offset="100%" stopColor="#0ea5e9" /> {/* Tech Cyan */}
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span className={`font-sans ${selectedSize.text} tracking-tight text-zinc-950 dark:text-white font-extrabold`}>
          Deka<span className="text-brand-primary dark:text-brand-cyan">Byte</span>
        </span>
      )}
    </div>
  );
}
