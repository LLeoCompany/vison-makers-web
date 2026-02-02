"use client";

import React from "react";
import type { IndustryConfig } from "@/config/industryConfig";
import IndustryHero from "./IndustryHero";
import IndustryDemo from "./IndustryDemo";
import IndustryKPI from "./IndustryKPI";
import IndustryCTA from "./IndustryCTA";

interface IndustryLandingProps {
  config: IndustryConfig;
}

const IndustryLanding = ({ config }: IndustryLandingProps) => {
  return (
    <main className="bg-[#020617] min-h-screen">
      <IndustryHero config={config} />
      <IndustryDemo config={config} />
      <IndustryKPI config={config} />
      <IndustryCTA config={config} />
    </main>
  );
};

export default IndustryLanding;
