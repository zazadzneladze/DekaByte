import React, { useState, useEffect } from "react";
import { Calculator, Sparkles, Check, ArrowRight, MessageSquare, Info, Zap } from "lucide-react";
import { siteConfig } from "../data/site";

interface ProductType {
  id: string;
  name: string;
  basePrice: number;
  baseDays: number;
  description: string;
}

interface ScopeOption {
  id: string;
  name: string;
  multiplier: number;
  extraDays: number;
}

interface AddOnOption {
  id: string;
  name: string;
  price: number;
  days: number;
  description: string;
}

export function BudgetCalculator() {
  const productTypes: ProductType[] = [
    {
      id: "landing",
      name: "სავიზიტო / Landing Page",
      basePrice: 900,
      baseDays: 5,
      description: "ერთი გვერდისგან შემდგარი, მაღალი კონვერტაციის მქონე წარდგენა.",
    },
    {
      id: "corporate",
      name: "კორპორატიული ვებსაიტი",
      basePrice: 1800,
      baseDays: 12,
      description: "მრავალგვერდიანი საინფორმაციო ვებსაიტი კომპანიებისთვის.",
    },
    {
      id: "webapp",
      name: "Web Application / სისტემა",
      basePrice: 3200,
      baseDays: 20,
      description: "რთული ბიზნეს ლოგიკის მქონე ვებ-აპლიკაცია მართვის პანელით.",
    },
    {
      id: "android",
      name: "Android აპლიკაცია",
      basePrice: 4000,
      baseDays: 25,
      description: "მობილური აპლიკაცია Android პლატფორმისთვის (Kotlin/Java).",
    },
  ];

  const scopeOptions: ScopeOption[] = [
    { id: "small", name: "მცირე (1-3 გვერდი / ეკრანი)", multiplier: 1.0, extraDays: 0 },
    { id: "medium", name: "საშუალო (4-8 გვერდი / ეკრანი)", multiplier: 1.25, extraDays: 4 },
    { id: "large", name: "დიდი (9-15 გვერდი / ეკრანი)", multiplier: 1.5, extraDays: 8 },
    { id: "enterprise", name: "მასშტაბური (15+ გვერდი / ეკრანი)", multiplier: 1.85, extraDays: 14 },
  ];

  const addOns: AddOnOption[] = [
    {
      id: "design",
      name: "უნიკალური UI/UX დიზაინი (Figma)",
      price: 450,
      days: 4,
      description: "ნულიდან შექმნილი პერსონალური ვიზუალური დიზაინი შაბლონების გარეშე.",
    },
    {
      id: "admin",
      name: "ადმინისტრირების პანელი (CMS)",
      price: 800,
      days: 6,
      description: "კონტენტის დამოუკიდებლად მართვისა და სტატისტიკის სისტემა.",
    },
    {
      id: "multilang",
      name: "მრავალენოვანი მხარდაჭერა",
      price: 300,
      days: 2,
      description: "ვებსაიტის ან აპლიკაციის ადაპტაცია რამდენიმე ენაზე (მაგ. ქართ/ინგ).",
    },
    {
      id: "payment",
      name: "ონლაინ გადახდების ინტეგრაცია",
      price: 500,
      days: 4,
      description: "ქართული ბანკების (TBC, BOG) ან Stripe გადახდის სისტემის ჩაშენება.",
    },
    {
      id: "branding",
      name: "ლოგო და ბრენდინგი",
      price: 350,
      days: 3,
      description: "ბრენდის იდენტობის, ლოგოსა და ფერების პალიტრის შემუშავება.",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<string>("landing");
  const [selectedScope, setSelectedScope] = useState<string>("small");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const [pricing, setPricing] = useState({ minPrice: 0, maxPrice: 0, minDays: 0, maxDays: 0 });

  // Calculate pricing & duration whenever options change
  useEffect(() => {
    const product = productTypes.find((p) => p.id === selectedProduct) || productTypes[0];
    const scope = scopeOptions.find((s) => s.id === selectedScope) || scopeOptions[0];

    // Base price multiplied by scope multiplier
    let calcMinPrice = product.basePrice * scope.multiplier;
    let calcMinDays = product.baseDays + scope.extraDays;

    // Add selected add-ons
    selectedAddOns.forEach((addonId) => {
      const addon = addOns.find((a) => a.id === addonId);
      if (addon) {
        calcMinPrice += addon.price;
        calcMinDays += addon.days;
      }
    });

    // Pricing range calculation: min value and high value (+20% variance for flexibility)
    const minPriceVal = Math.round(calcMinPrice);
    const maxPriceVal = Math.round(calcMinPrice * 1.25);
    const minDaysVal = Math.round(calcMinDays);
    const maxDaysVal = Math.round(calcMinDays * 1.3);

    setPricing({
      minPrice: minPriceVal,
      maxPrice: maxPriceVal,
      minDays: minDaysVal,
      maxDays: maxDaysVal,
    });
  }, [selectedProduct, selectedScope, selectedAddOns]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate pre-filled WhatsApp message URL
  const getWhatsAppLink = () => {
    const product = productTypes.find((p) => p.id === selectedProduct)?.name || "";
    const scope = scopeOptions.find((s) => s.id === selectedScope)?.name || "";
    const chosenAddOns = selectedAddOns
      .map((id) => addOns.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const text = `გამარჯობა, მაინტერესებს პროექტის დაწყება DEKABYTE-ში. ჩემი წინასწარი კალკულაციაა:
• პროდუქტი: ${product}
• მასშტაბი: ${scope}
• დამატებითი მოდულები: ${chosenAddOns || "არ არის არჩეული"}
• სავარაუდო ბიუჯეტი: ${pricing.minPrice} - ${pricing.maxPrice} ₾
• სავარაუდო ვადა: ${pricing.minDays} - ${pricing.maxDays} დღე.`;

    return `${siteConfig.whatsappUrl}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-lg transition-all">
      <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white dark:text-zinc-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-sans">
              პროექტის კალკულატორი
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              გამოთვალეთ სავარაუდო ღირებულება და ვადები 1 წუთში
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-cyan text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>ინტერაქტიული</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Selectors */}
        <div className="p-6 sm:p-8 lg:col-span-8 space-y-6 sm:space-y-8 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800">
          
          {/* Step 1: Product Type */}
          <div className="space-y-3.5">
            <label className="text-sm font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>აირჩიეთ პროდუქტის ტიპი</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productTypes.map((type) => {
                const isSelected = selectedProduct === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedProduct(type.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? "border-brand-primary dark:border-brand-cyan bg-brand-primary/[0.02] dark:bg-brand-cyan/[0.02] ring-1 ring-brand-primary dark:ring-brand-cyan"
                        : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`font-bold text-sm font-sans ${
                        isSelected ? "text-brand-primary dark:text-brand-cyan" : "text-zinc-950 dark:text-white"
                      }`}>
                        {type.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-sans leading-relaxed">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Project Scope */}
          <div className="space-y-3.5">
            <label className="text-sm font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>პროექტის მასშტაბი (გვერდები/ეკრანები)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scopeOptions.map((scope) => {
                const isSelected = selectedScope === scope.id;
                return (
                  <button
                    key={scope.id}
                    onClick={() => setSelectedScope(scope.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative cursor-pointer ${
                      isSelected
                        ? "border-brand-primary dark:border-brand-cyan bg-brand-primary/[0.02] dark:bg-brand-cyan/[0.02] ring-1 ring-brand-primary dark:ring-brand-cyan"
                        : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-xs sm:text-sm font-sans ${
                        isSelected ? "text-brand-primary dark:text-brand-cyan font-bold" : "text-zinc-900 dark:text-zinc-100"
                      }`}>
                        {scope.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Add Ons */}
          <div className="space-y-3.5">
            <label className="text-sm font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-brand-primary dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>დამატებითი ფუნქციონალი</span>
            </label>
            <div className="space-y-2.5">
              {addOns.map((addon) => {
                const isSelected = selectedAddOns.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? "border-brand-primary dark:border-brand-cyan bg-brand-primary/[0.02] dark:bg-brand-cyan/[0.02] ring-1 ring-brand-primary dark:ring-brand-cyan"
                        : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent"
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 pr-4">
                      <div className={`w-5 h-5 rounded-md border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-brand-primary dark:bg-white border-brand-primary dark:border-white text-white dark:text-zinc-950" 
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-zinc-950 dark:text-white font-sans block">
                          {addon.name}
                        </span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans leading-relaxed">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans block">
                        + {addon.price} ₾
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                        + {addon.days} დღე
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Price Output */}
        <div className="p-6 sm:p-8 lg:col-span-4 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col justify-between">
          
          <div className="space-y-6">
            <h4 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
              წინასწარი გათვლა
            </h4>

            {/* Calculated Price */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm space-y-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold font-sans">
                სავარაუდო ბიუჯეტი
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary dark:text-white font-sans">
                  {pricing.minPrice} - {pricing.maxPrice}
                </span>
                <span className="text-lg font-bold text-zinc-500 dark:text-zinc-400">
                  ₾
                </span>
              </div>
            </div>

            {/* Calculated Timeline */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm space-y-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold font-sans">
                სავარაუდო ვადა
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary dark:text-white font-sans">
                  {pricing.minDays} - {pricing.maxDays}
                </span>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  დღე
                </span>
              </div>
            </div>

            {/* Trust Disclaimers */}
            <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-xs text-zinc-650 dark:text-zinc-400 font-sans">
              <p className="font-bold text-zinc-900 dark:text-white">DekaByte-ის გარანტია:</p>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                <li>ყველა პროექტზე ფორმდება ოფიციალური ხელშეკრულება.</li>
                <li>ფასში შედის პირველადი მხარდაჭერა და ჰოსტინგის გამართვა.</li>
                <li>გადახდა ხორციელდება ეტაპობრივად (ეტაპების მიხედვით).</li>
              </ul>
            </div>

            {/* Informational Warning */}
            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-blue-500/5 text-blue-600 dark:text-brand-cyan text-xs leading-relaxed font-sans border border-blue-500/10">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-primary dark:text-brand-cyan" />
              <p>
                ფასი ინდივიდუალურია და დამოკიდებულია დიზაინის სირთულეზე, API ინტეგრაციებსა და ფუნქციონალის ზუსტ ბრიფზე.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex w-full items-center justify-center space-x-2.5 bg-brand-primary hover:bg-blue-600 text-white py-3.5 px-6 rounded-2xl text-sm font-bold shadow-md shadow-brand-primary/10 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>გააგზავნე WhatsApp-ში</span>
            </a>

            {/* Dynamic direct notification link */}
            <button
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/contact";
                }
              }}
              className="flex w-full items-center justify-center space-x-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all cursor-pointer"
            >
              <span>საკონტაქტო ფორმით მოთხოვნა</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
