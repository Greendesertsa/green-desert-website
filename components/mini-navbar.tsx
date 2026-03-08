"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ContentStructure, useContent, useLanguage } from "@/components/language-provider"

type ContentKey = keyof Pick<ContentStructure, 'home' | 'company' | 'solutions'>

type Section = { id: string; label: string }

export function MiniNavbar({ contentKey, sections: overrideSections }: { contentKey: ContentKey, sections?: Section[] }) {
  const { t, isRTL } = useLanguage()
  const content = useContent()
  const sections: Section[] | undefined = overrideSections
    ?? ("miniNav" in (content as any)[contentKey] ? (content as any)[contentKey].miniNav as Section[] : undefined)
  const [active, setActive] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sections || sections.length === 0) return
    const sectionEls = sections?.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[] || []
    if (sectionEls.length === 0) return
    let ticking = false
    const update = () => {
      ticking = false
      const navTop = navRef.current?.getBoundingClientRect().top ?? 0
      const crossed = sectionEls.filter(sec => sec.getBoundingClientRect().top <= navTop + 1)
      if (crossed.length > 0) {
        const last = crossed[crossed.length - 1]
        if (last.id !== active) setActive(last.id)
      } else if (active !== null) {
        setActive(null)
      }
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    const onResize = onScroll
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [active, sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    let stickyTop = 0
    if (navRef.current) {
      const cs = window.getComputedStyle(navRef.current)
      const topVal = cs.top || '0px'
      stickyTop = parseFloat(topVal) || 0
    }
    const y = el.getBoundingClientRect().top + window.scrollY - stickyTop
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div ref={navRef} className={cn("sticky z-30")} style={{ top: 'calc(var(--gd-header-offset, 0px) + 12px)' }}>
      <div className={cn("w-full px-4 md:px-0 md:container md:mx-auto")}>
        <nav
          className={cn(
            "overflow-x-auto scrollbar-none mx-auto",
            "md:w-min",
            "rounded-full border backdrop-blur-md",
            "bg-white/65 border-gray-200 shadow-sm"
          )}
        >
          <ul className={cn("flex items-center gap-1 p-1", isRTL && "flex-row-reverse")}>
            {sections?.map((s) => (
              <li key={s.id} className="shrink-0">
                <button
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "px-3 md:px-4 py-2 text-[19px] rounded-full transition-colors",
                    active === s.id
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {s.label ?? (s.id ? t(s.id) : "")}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
