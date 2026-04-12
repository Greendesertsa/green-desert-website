"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"

import { useContent, useLanguage } from "@/components/language-provider"
import { Section } from "@/components/section"
import { getAssetPath } from "@/lib/assets"
import { SectionLabel, Heading } from "./typography"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

function SolutionCard({
  sector,
  languageRoute,
}: {
  sector: {
    id: string
    title?: string
    tagline?: string
    summary?: string
    image?: string | null
    video?: string | null
    href?: string
  },
  languageRoute: string,
}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { t } = useLanguage()

  const href = sector.href
    ? sector.href.startsWith("/") ? `/${languageRoute}${sector.href}` : sector.href
    : `/${languageRoute}/solutions/${sector.id}`
  const image = getAssetPath(sector.image || "/placeholder.webp")
  const video = sector.video ? getAssetPath(sector.video) : null

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white transition w-[75vw] md:w-[25%]"
    >
      <div className="relative h-[50%] min-h-[220px] w-full overflow-hidden rounded-3xl">
        {video && (
          <>
            <video
              ref={videoRef}
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
            />
            <button
              onClick={togglePlayPause}
              className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
              )}
            </button>
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-900/5 to-slate-900/25 pointer-events-none" />
          </>
        )}
        {!video && image && (
          <>
            <Image
              src={image}
              alt={sector.title || "Solution Image"}
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 280px, 240px"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-900/5 to-slate-900/25" />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between px-4 pb-5 pt-4">
        <Heading as="h3" size="md">
          {sector.title}
        </Heading>
        <p className="mt-2 text-[13px] leading-normal text-slate-600 line-clamp-2">
          {sector.summary || sector.tagline}
        </p>
        <div className="mt-4 flex items-center justify-between text-[13px] font-semibold text-emerald-600">
          <span>{t("labels.learnMore")}</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-emerald-400 group-hover:text-emerald-600 transition">
            ↗
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Research / Education card carousel ──────────────────────────────────────

export interface CarouselCard {
  tag: string
  title: string
  excerpt: string
  meta: string
  url: string
  image: string
}

export interface CarouselSection {
  title: string
  subtitle?: string | null
  cards: CarouselCard[]
}

function ContentCard({ card }: { card: CarouselCard }) {
  const image = getAssetPath(card.image || "/placeholder.webp")
  const isExternal = card.url !== "#" && card.url.startsWith("http")
  const linkProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  return (
    <a
      href={card.url}
      {...linkProps}
      className="group flex h-full flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white transition w-[75vw] sm:w-[280px] lg:w-[320px]"
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt={card.title}
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 640px) 280px, 75vw"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-900/5 to-slate-900/25" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <span className="mb-2 inline-block self-start px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          {card.tag}
        </span>
        <Heading as="h3" size="md" className="line-clamp-2">
          {card.title}
        </Heading>
        <p className="mt-2 flex-1 text-[13px] leading-normal text-slate-600 line-clamp-3">
          {card.excerpt}
        </p>
        <p className="mt-4 text-[13px] text-slate-400">{card.meta}</p>
      </div>
    </a>
  )
}

export function SectionCardCarousel({
  section,
  isRTL,
}: {
  section: CarouselSection
  isRTL: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.firstElementChild as HTMLElement | null
    const cardWidth = firstCard?.offsetWidth ?? 320
    const gap = 24
    const delta = (cardWidth + gap) * (dir === "next" ? 1 : -1)
    track.scrollBy({ left: isRTL ? -delta : delta, behavior: "smooth" })
  }

  return (
    <section className={cn("border-t border-gray-100 py-16", isRTL && "dir-rtl")}>
      <div className="container mx-auto px-4">
        <div className={cn("flex items-start justify-between mb-8", isRTL && "flex-row-reverse")}>
          <div>
            <h2 className={cn("text-2xl font-bold text-gray-900", isRTL && "text-right")}>
              {section.title}
            </h2>
            {section.subtitle && (
              <p className={cn("mt-1 text-sm text-gray-500", isRTL && "text-right")}>
                {section.subtitle}
              </p>
            )}
          </div>
          <div className={cn("hidden sm:flex items-center gap-2 shrink-0 ml-4", isRTL && "flex-row-reverse mr-4 ml-0")}>
            <button
              onClick={() => scroll("prev")}
              aria-label={isRTL ? "Next" : "Previous"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label={isRTL ? "Previous" : "Next"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {section.cards.map((card, i) => (
            <ContentCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export function SectionSolutionsPathways() {
  const { languageRoute } = useLanguage()
  const { solutions } = useContent()
  const pathways = solutions?.pathways

  if (!pathways?.sectors?.length) return null
  return (
    <Section id="pathways" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          {pathways.title && (
            <>
              {/* Section label (was Badge) */}
              <SectionLabel>
                {pathways.title}
              </SectionLabel>
            </>
          )}
          {pathways.subtitle && (
            <Heading size="xl" className="mt-3">
              {pathways.subtitle}
            </Heading>
          )}
        </div>
        <div className="relative mt-12 flex h-[440px] gap-6 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory">
          {pathways.sectors.map((sector) => (
            <SolutionCard
              key={sector.id}
              sector={sector}
              languageRoute={languageRoute}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
