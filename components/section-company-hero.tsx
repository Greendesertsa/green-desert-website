"use client"

import Image from "next/image"

import { useContent } from "@/components/language-provider"
import { getAssetPath } from "@/lib/assets"
import { Section } from "@/components/section"
import { Badge, Heading, Text as TypographyText } from "@/components/typography"

export const SectionCompanyHero = () => {
  const { company } = useContent()
  const hero = company?.hero

  if (!hero) return null

  const imageSrc = hero.image ? getAssetPath(hero.image) : getAssetPath("/fiber-cover.jpg")
  return (
    <Section disablePadding className="relative min-h-[95vh]" data-hero="true">
      <div className="relative flex min-h-[95vh] w-full items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={hero.title ?? ""}
            fill
            priority
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-slate-950/25" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 py-12 text-center text-white sm:px-12 lg:px-16">
          {/* {hero.badge && (
            <Badge variant="emerald-light">
              {hero.badge}
            </Badge>
          )} */}
          {hero.title && (
            <Heading 
              as="h1"
              variant="white"
              className="uppercase lg:text-[5.45rem] text-[2.45rem]"
            >
              {hero.title}
            </Heading>
          )}
          {/* {hero.intro && (
            <TypographyText variant="white" className="mx-auto mt-4 max-w-2xl text-sm sm:text-base">
              {hero.intro}
            </TypographyText>
          )} */}
        </div>
      </div>
    </Section>
  )
}
