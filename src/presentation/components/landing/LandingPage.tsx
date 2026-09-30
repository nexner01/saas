"use client";

import React from "react";
import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { WorkspaceMockup } from "./WorkspaceMockup";
import { FeatureBentoGrid } from "./FeatureBentoGrid";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaBanner } from "./CtaBanner";
import { LandingFooter } from "./LandingFooter";

export const LandingPage: React.FC = () => {
  const handleDemoClick = () => {
    const demoElement = document.getElementById("workspace-demo");
    if (demoElement && typeof demoElement.scrollIntoView === "function") {
      demoElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.45,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Global Fixed Header */}
      <LandingHeader />

      {/* Main Body Content */}
      <main className="w-full pt-16 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow Effect */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-primary-fixed via-secondary-fixed/40 to-surface-container-highest/20 blur-3xl pointer-events-none -z-10 rounded-full opacity-70"></div>

            {/* 1. Hero Section */}
            <HeroSection onDemoClick={handleDemoClick} />

            {/* 2. Interactive Workspace Mockup */}
            <WorkspaceMockup />
          </div>

          {/* 3. Powerful Architecture (3-Column Bento Grid) */}
          <FeatureBentoGrid />

          {/* 4. Social Proof & Testimonials */}
          <TestimonialsSection />

          {/* 5. Bottom High-Converting CTA Banner */}
          <CtaBanner />
        </div>
      </main>

      {/* Global Footer */}
      <LandingFooter />
    </div>
  );
};
