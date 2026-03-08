import { useEffect, useMemo, useRef, useState } from "react"

import { useContent, useLanguage } from "@/components/language-provider"
import { Section } from "@/components/section"
import { Badge, SectionLabel, Heading, Text as TypographyText } from "@/components/typography"
import { cn } from "@/lib/utils"
import { getAssetPath } from "@/lib/assets"
import { AnimatePresence, motion } from "framer-motion"

export function SectionCompanyVision() {
  const { isRTL } = useLanguage()
  const { company } = useContent()
  const vision = company?.vision
  const phases = useMemo(() => vision?.phases ?? [], [vision?.phases])

  const [activePhaseKey, setActivePhaseKey] = useState<string>(phases[0]?.id ?? "")
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  const axisClass = cn(
    "relative space-y-10",
    isRTL ? "border-r pr-5 md:pr-8" : "border-l pl-5 md:pl-8"
  )
  const markerClass = cn(
    "absolute top-0 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white",
    isRTL ? "-right-[7px]" : "-left-[7px]"
  )
  const entryPadding = isRTL ? "pr-5 md:pr-8 text-right" : "pl-5 md:pl-8"
  const activePhase = phases.find((phase) => phase.id === activePhaseKey) ?? phases[0]

  useEffect(() => {
    let frame: number | null = null
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const isDesktop = window.innerWidth >= 1024
        const stickyTop = isDesktop
          ? (stickyRef.current?.getBoundingClientRect().top ?? 0)
          : window.innerHeight * 0.4
        let closestKey = activePhaseKey
        let smallestDelta = Number.POSITIVE_INFINITY
        entryRefs.current.forEach((el, index) => {
          if (!el || !phases[index]) return
          const delta = Math.abs(el.getBoundingClientRect().top - stickyTop)
          if (delta < smallestDelta) {
            smallestDelta = delta
            closestKey = phases[index].id
          }
        })
        if (closestKey && closestKey !== activePhaseKey) {
          setActivePhaseKey(closestKey)
        }
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    handleScroll()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [activePhaseKey, phases])

  useEffect(() => {
    if (phases.length && !activePhaseKey) {
      setActivePhaseKey(phases[0].id)
    }
  }, [phases, activePhaseKey])

  if (!vision || !phases.length) return null

  return (
    <Section id="vision" className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          {vision.badge && (
            <>
              {/* Section label (was Badge) */}
              <SectionLabel>{vision.badge}</SectionLabel>
            </>
          )}
          <Heading size="lg" className="mt-4">
            {vision.title}
          </Heading>
          <TypographyText className="mt-6 text-slate-600">
            {vision.body}
          </TypographyText>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div
            ref={stickyRef}
            className="lg:sticky lg:top-44 h-[240px] sm:h-[320px] lg:h-[400px] max-h-[75vh] rounded-3xl overflow-hidden shadow-lg relative"
          >
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhaseKey}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getAssetPath(activePhase?.image ?? "/fiber-cover.jpg")})`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${activePhaseKey}`}
                className="relative z-10 flex h-full flex-col justify-end p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                  {activePhase?.title && (
                    <Badge variant="emerald-light" className="text-emerald-200">
                      {activePhase.title}
                    </Badge>
                  )}
                  <TypographyText className="mt-3 text-sm text-white/90">
                    {activePhase?.body}
                  </TypographyText>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={axisClass}>
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={cn("relative", entryPadding)}
                ref={(el) => { entryRefs.current[index] = el }}
                style={{ minHeight: "clamp(280px, 50vw, 400px)" }}
              >
                <span className={markerClass} />
                <div
                  className={cn(
                    "rounded-3xl border bg-white p-5 md:p-8 shadow-sm transition flex flex-col",
                    activePhaseKey === phase.id ? "border-emerald-300 shadow-lg" : "border-transparent opacity-80"
                  )}
                >
                  {phase.title && (
                    <Badge variant="emerald" size="sm">
                      {phase.title}
                    </Badge>
                  )}
                  <TypographyText className="mt-4">
                    {phase.body}
                  </TypographyText>
                  <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    {phase.details?.map((detail, idx) => (
                      <li key={`${phase.id}-detail-${idx}`} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 w-px bg-gradient-to-b from-emerald-100 via-emerald-200 to-transparent",
                isRTL ? "right-0" : "left-0"
              )}
            />
          </div>
        </div>
      </div>
    </Section>
  )
}
