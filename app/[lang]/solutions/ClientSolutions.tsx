"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { SectionSolutionsHero } from "@/components/section-solutions-hero";
import { SectionSolutionsHighlights } from "@/components/section-solutions-highlights";
import { SectionWorkWithUsCta } from "@/components/section-work-with-us-cta";
import { SectionSolutionsPathways } from "@/components/section-solutions-pathways";
// import { SectionSolutionsWalkthrough } from "@/components/section-solutions-walkthrough";

export function ClientSolutions() {
  const { isRTL, language } = useLanguage();

  return (
    <main
      className={cn(isRTL ? "rtl" : "ltr")}
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
    >
      <SectionSolutionsHero />
      <SectionSolutionsHighlights />
      <SectionSolutionsPathways />
      <SectionWorkWithUsCta />
      {/* <SectionSolutionsWalkthrough /> */}
    </main>
  );
}
