'use client';

import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FloatingDashboard from "@/components/landing/FloatingDashboard";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import FAQSection from "@/components/landing/FaqSection";
import SampleLeadCard from "@/components/landing/SameLeadCard";
import TestimonialSection from "@/components/landing/TestimonialSection";
import TrustedByStrip from "@/components/landing/TrustedByStrip";
import { NextPage } from "next";

const Index: NextPage = (props) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FloatingDashboard />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="pricing">
          <PricingSection />
          <TrustedByStrip />
        </section>
        
         <SampleLeadCard /> 
         
        <section id="faq">
          <FAQSection />
          <TestimonialSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
