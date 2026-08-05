import React from "react";
import { Link } from "react-router-dom";
import { Code2, Phone, Mail, MapPin, Facebook, Linkedin, Github } from "lucide-react";
import { siteConfig } from "../data/site";
import { servicesData } from "../data/services";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" onClick={handleScrollToTop} className="flex items-center">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              ვებსაიტები, Android აპლიკაციები და ბიზნესზე მორგებული ციფრული პროდუქტები.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href={siteConfig.facebookUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={siteConfig.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={siteConfig.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wider">ნავიგაცია</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleSectionScroll("work")} 
                  className="hover:text-white transition-colors text-left"
                >
                  ნამუშევრები
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll("services")} 
                  className="hover:text-white transition-colors text-left"
                >
                  მომსახურებები
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll("process")} 
                  className="hover:text-white transition-colors text-left"
                >
                  სამუშაო პროცესი
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSectionScroll("contact")} 
                  className="hover:text-white transition-colors text-left"
                >
                  კონტაქტი
                </button>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wider">მომსახურებები</h4>
            <ul className="space-y-2 text-sm">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <button 
                    onClick={() => handleSectionScroll("services")} 
                    className="hover:text-white transition-colors text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wider">კონტაქტი</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.phoneFormatted}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} {siteConfig.companyName}. ყველა უფლება დაცულია.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors" onClick={handleScrollToTop}>
              კონფიდენციალურობის პოლიტიკა
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
