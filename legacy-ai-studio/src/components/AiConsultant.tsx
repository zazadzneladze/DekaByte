import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RefreshCw, Copy, Check, MessageSquare, ArrowRight, ArrowDown, HelpCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { siteConfig } from "../data/site";

interface Message {
  role: "user" | "model";
  content: string;
}

interface AiConsultantProps {
  onApplyBrief: (briefText: string) => void;
}

export function AiConsultant({ onApplyBrief }: AiConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `გამარჯობა! მე ვარ **DekaByte**-ის პროექტების არქიტექტორი ასისტენტი.

მე შემიძლია დაგეხმაროთ თქვენი ციფრული იდეების სრულყოფილ ტექნიკურ ბრიფად ჩამოყალიბებაში.

გაგვიზიარეთ თქვენი პროექტის იდეა (მაგალითად: *„მინდა უძრავი ქონების პორტალი რუკით“* ან *„საკვების მიტანის აპლიკაცია Android-ზე“*) და მე მყისიერად შემოგთავაზებთ ოპტიმალურ არქიტექტურას, აუცილებელ ფუნქციონალსა და შესრულების ეტაპებს.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAppliedAlert, setShowAppliedAlert] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickTemplates = [
    {
      label: "E-Commerce პლატფორმა",
      prompt: "მინდა თანამედროვე ონლაინ მაღაზია ქართულ ბაზარზე, სადაც მომხმარებლებს ექნებათ პირადი კაბინეტი, ბარათით გადახდა და კურიერების თრექინგი.",
    },
    {
      label: "უძრავი ქონების პორტალი",
      prompt: "მინდა უძრავი ქონების პორტალი ინტეგრირებული რუკით, ფილტრებით და აგენტების მართვის პანელით.",
    },
    {
      label: "სტარტაპ MVP (Fast track)",
      prompt: "მინდა შევქმნა სერვისების დასაჯავშნი პლატფორმის მინიმალური ვერსია (MVP) მოკლე დროში, რათა დავტესტო იდეა.",
    },
    {
      label: "Android Delivery აპლიკაცია",
      prompt: "გვინდა შევქმნათ Android აპლიკაცია პროდუქტების მიტანის სერვისისთვის, რომელიც იმუშავებს რეალურ დროში.",
    },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "❌ ბოდიშს გიხდით, სერვერთან კავშირი შეფერხდა. გთხოვთ სცადოთ მოგვიანებით ან პირდაპირ დაგვიკავშირდეთ საკონტაქტო ფორმით.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApplyToForm = (text: string) => {
    onApplyBrief(text);
    setShowAppliedAlert(true);
    setTimeout(() => setShowAppliedAlert(false), 4000);

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we are on AI advisor page, redirect to contact page with the brief
      window.location.href = "/contact";
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "model",
        content: `გამარჯობა! მე ვარ **DekaByte**-ის პროექტების არქიტექტორი ასისტენტი.

მე შემიძლია დაგეხმაროთ თქვენი ციფრული იდეების სრულყოფილ ტექნიკურ ბრიფად ჩამოყალიბებაში.

გაგვიზიარეთ თქვენი პროექტის იდეა (მაგალითად: *„მინდა უძრავი ქონების პორტალი რუკით“* ან *„საკვების მიტანის აპლიკაცია Android-ზე“*) და მე მყისიერად შემოგთავაზებთ ოპტიმალურ არქიტექტურას, აუცილებელ ფუნქციონალსა და შესრულების ეტაპებს.`,
      },
    ]);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[580px] relative">
      
      {/* Polished Chat Header */}
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-150 dark:border-zinc-850/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-cyan animate-pulse" />
          <span className="text-xs font-bold font-sans text-zinc-800 dark:text-zinc-200">
            ინტერაქტიული AI ასისტენტი
          </span>
        </div>

        <button
          onClick={resetChat}
          type="button"
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-all p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center space-x-1 text-[11px] font-sans font-bold cursor-pointer"
          title="ჩატის განულება"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>გასუფთავება</span>
        </button>
      </div>

      {/* Explanatory Capability Disclaimer */}
      <div className="px-4 py-2 bg-blue-500/5 dark:bg-blue-500/10 border-b border-zinc-150 dark:border-zinc-850/60 flex items-center space-x-2 text-[10px] text-brand-primary dark:text-brand-cyan shrink-0">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span className="font-sans font-medium">
          ეს არის ციფრული კონცეფციის დამხმარე, რომელიც დაგეხმარებათ იდეის ტექნიკური სტრუქტურის ჩამოყალიბებაში.
        </span>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {showAppliedAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-4 right-4 z-50 p-3 bg-zinc-900/95 border border-brand-cyan text-brand-cyan text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>ბრიფი გადატანილია საკონტაქტო გვერდზე!</span>
            </div>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-brand-cyan shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg, idx) => {
          const isModel = msg.role === "model";
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isModel ? "justify-start" : "justify-end"} items-start space-x-2.5`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary dark:text-brand-cyan" />
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[80%] space-y-1.5">
                <div
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm leading-relaxed font-sans ${
                    isModel
                      ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850/80 text-zinc-800 dark:text-zinc-200"
                      : "bg-brand-primary dark:bg-brand-cyan text-white font-medium"
                  }`}
                >
                  <div className="markdown-body prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed prose-p:my-1 prose-ul:my-1.5 prose-li:my-0.5">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Message Utility Actions */}
                {isModel && idx > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 justify-start">
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>კოპირებულია</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>კოპირება</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleApplyToForm(msg.content)}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-brand-primary/5 hover:bg-brand-primary/10 dark:bg-brand-cyan/5 dark:hover:bg-brand-cyan/10 border border-brand-primary/10 dark:border-brand-cyan/15 text-[10px] text-brand-primary dark:text-brand-cyan transition-all cursor-pointer"
                    >
                      <span>გამოიყენე ფორმაში</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary dark:text-brand-cyan animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850/80 text-zinc-500 text-xs sm:text-sm flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
              <span className="font-mono text-[10px] pl-1 text-zinc-400">DekaByte AI აანალიზებს ბრიფს...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Templates */}
      {messages.length === 1 && (
        <div className="px-4 py-3 border-t border-zinc-150 dark:border-zinc-850/80 bg-zinc-50/50 dark:bg-zinc-900/20 shrink-0">
          <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
            აირჩიეთ სწრაფი შაბლონი დასაწყებად:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {quickTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => handleSend(template.prompt)}
                className="p-2 text-left rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold font-sans transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>{template.label}</span>
                <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-brand-primary dark:group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <div className="p-3.5 border-t border-zinc-150 dark:border-zinc-850/80 bg-zinc-50/30 dark:bg-zinc-950/40 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={
              isLoading
                ? "გთხოვთ დაელოდოთ პასუხს..."
                : "დაწერეთ იდეა (მაგ: მინდა კლინიკის საიტი)..."
            }
            className="flex-1 px-4.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-primary dark:focus:border-brand-cyan transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
