import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  MessageCircle, 
  Layers, 
  Sparkles, 
  Phone, 
  MessageSquare,
  Briefcase,
  TrendingUp,
  Settings,
  Zap,
  ChevronRight,
  Code2,
  Check,
  Play,
  HelpCircle,
  Mail,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { siteConfig } from "../data/site";
import { projectsData } from "../data/projects";
import { servicesData } from "../data/services";
import { faqData } from "../data/faq";
import { HeroVisual } from "../components/HeroVisual";
import { ProjectMockup } from "../components/ProjectMockup";

export function Home() {
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "website" | "webapp" | "ai">("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredProjects = projectsData.filter((project) => {
    if (portfolioFilter === "all") return true;
    if (portfolioFilter === "website") {
      const cat = project.category.toLowerCase();
      return cat.includes("ვებსაიტი") || cat.includes("website") || cat.includes("ბაღის");
    }
    if (portfolioFilter === "webapp") {
      const cat = project.category.toLowerCase();
      return cat.includes("web app") || cat.includes("application") || cat.includes("სისტემა");
    }
    if (portfolioFilter === "ai") {
      const cat = project.category.toLowerCase();
      return cat.includes("ai") || cat.includes("ხელსაწყო") || cat.includes("prompter") || cat.includes("tool");
    }
    return true;
  });

  // Advantages data
  const advantages = [
    {
      title: "ინდივიდუალური მიდგომა",
      description: "ყოველი პროექტი იქმნება ნულიდან, თქვენი ბიზნესის სპეციფიკური საჭიროებებისა და სამიზნე აუდიტორიის ზუსტი ანალიზით.",
      bgColor: "bg-blue-500/5 dark:bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "თანამედროვე და გამართული დიზაინი",
      description: "ჩვენი ინტერფეისები არის სუფთა, მინიმალისტური და სრულად ადაპტირებული თანამედროვე გლობალურ ციფრულ ტრენდებთან.",
      bgColor: "bg-brand-cyan/5 dark:bg-brand-cyan/10",
      textColor: "text-brand-cyan dark:text-brand-cyan"
    },
    {
      title: "მობილურ მოწყობილობებზე ადაპტაცია",
      description: "ვებ-პროდუქტები იგეგმება Mobile-First პრინციპით, რაც გარანტიას გაძლევთ, რომ საიტი იდეალურად იმუშავებს ნებისმიერ ტელეფონზე.",
      bgColor: "bg-emerald-500/5 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "მარტივად სამართავი სისტემები",
      description: "ჩვენ ვამარტივებთ კონტენტის მართვას. საიტის რედაქტირებისთვის თქვენ არ დაგჭირდებათ პროგრამირების ცოდნა ან რთული კოდი.",
      bgColor: "bg-amber-500/5 dark:bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "პროექტის სრული ციკლი",
      description: "იდეის განხილვა, სტრუქტურის დაგეგმვა, დიზაინის შექმნა, დეველოპმენტი, ტესტირება და გაშვება — ყველაფერს ჩვენი სტუდია ფარავს.",
      bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "გაშვების შემდგომი მხარდაჭერა",
      description: "ჩვენ არ გტოვებთ საიტის გაშვებისთანავე. უზრუნველყოფთ გარანტირებულ ტექნიკურ მხარდაჭერასა და კონსულტაციებს.",
      bgColor: "bg-purple-500/5 dark:bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  // Work steps data
  const steps = [
    {
      num: "01",
      title: "იდეის განხილვა",
      desc: "ვარკვევთ პროექტის მიზანს, საჭიროებებსა და მთავარ ამოცანებს."
    },
    {
      num: "02",
      title: "სტრუქტურა & დიზაინი",
      desc: "ვგეგმავთ მომხმარებლის გზას, გვერდების სტრუქტურასა და ვიზუალურ მიმართულებას."
    },
    {
      num: "03",
      title: "დეველოპმენტი",
      desc: "ვაწყობთ სწრაფ, გამართულ და სხვადასხვა მოწყობილობაზე მორგებულ პროდუქტს."
    },
    {
      num: "04",
      title: "ტესტირება & გაშვება",
      desc: "ვამოწმებთ ფუნქციებს, ვასწორებთ დეტალებს და ვუშვებთ დასრულებულ პროექტს."
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      
      {/* 1. HERO SECTION (Cleaner split layout) */}
      <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20 border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-950 dark:to-zinc-950 overflow-hidden">
        
        {/* Abstract subtle background branding glows */}
        <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-brand-primary/5 dark:bg-brand-primary/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Sharp Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-primary/5 dark:bg-brand-primary/15 border border-brand-primary/10 dark:border-brand-primary/20 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary dark:text-brand-cyan animate-pulse" />
                <span className="text-[10px] font-mono uppercase font-extrabold tracking-wider text-brand-primary dark:text-brand-cyan">
                  DEKABYTE DIGITAL PRODUCT STUDIO
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-zinc-950 dark:text-white leading-[1.15] max-w-2xl mx-auto lg:mx-0">
                ვებსაიტები, Android აპლიკაციები და <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-cyan-400">ციფრული სისტემები</span>
              </h1>
              
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                DekaByte ქმნის სწრაფ, თანამედროვე და მომხმარებელზე მორგებულ ციფრულ პროდუქტებს — იდეიდან დიზაინამდე, დეველოპმენტიდან გაშვებამდე.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-brand-primary hover:bg-blue-600 dark:bg-brand-cyan dark:hover:bg-sky-500 text-white font-bold py-3.5 px-7 rounded-xl text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer text-center inline-flex items-center justify-center space-x-2"
                >
                  <span>პროექტის დაწყება</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById("work");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-bold py-3.5 px-7 rounded-xl text-xs sm:text-sm tracking-wide border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer text-center"
                >
                  ნამუშევრების ნახვა
                </button>
              </div>

              {/* Trust Badge Highlights */}
              <div className="pt-4 border-t border-zinc-150/80 dark:border-zinc-850/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center lg:text-left text-[11px] font-sans text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% სუფთა კოდი</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>SEO ოპტიმიზაცია</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>მობილური ადაპტაცია</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>24/7 მხარდაჭერა</span>
                </div>
              </div>
            </div>

            {/* Right Column: Custom Product Mockup Block */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 2. PORTFOLIO / FEATURED WORK (Immediately after hero) */}
      <section id="work" className="py-16 scroll-mt-16 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
            <div className="text-center lg:text-left max-w-xl space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan flex items-center justify-center lg:justify-start gap-1">
                <Briefcase className="w-3.5 h-3.5" /> პორტფოლიო
              </span>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
                შესრულებული პროექტები
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                ვებსაიტები, აპლიკაციები და ციფრული სისტემები, რომლებიც რეალური ბიზნეს ამოცანების გადასაჭრელად შევქმენით.
              </p>
            </div>

            {/* Clean filter tabs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 self-center lg:self-end">
              {[
                { id: "all", label: "ყველა" },
                { id: "website", label: "ვებსაიტები" },
                { id: "webapp", label: "Web Apps" },
                { id: "ai", label: "AI ხელსაწყოები" },
              ].map((tab) => {
                const isActive = portfolioFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPortfolioFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border ${
                      isActive
                        ? "bg-brand-primary dark:bg-zinc-900 text-white dark:text-brand-cyan border-brand-primary dark:border-zinc-800 shadow-sm"
                        : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-850/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Case-study Layout */}
          {filteredProjects.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-850">
              <p className="text-zinc-500 dark:text-zinc-400 font-sans text-xs">
                ამ კატეგორიაში პროექტები ჯერ არ არის დამატებული.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 sm:gap-14">
              {filteredProjects.map((project, idx) => {
                const isEven = idx % 2 === 0;
                // First two projects are wider, editorial case study style
                const isEditorial = idx < 2;

                return (
                  <div 
                    key={project.slug}
                    className={`flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Visual Area (Mockup) */}
                    <div className={`w-full lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="p-3 bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-150/50 dark:border-zinc-850/40 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <ProjectMockup 
                          type={project.design.mockupType}
                          accentColor={project.design.accentColor}
                          theme={project.design.theme}
                          title={project.title}
                        />
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className={`w-full lg:col-span-6 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      <span className="text-[10px] font-bold text-brand-primary dark:text-brand-cyan uppercase tracking-wider font-mono">
                        {project.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-zinc-900 dark:text-white leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 font-sans">
                        {project.shortDescription}
                      </p>

                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action trigger */}
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                        <Link 
                          to={`/work/${project.slug}`}
                          className="font-sans font-bold text-xs sm:text-sm text-zinc-900 dark:text-white hover:text-brand-primary dark:hover:text-brand-cyan inline-flex items-center space-x-1.5 group cursor-pointer"
                        >
                          <span>ქეისის დეტალები</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono hover:text-zinc-600 dark:hover:text-zinc-300 inline-flex items-center space-x-1"
                          >
                            <span>LIVE ვერსია</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 3. SERVICES (Compact & premium 2x2 grid) */}
      <section className="py-16 bg-zinc-50/40 dark:bg-zinc-900/10 border-t border-b border-zinc-100 dark:border-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan flex items-center justify-center gap-1">
              <Layers className="w-3.5 h-3.5" /> მომსახურებები
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              მომსახურების მიმართულებები
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              ჩვენი სტუდია ფარავს ვებ და მობილური პროდუქტების დაგეგმვის, დიზაინისა და დეველოპმენტის სრულ ციკლს.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {servicesData.map((service, index) => {
              const bgColors = [
                "bg-blue-500/5 border-blue-500/10 dark:bg-blue-500/10 dark:border-blue-500/20 text-blue-600 dark:text-blue-400",
                "bg-brand-cyan/5 border-brand-cyan/10 dark:bg-brand-cyan/10 dark:border-brand-cyan/20 text-brand-cyan",
                "bg-indigo-500/5 border-indigo-500/10 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
                "bg-purple-500/5 border-purple-500/10 dark:bg-purple-500/10 dark:border-purple-500/20 text-purple-600 dark:text-purple-400"
              ];
              const styleTheme = bgColors[index % bgColors.length];

              return (
                <div 
                  key={service.id}
                  className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm border ${styleTheme}`}>
                        {`0${index + 1}`}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold tracking-wider">
                        DEKABYTE STUDIO
                      </span>
                    </div>

                    <h3 className="text-lg font-sans font-bold text-zinc-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                    <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">ტექნოლოგიები და მაგალითები:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.examples.map((item) => (
                        <span 
                          key={item} 
                          className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850 text-zinc-600 dark:text-zinc-350"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/services"
              className="inline-flex items-center text-xs font-bold text-brand-primary dark:text-brand-cyan hover:opacity-80 transition-all font-sans"
            >
              <span>იხილე დეტალური მომსახურებები და პროცესი</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BUDGET CALCULATOR PREVIEW (Promote Pricing Estimator) */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Ambient Radial background glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="space-y-4 max-w-xl relative z-10 text-center md:text-left">
              <span className="inline-flex items-center space-x-1.5 bg-brand-primary/20 border border-brand-primary/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-brand-cyan">
                <Zap className="w-3.5 h-3.5 text-brand-cyan" />
                <span>მყისიერი კალკულატორი</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-sans font-black text-white leading-tight">
                გამოთვალე პროექტის ბიუჯეტი
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                ჩვენი ინტერაქტიული კალკულატორი დაგეხმარებათ წამებში შეაფასოთ ვებსაიტის, აპლიკაციის ან ციფრული სისტემის სავარაუდო ღირებულება და შესრულების დრო. მონიშნე სასურველი ფუნქციები და მიიღე საწყისი შეფასება.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto text-center">
              <Link
                to="/calculator"
                className="w-full md:w-auto px-6 py-3.5 bg-brand-primary hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-all font-sans cursor-pointer shadow-md inline-flex items-center justify-center space-x-1.5"
              >
                <span>ბიუჯეტის დათვლა</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORK PROCESS (How we work) */}
      <section className="py-16 bg-zinc-50/40 dark:bg-zinc-900/10 border-t border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan flex items-center justify-center gap-1">
              <Settings className="w-3.5 h-3.5" /> სამუშაო პროცესი
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              ორგანიზებული სამუშაო ეტაპები
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              გამჭვირვალე და სისტემური მიდგომა უზრუნველყოფს იდეების რეალურ და სრულყოფილ პროდუქტად გარდაქმნას.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-6 rounded-2xl shadow-sm space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-zinc-200 dark:text-zinc-800 tracking-tight group-hover:text-brand-cyan transition-colors">
                    {step.num}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-brand-primary/5 dark:bg-brand-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary dark:text-brand-cyan" />
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-sans font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WHY DEKABYTE (Advantages grid) */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> უპირატესობები
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              რატომ DEKABYTE?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              ხარისხი, პუნქტუალურობა და თანამედროვე ტექნოლოგიური სტანდარტები ჩვენი მუშაობის მთავარი პრინციპია.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-150/50 dark:border-zinc-900 hover:border-brand-primary/20 shadow-sm flex flex-col justify-between space-y-3 transition-all hover:bg-white dark:hover:bg-zinc-950 hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className={`w-9 h-9 rounded-lg ${adv.bgColor} flex items-center justify-center ${adv.textColor}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-sans font-bold text-zinc-950 dark:text-white">
                    {adv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {adv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. AI CONSULTANT PREVIEW */}
      <section className="py-16 bg-zinc-50/40 dark:bg-zinc-900/10 border-t border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Info */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-brand-primary dark:text-brand-cyan">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary dark:text-brand-cyan animate-pulse" />
                <span>AI ASSISTANT</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-sans font-black text-zinc-950 dark:text-white tracking-tight">
                ციფრული პროექტის AI არქიტექტორი
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                ეს არის ინტერაქტიული ასისტენტი, რომელიც დაგეხმარებათ იდეის გაზიარებისთანავე ჩამოაყალიბოთ სავარაუდო ფუნქციონალი, საჭირო არქიტექტურა და სამუშაო ეტაპები. ჩატის ბოლოს შეგიძლიათ ავტომატურად გადაიტანოთ ბრიფი შეკვეთის ფორმაში!
              </p>
              <div className="pt-2">
                <Link
                  to="/ai-advisor"
                  className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer font-sans"
                >
                  <span>გაესაუბრე AI არქიტექტორს</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Chat preview UI */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-brand-cyan/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="space-y-4">
                {/* Header of chat */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-850">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center animate-pulse">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold leading-tight text-zinc-900 dark:text-white">AI არქიტექტორი</p>
                      <p className="text-[7px] text-zinc-400 font-mono">DekaByte Digital Assistant</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-500">Google Gemini Powered</span>
                </div>

                {/* Messages stream */}
                <div className="space-y-3.5 text-xs font-sans">
                  <div className="flex justify-start items-start space-x-2 max-w-[85%]">
                    <div className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-brand-cyan" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-850/60 text-zinc-700 dark:text-zinc-300">
                      გამარჯობა! რა პროექტის დაგეგმვას აპირებთ? გაგვიზიარეთ იდეა, რათა შევქმნათ სტრუქტურა.
                    </div>
                  </div>

                  <div className="flex justify-end items-start space-x-2 max-w-[85%] ml-auto">
                    <div className="p-2.5 rounded-xl bg-brand-primary text-white font-medium">
                      მინდა კომპანიის საიტი ონლაინ კალკულატორით და მობილური ადაპტაციით.
                    </div>
                  </div>

                  <div className="flex justify-start items-start space-x-2 max-w-[85%]">
                    <div className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-brand-cyan" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-850/60 text-zinc-700 dark:text-zinc-300 space-y-1.5">
                      <p className="font-bold text-zinc-900 dark:text-white">შემოთავაზებული სტეკი & სტრუქტურა:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                        <li>ტექნოლოგიები: React, TypeScript, Tailwind CSS, Vercel</li>
                        <li>ფუნქციები: ინტერაქტიული კალკულატორი, ფილტრაცია, SEO ოპტიმიზაცია</li>
                        <li>ეტაპები: UI/UX დიზაინი (Figma) ➜ დეველოპმენტი ➜ გაშვება</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-16 bg-white dark:bg-zinc-950 scroll-mt-16" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan flex items-center justify-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              ხშირად დასმული კითხვები
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              გაეცანით პასუხებს ჩვენს მუშაობასთან დაკავშირებულ ყველაზე გავრცელებულ კითხვებზე.
            </p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-zinc-50/40 dark:bg-zinc-900/20 rounded-xl border border-zinc-150 dark:border-zinc-850/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="font-sans font-bold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm group-hover:text-zinc-950 dark:group-hover:text-white transition-colors pr-4">
                      {faq.question}
                    </span>
                    <span className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 font-mono font-black text-xs shrink-0 select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. CONTACT CTA SECTION (Cleaner and less blocky) */}
      <section className="py-16 px-4 relative overflow-hidden bg-zinc-950 text-white border-t border-zinc-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
            <span>გაქვთ პროექტის იდეა?</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-white">
            დაიწყე პროექტი <span className="text-brand-primary dark:text-brand-cyan font-mono">ჩვენთან ერთად</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed max-w-lg mx-auto">
            გაგვიზიარეთ თქვენი პროექტის აღწერა ან გამოიყენეთ ბიუჯეტის კალკულატორი. ჩვენი გუნდი მყისიერად დაგიკავშირდებათ დეტალების განსახილველად.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all font-sans cursor-pointer shadow-sm inline-flex items-center justify-center space-x-1"
            >
              <span>დაიწყე პროექტი</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/calculator"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs sm:text-sm font-bold rounded-xl transition-all font-sans cursor-pointer inline-flex items-center justify-center"
            >
              ბიუჯეტის კალკულატორი
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
