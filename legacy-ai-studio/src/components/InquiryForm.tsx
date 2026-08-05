import React, { useState, useEffect } from "react";
import { Send, MessageSquare, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { siteConfig } from "../data/site";

interface InquiryFormProps {
  prefilledDescription?: string;
}

export function InquiryForm({ prefilledDescription = "" }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [projectType, setProjectType] = useState("ვებსაიტი");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (prefilledDescription) {
      setDescription(prefilledDescription);
    }
  }, [prefilledDescription]);
  
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [errors, setErrors] = useState<{ name?: string; contact?: string; description?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const projectTypeOptions = [
    { value: "ვებსაიტი", label: "ვებსაიტი" },
    { value: "Web Application", label: "Web Application" },
    { value: "Android აპლიკაცია", label: "Android აპლიკაცია" },
    { value: "UI/UX დიზაინი", label: "UI/UX დიზაინი" },
    { value: "არსებული პროექტის განახლება", label: "არსებული პროექტის განახლება" },
    { value: "სხვა", label: "სხვა" },
  ];

  // Helper to compile the message text
  const compileMessage = () => {
    return `მოგესალმებით, მე ვარ ${name || "[სახელი]"}.
მსურს დაგიკვეთოთ პროექტი.

• პროექტის ტიპი: ${projectType}
• საკონტაქტო: ${contact || "[ტელეფონი ან ელფოსტა]"}

მოკლე აღწერა:
${description || "[პროექტის აღწერა...]"}`;
  };

  const validate = () => {
    const tempErrors: { name?: string; contact?: string; description?: string } = {};
    if (!name.trim()) tempErrors.name = "გთხოვთ მიუთითოთ სახელი";
    if (!contact.trim()) tempErrors.contact = "მიუთითეთ ტელეფონი ან ელფოსტა";
    if (!description.trim()) tempErrors.description = "დაწერეთ პროექტის მოკლე აღწერა";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fullMessage = compileMessage();

    if (sendMethod === "whatsapp") {
      // Open WhatsApp with prefilled text
      const encodedMsg = encodeURIComponent(fullMessage);
      const whatsappLink = `https://wa.me/${siteConfig.phone.replace("+", "")}?text=${encodedMsg}`;
      window.open(whatsappLink, "_blank");
    } else {
      // Open Email mailto
      const subject = encodeURIComponent(`პროექტის შეფასება - ${projectType}`);
      const body = encodeURIComponent(fullMessage);
      const mailtoLink = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
    }

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 8000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-md">
      <h3 className="text-xl sm:text-2xl font-sans font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
        შეავსე მოთხოვნა
      </h3>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        ჩვენ არ ვიყენებთ ფარულ ფორმებს. მონაცემები გადაეცემა პირდაპირ ჩვენს საკონტაქტო არხზე WhatsApp-ით ან ელფოსტით.
      </p>

      {isSuccess && (
        <div className="mb-6 p-4 bg-brand-primary/5 dark:bg-zinc-950 border border-brand-primary/20 rounded-2xl flex items-start space-x-3 text-zinc-900 dark:text-brand-cyan">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-brand-cyan" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">მესიჯი მზად არის!</p>
            <p className="mt-1 opacity-90">
              თქვენი ბრაუზერი გახსნის {sendMethod === "whatsapp" ? "WhatsApp" : "ფოსტის აპლიკაციას"} წინასწარ შევსებული ტექსტით. გააგზავნეთ მესიჯი კომუნიკაციის დასაწყებად!
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            თქვენი სახელი *
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="მაგ: გიორგი"
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? "border-red-400 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-950 bg-red-50/20"
                : "border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-white focus:ring-zinc-100 dark:focus:ring-zinc-800 bg-transparent text-zinc-900 dark:text-white"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
        </div>

        {/* Contact info input */}
        <div>
          <label htmlFor="contact-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            ტელეფონი ან ელფოსტა *
          </label>
          <input
            id="contact-input"
            type="text"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              if (errors.contact) setErrors({ ...errors, contact: undefined });
            }}
            placeholder="მაგ: 599 12 34 56 ან mail@example.com"
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all ${
              errors.contact
                ? "border-red-400 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-950 bg-red-50/20"
                : "border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-white focus:ring-zinc-100 dark:focus:ring-zinc-800 bg-transparent text-zinc-900 dark:text-white"
            }`}
          />
          {errors.contact && <p className="text-red-500 text-xs mt-1.5">{errors.contact}</p>}
        </div>

        {/* Project type select */}
        <div>
          <label htmlFor="type-select" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            პროექტის ტიპი
          </label>
          <select
            id="type-select"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition-all"
          >
            {projectTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brief description */}
        <div>
          <label htmlFor="desc-input" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            პროექტის მოკლე აღწერა *
          </label>
          <textarea
            id="desc-input"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            placeholder="მოკლედ მოგვიყევით თქვენი იდეის, მიზნებისა და მოთხოვნების შესახებ..."
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.description
                ? "border-red-400 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-950 bg-red-50/20"
                : "border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-white focus:ring-zinc-100 dark:focus:ring-zinc-800 bg-transparent text-zinc-900 dark:text-white"
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
        </div>

        {/* Delivery Method Selection */}
        <div className="pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 font-mono">
            გაგზავნის მეთოდი:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSendMethod("whatsapp")}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                sendMethod === "whatsapp"
                  ? "border-brand-cyan text-brand-cyan bg-brand-cyan/10"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp-ში</span>
            </button>
            <button
              type="button"
              onClick={() => setSendMethod("email")}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                sendMethod === "email"
                  ? "border-brand-primary text-brand-primary dark:text-brand-cyan bg-brand-primary/10"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>ელფოსტაზე</span>
            </button>
          </div>
        </div>

        {/* Real-time Message Compile Preview */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 mt-4">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 font-mono">
            მესიჯის წინასწარი ნახვა (იგზავნება ავტომატურად):
          </span>
          <pre className="text-[11px] text-zinc-600 dark:text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
            {compileMessage()}
          </pre>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer mt-6"
        >
          <Send className="w-4 h-4" />
          <span>გააგზავნე მოთხოვნა</span>
        </button>

        {/* Transparent Disclaimer */}
        <div className="flex items-start space-x-2.5 text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal mt-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            ღილაკზე დაჭერით თქვენი ბრაუზერი გაუშვებს {sendMethod === "whatsapp" ? "WhatsApp API-ს" : "Default ფოსტის აპლიკაციას"} და გადასცემს ჩამოყალიბებულ პროექტის ბრიფს. ეს უზრუნველყოფს გარანტირებულ კავშირს.
          </p>
        </div>
      </form>
    </div>
  );
}
