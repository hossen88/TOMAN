"use client";

export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Compatibility from "@/components/Compatibility";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Compatibility />
      <CTA />
    </>
  );
}
