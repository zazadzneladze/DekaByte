import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle, 
  Settings, 
  HelpCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  User,
  Zap,
  Globe,
  Compass
} from "lucide-react";
import { projectsData } from "../data/projects";
import { ProjectMockup } from "../components/ProjectMockup";

// Premium case-study structured specs mapping
const projectSpecsMapping: Record<string, {
  client: string;
  services: string;
  deliverables: string;
  timeline: string;
}> = {
  "pop-up": {
    client: "სწრაფი კვების ქსელი Pop-Up",
    services: "Full-Stack Web Development, UI/UX Design, DB Systems",
    deliverables: "Customer QR App, Kitchen Dashboard, CMS Admin Panel",
    timeline: "4 კვირა"
  },
  "batumi-design-lab": {
    client: "Batumi Design Lab Studio",
    services: "Premium UI/UX Design, Front-End Development, Custom Estimator Engine",
    deliverables: "Brand Case-Study Website, Cost Estimator Widget, Lead Capture Forms",
    timeline: "3 კვირა"
  },
  "gbp": {
    client: "საბავშვო ბაღი GBP",
    services: "Responsive Web Development, Custom Graphics & Interactive Calendars",
    deliverables: "Information Hub Website, Admission Form, Parental Guidance Portal",
    timeline: "2.5 კვირა"
  },
  "cost-estimator": {
    client: "სამშენებლო-დეველოპერული კომპანია",
    services: "Front-End Web App Development, Financial Algorithms, PDF Exports",
    deliverables: "Cost Estimator Web Application, Calculation Dashboard, PDF Document Generator",
    timeline: "3 კვირა"
  },
  "render-prompt": {
    client: "სტუდიის შიდა პროდუქტი / Open Source",
    services: "AI Prompt Engineering, Fast Client-side Static App",
    deliverables: "Interactive Prompt Builder, Midjourney Preset Builder",
    timeline: "1.5 კვირა"
  }
};

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find current project
  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const project = projectsData[projectIndex];

  // Scroll to top on project load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  // If project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 rounded-2xl max-w-md shadow-md space-y-6">
          <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-sans font-extrabold text-zinc-900 dark:text-white">
              პროექტი ვერ მოიძებნა
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
              სამწუხაროდ, მოთხოვნილი გვერდი ან პროექტის ქეისი არ არსებობს ან გადატანილია სხვა მისამართზე.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 rounded-xl text-xs font-bold justify-center transition-all shadow-sm"
          >
            მთავარზე დაბრუნება
          </Link>
        </div>
      </div>
    );
  }

  // Calculate previous and next projects for navigation
  const prevProject = 
    projectIndex > 0 
      ? projectsData[projectIndex - 1] 
      : projectsData[projectsData.length - 1];

  const nextProject = 
    projectIndex < projectsData.length - 1 
      ? projectsData[projectIndex + 1] 
      : projectsData[0];

  const specs = projectSpecsMapping[project.slug] || {
    client: "კონფიდენციალური კლიენტი",
    services: "UI/UX, ვებ დეველოპმენტი, ოპტიმიზაცია",
    deliverables: "სრული ვებ-პროდუქტი",
    timeline: "3 კვირა"
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Back Link Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white text-xs font-bold mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>ყველა ნამუშევარი</span>
        </Link>

        {/* Project Header Meta */}
        <div className="space-y-3 mb-8 sm:mb-10 text-left">
          <span className="text-[10px] font-bold tracking-wider uppercase text-brand-primary dark:text-brand-cyan font-mono">
            {project.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-zinc-950 dark:text-white leading-none">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-650 dark:text-zinc-400 max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Project Viewport Showcase */}
        <div className="p-3 bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-150/50 dark:border-zinc-850/40 rounded-2xl mb-10 shadow-sm">
          <ProjectMockup
            type={project.design.mockupType}
            accentColor={project.design.accentColor}
            theme={project.design.theme}
            title={project.title}
          />
        </div>

        {/* Two Column Project Case Study Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* Left Column: Objective and Features */}
          <div className="lg:col-span-8 space-y-8">
            {/* Objective */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-sans font-bold text-zinc-950 dark:text-white flex items-center">
                <span className="w-1 h-5 bg-brand-primary dark:bg-brand-cyan rounded-full mr-2.5 inline-block"></span>
                პროექტის მიზანი
              </h3>
              <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans">
                {project.objective}
              </p>
            </div>

            {/* What Was Created */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-sans font-bold text-zinc-950 dark:text-white flex items-center">
                <span className="w-1 h-5 bg-brand-primary dark:bg-brand-cyan rounded-full mr-2.5 inline-block"></span>
                რა შეიქმნა
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.whatWasCreated.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850/80 bg-zinc-50/30 dark:bg-zinc-900/10 flex items-start space-x-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-sans font-bold text-zinc-950 dark:text-white flex items-center">
                <span className="w-1 h-5 bg-brand-primary dark:bg-brand-cyan rounded-full mr-2.5 inline-block"></span>
                ძირითადი ფუნქციები და შესაძლებლობები
              </h3>
              <ul className="space-y-2">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 font-sans leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary dark:bg-brand-cyan shrink-0 mt-2 mr-2.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: CASE STUDY METADATA (Client, Services, Deliverables, Timeline) */}
          <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900/15 border border-zinc-200/80 dark:border-zinc-850/60 p-5 rounded-2xl space-y-5">
            
            <h4 className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono pb-2.5 border-b border-zinc-150 dark:border-zinc-850">
              პროექტის სპეციფიკაციები
            </h4>

            {/* Client Spec */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-400" /> კლიენტი
              </span>
              <p className="text-xs sm:text-sm font-sans font-bold text-zinc-800 dark:text-zinc-200">
                {specs.client}
              </p>
            </div>

            {/* Services Spec */}
            <div className="space-y-1 pt-1.5 border-t border-zinc-150/60 dark:border-zinc-850/50">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-zinc-400" /> მომსახურებები
              </span>
              <p className="text-xs sm:text-sm font-sans font-medium text-zinc-700 dark:text-zinc-300">
                {specs.services}
              </p>
            </div>

            {/* Deliverables Spec */}
            <div className="space-y-1 pt-1.5 border-t border-zinc-150/60 dark:border-zinc-850/50">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-zinc-400" /> შედეგები
              </span>
              <p className="text-xs sm:text-sm font-sans font-medium text-zinc-700 dark:text-zinc-300">
                {specs.deliverables}
              </p>
            </div>

            {/* Timeline Spec */}
            <div className="space-y-1 pt-1.5 border-t border-zinc-150/60 dark:border-zinc-850/50">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> ხანგრძლივობა
              </span>
              <p className="text-xs sm:text-sm font-sans font-bold text-zinc-800 dark:text-zinc-200">
                {specs.timeline}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-150 dark:border-zinc-850">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                ტექნოლოგიური სტეკი
              </span>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech} 
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 font-mono text-zinc-600 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.liveUrl && (
              <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-brand-primary hover:bg-blue-600 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-sm cursor-pointer"
                >
                  <span>დემო ვერსიის ნახვა</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>

        </div>

        {/* Dynamic Prev / Next Project Carousel Navigation */}
        <div className="border-t border-b border-zinc-150 dark:border-zinc-850/80 py-6 mb-12">
          <div className="flex items-center justify-between gap-4">
            {/* Prev Project Card Link */}
            <Link 
              to={`/work/${prevProject.slug}`}
              className="group flex flex-col items-start text-left max-w-[45%] text-xs hover:opacity-85"
            >
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5 flex items-center">
                <ChevronLeft className="w-4 h-4 mr-0.5 shrink-0" /> წინა პროექტი
              </span>
              <span className="font-sans font-bold text-zinc-800 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-cyan transition-colors line-clamp-1">
                {prevProject.title}
              </span>
            </Link>

            {/* Next Project Card Link */}
            <Link 
              to={`/work/${nextProject.slug}`}
              className="group flex flex-col items-end text-right max-w-[45%] text-xs hover:opacity-85"
            >
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5 flex items-center">
                შემდეგი პროექტი <ChevronRight className="w-4 h-4 ml-0.5 shrink-0" />
              </span>
              <span className="font-sans font-bold text-zinc-800 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-cyan transition-colors line-clamp-1">
                {nextProject.title}
              </span>
            </Link>
          </div>
        </div>

        {/* CTA Banner Section */}
        <div className="bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl p-6 border border-zinc-150 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-sans font-bold text-zinc-950 dark:text-white">
              მსგავსი პროექტი გჭირდებათ?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans max-w-md">
              გაგვიზიარეთ იდეა, მიიღეთ ინდივიდუალური კონსულტაცია და წინასწარი შეფასება ჩვენი გუნდისგან.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 py-2.5 px-5 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all cursor-pointer"
          >
            დაიწყე პროექტი
          </Link>
        </div>

      </div>
    </div>
  );
}
