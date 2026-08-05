import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track scrolling to add background blur/shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "მთავარი", path: "/" },
    { label: "ნამუშევრები", path: "/#work" },
    { label: "მომსახურებები", path: "/services" },
    { label: "ბიუჯეტი", path: "/calculator" },
    { label: "AI კონსულტანტი", path: "/ai-advisor" },
    { label: "კონტაქტი", path: "/contact" },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.includes("#")) {
      const [route, hash] = path.split("#");
      if (location.pathname !== route) {
        navigate(route);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-850/40 shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          
          {/* Logo with live status indicator badge */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center focus:outline-none group"
              id="nav-logo"
            >
              <Logo size="sm" />
            </Link>

            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>შეკვეთების მიღება</span>
            </div>
          </div>

          {/* Slim and visually light Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = 
                location.pathname === item.path || 
                (item.path.includes("#") && location.pathname === "/" && location.hash === `#${item.path.split("#")[1]}`);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`font-sans text-xs lg:text-sm font-semibold transition-all cursor-pointer relative py-1 ${
                    isActive
                      ? "text-brand-primary dark:text-brand-cyan"
                      : "text-zinc-500 hover:text-brand-primary dark:text-zinc-400 dark:hover:text-brand-cyan"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <Link
              to="/contact"
              className="bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm flex items-center space-x-1"
            >
              <span>დაიწყე პროექტი</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200/60 dark:border-zinc-850/60 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 pt-2 pb-6 space-y-3.5 shadow-md">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left font-sans text-sm font-bold py-1.5 border-b border-zinc-50 dark:border-zinc-900 ${
                    isActive
                      ? "text-brand-primary dark:text-brand-cyan"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-2">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-zinc-950 hover:bg-zinc-850 dark:bg-white text-white dark:text-zinc-950 py-2.5 rounded-lg text-sm font-bold shadow-sm"
              >
                დაიწყე პროექტი
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
