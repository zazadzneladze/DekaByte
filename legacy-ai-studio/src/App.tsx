import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FloatingContactBar } from "./components/FloatingContactBar";
import { Home } from "./pages/Home";
import { ServicesPage } from "./pages/ServicesPage";
import { AiAdvisorPage } from "./pages/AiAdvisorPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { ContactPage } from "./pages/ContactPage";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Privacy } from "./pages/Privacy";
import { NotFound } from "./pages/NotFound";

export default function App() {
  const [sharedBrief, setSharedBrief] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-between">
        {/* Sticky Header Navigation */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route 
              path="/ai-advisor" 
              element={<AiAdvisorPage onApplyBrief={(brief) => setSharedBrief(brief)} />} 
            />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route 
              path="/contact" 
              element={<ContactPage sharedBrief={sharedBrief} />} 
            />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile-only Floating Contact Bar */}
        <FloatingContactBar />
      </div>
    </Router>
  );
}
