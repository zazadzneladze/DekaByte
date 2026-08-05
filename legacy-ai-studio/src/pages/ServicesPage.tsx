import React from "react";
import { Layers, Settings, TrendingUp, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { servicesData } from "../data/services";
import { FaqSection } from "../components/FaqSection";

export function ServicesPage() {
  const advantages = [
    {
      title: "ინდივიდუალური მიდგომა",
      description: "ყოველი პროექტი იქმნება ნულიდან, თქვენი ბიზნესის სპეციფიკური საჭიროებებისა და სამიზნე აუდიტორიის ზუსტი ანალიზით.",
      iconColor: "text-brand-primary dark:text-brand-cyan",
      bgColor: "bg-brand-primary/5 dark:bg-brand-primary/10",
    },
    {
      title: "თანამედროვე და გამართული დიზაინი",
      description: "ჩვენი ინტერფეისები არის სუფთა, მინიმალისტური და სრულად ადაპტირებული თანამედროვე გლობალურ ციფრულ ტრენდებთან.",
      iconColor: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/5 dark:bg-blue-500/10",
    },
    {
      title: "მობილურ მოწყობილობებზე ადაპტაცია",
      description: "ვებ-პროდუქტები იგეგმება Mobile-First პრინციპით, რაც გარანტიას გაძლევთ, რომ საიტი იდეალურად იმუშავებს ნებისმიერ ტელეფონზე.",
      iconColor: "text-cyan-500 dark:text-cyan-400",
      bgColor: "bg-cyan-500/5 dark:bg-cyan-500/10",
    },
    {
      title: "მარტივად სამართავი სისტემები",
      description: "ჩვენ ვამარტივებთ კონტენტის მართვას. საიტის რედაქტირებისთვის თქვენ არ დაგჭირდებათ პროგრამირების ცოდნა ან რთული კოდი.",
      iconColor: "text-brand-cyan dark:text-brand-cyan",
      bgColor: "bg-brand-cyan/5 dark:bg-brand-cyan/10",
    },
    {
      title: "პროექტის ყველა ეტაპის ერთ სივრცეში მართვა",
      description: "იდეის განხილვა, სტრუქტურის დაგეგმვა, დიზაინის შექმნა, დეველოპმენტი, ტესტირება და გაშვება — ყველაფერს ჩვენი სტუდია ფარავს.",
      iconColor: "text-brand-primary dark:text-brand-cyan",
      bgColor: "bg-brand-primary/5 dark:bg-brand-primary/10",
    },
    {
      title: "გაშვების შემდგომი მხარდაჭერა",
      description: "ჩვენ არ გტოვებთ საიტის გაშვებისთანავე. უზრუნველყოფთ გარანტირებულ ტექნიკურ მხარდაჭერასა და კონსულტაციებს.",
      iconColor: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10",
    }
  ];

  const steps = [
    {
      num: "01",
      title: "იდეის განხილვა",
      desc: "ვარკვევთ პროექტის მიზანს, საჭიროებებსა და მთავარ ამოცანებს.",
      glow: "shadow-brand-primary/5 border-zinc-200 dark:border-zinc-800/80 hover:border-brand-primary/30 hover:shadow-brand-primary/5",
    },
    {
      num: "02",
      title: "სტრუქტურა და დიზაინი",
      desc: "ვგეგმავთ მომხმარებლის გზას, გვერდების სტრუქტურასა და ვიზუალურ მიმართულებას.",
      glow: "shadow-blue-500/5 border-zinc-200 dark:border-zinc-800/80 hover:border-blue-500/30 hover:shadow-blue-500/5",
    },
    {
      num: "03",
      title: "დეველოპმენტი",
      desc: "ვაწყობთ სწრაფ, გამართულ და სხვადასხვა მოწყობილობაზე მორგებულ პროდუქტს.",
      glow: "shadow-brand-cyan/5 border-zinc-200 dark:border-zinc-800/80 hover:border-brand-cyan/30 hover:shadow-brand-cyan/5",
    },
    {
      num: "04",
      title: "ტესტირება და გაშვება",
      desc: "ვამოწმებთ ფუნქციებს, ვასწორებთ დეტალებს და ვუშვებთ დასრულებულ პროექტს.",
      glow: "shadow-indigo-500/5 border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/30 hover:shadow-indigo-500/5",
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-24 pb-16">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-950">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 dark:bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-cyan/5 dark:bg-brand-cyan/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 border border-brand-primary/20 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-brand-primary dark:text-brand-cyan mb-6">
            <Layers className="w-3.5 h-3.5" />
            <span>მომსახურებები და პროცესი</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            რას ვთავაზობთ <span className="text-brand-primary dark:text-brand-cyan font-mono">თქვენს ბიზნესს?</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
            ჩვენ ვქმნით პრემიუმ კლასის ვებ და მობილურ პროდუქტებს, რომლებიც ორიენტირებულია უნაკლო ინტერფეისზე, მაღალ სისწრაფესა და რეალურ კონვერსიაზე.
          </p>
        </div>
      </section>

      {/* Services Listing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {servicesData.map((service, index) => {
              const colors = [
                "border-zinc-200/80 dark:border-zinc-800/80 hover:border-brand-primary/30 shadow-brand-primary/5 dark:shadow-brand-primary/10",
                "border-zinc-200/80 dark:border-zinc-800/80 hover:border-brand-cyan/30 shadow-brand-cyan/5 dark:shadow-brand-cyan/10",
                "border-zinc-200/80 dark:border-zinc-800/80 hover:border-blue-500/30 shadow-blue-500/5 dark:shadow-blue-500/10",
                "border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/30 shadow-indigo-500/5 dark:shadow-indigo-500/10",
              ];
              const cardColorClass = colors[index % colors.length];

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={service.id}
                  className={`bg-zinc-50/50 dark:bg-zinc-900/10 border ${cardColorClass} p-6 sm:p-8 rounded-3xl shadow-md transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-900 text-white group-hover:text-brand-cyan flex items-center justify-center font-mono font-black text-base shadow-sm transition-colors">
                        {`0${index + 1}`}
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full font-bold border border-zinc-200/40 dark:border-zinc-800">
                        DEKABYTE სტუდიო
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-zinc-900 dark:text-white leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 font-sans">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-8 border-t border-zinc-200/60 dark:border-zinc-900">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-3 font-mono">
                      მიმართულებები & ტექნოლოგიები:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.examples.map((ex) => (
                        <span 
                          key={ex} 
                          className="text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850 hover:border-brand-primary/30 hover:text-brand-primary dark:hover:text-brand-cyan text-zinc-700 dark:text-zinc-300 font-sans font-medium transition-colors cursor-default"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/10 border-t border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-brand-primary dark:text-brand-cyan mb-3">
              <Settings className="w-3.5 h-3.5" />
              <span>ჩვენი მეთოდოლოგია</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              სამუშაო პროცესი
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              ორგანიზებული და გამჭვირვალე პროცესი უზრუნველყოფს იდეების რეალურ და სრულყოფილ პროდუქტად ქცევას.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                key={idx} 
                className={`relative bg-white dark:bg-zinc-950 border ${step.glow} p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-extrabold font-mono text-zinc-300 dark:text-zinc-800 tracking-tight group-hover:text-brand-primary dark:group-hover:text-brand-cyan transition-colors">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 dark:bg-brand-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary dark:text-brand-cyan" />
                  </div>
                </div>

                <h3 className="text-lg font-sans font-bold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center space-x-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-brand-primary dark:text-brand-cyan mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>უპირატესობები</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-zinc-950 dark:text-white tracking-tight">
              რატომ DEKABYTE?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              ხარისხი, პუნქტუალურობა და თანამედროვე ტექნოლოგიური სტანდარტები ჩვენი მუშაობის მთავარი პრინციპია.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={idx}
                className="p-6 rounded-3xl bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-900 hover:border-brand-primary/20 dark:hover:border-brand-cyan/20 shadow-sm flex flex-col justify-between space-y-4 transition-all hover:bg-white dark:hover:bg-zinc-950 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center ${item.iconColor}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-sans font-bold text-zinc-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* Promo Banner CTA */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto bg-zinc-950 border border-zinc-850 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-primary/10 rounded-full blur-[60px]" />
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-white">
              გაქვთ პროექტის იდეა?
            </h3>
            <p className="text-sm text-zinc-400 font-sans">
              გამოიყენეთ ჩვენი ინტერაქტიული ბიუჯეტის კალკულატორი ფასების დასათვლელად ან გაესაუბრეთ ციფრულ AI არქიტექტორს დეტალური ბრიფის მისაღებად.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/calculator"
                className="w-full sm:w-auto px-6 py-3 bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all font-sans cursor-pointer shadow-md inline-flex items-center justify-center"
              >
                ბიუჯეტის კალკულატორი
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/ai-advisor"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs sm:text-sm font-bold rounded-xl transition-all font-sans cursor-pointer inline-flex items-center justify-center"
              >
                AI პროექტის არქიტექტორი
                <Sparkles className="w-4 h-4 ml-1.5 text-brand-cyan animate-pulse" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
