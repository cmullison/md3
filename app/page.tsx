"use client";
import { useState } from "react";
import Header from "@/components/landing/Header";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import MainContent from "@/components/landing/MainContent";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <BackgroundEffects />
      <div className="relative z-10">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <MainContent />
      </div>
    </div>
  );
}
