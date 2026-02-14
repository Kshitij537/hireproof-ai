import React from "react";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import PricingSection from "./PricingSection";
import ProblemSection from "./ProblemSection";
import ScreenshotSection from "./ScreenshotSection";
import ValueSection from "./ValueSection";

const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ValueSection />
      <ScreenshotSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default LandingPage;
