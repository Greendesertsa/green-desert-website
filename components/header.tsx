"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { useLanguage } from "@/components/language-provider";
import { MobileMenu } from "@/components/mobile-menu";
import { NavigationMenuLink } from "./navigation-menu-link";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { getAssetPath } from "@/lib/assets";
import { cn } from "@/lib/utils";
// import { LanguageDropdown } from "@/components/language-dropdown";
import { usePathname } from "next/navigation";
import headerI18m from "@/content/i18n/en/header.json";

export function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const headerHeightRef = useRef(72); // fallback height

  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measure = () => {
      if (headerRef.current) {
        headerHeightRef.current =
          headerRef.current.getBoundingClientRect().height ||
          headerHeightRef.current;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;

      const last = lastScrollYRef.current;
      const delta = Math.abs(y - last);
      // Small threshold to avoid flicker on tiny scrolls
      const threshold = 8;

      if (y < headerHeightRef.current) {
        // Near top: always show
        setShowHeader(true);
      } else if (delta > threshold) {
        if (y > last && y > headerHeightRef.current + 8) {
          // Scrolling down past header height: hide
          setShowHeader(false);
        } else if (y < last) {
          // Scrolling up: show
          setShowHeader(true);
        }
      }

      lastScrollYRef.current = y;
    };

    measure();
    onScroll();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const heroElement = document.querySelector('[data-hero="true"]');
    if (!heroElement) {
      setIsHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.35, 0.6, 0.9] },
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [pathname]);

  // Expose header offset as CSS variable for sticky elements (e.g., mini navbar)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const h =
      headerRef.current?.getBoundingClientRect().height ||
      headerHeightRef.current;
    document.documentElement.style.setProperty(
      "--gd-header-offset",
      showHeader ? `${h}px` : "0px",
    );
  }, [showHeader]);

  const isSubmenuOpen = activeSubmenu !== null;

  const navVariant = isHeroVisible ? "dark" : "light";
  const logoSrc = isHeroVisible
    ? "/logo_GD_white_home_EN.png"
    : "/logo_GD_black_EN.png";

  const handleMenuToggle = (menu: string) => (open: boolean) => {
    setActiveSubmenu(open ? menu : null);
  };

  const isOverlayState = isHeroVisible && !isSubmenuOpen;
  const headerTone = isHeroVisible ? "dark" : "light";

  const headerBackgroundClass = isOverlayState
    ? "bg-transparent text-white"
    : headerTone === "dark"
      ? "bg-slate-950/90 text-white shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur"
      : "bg-white/95 text-slate-900 shadow-sm backdrop-blur";

  const navigationItems = t("header.nav") as typeof headerI18m.nav;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out transform-gpu",
        showHeader ? "translate-y-0" : "-translate-y-full",
        headerBackgroundClass,
      )}
    >
      <div className="flex w-full px-7 md:px-10 lg:px-12 py-4 items-center">
        <div className="flex flex-1 items-center gap-8">
          <Link
            href={`/${language === "ar" ? "ar-SA" : "en"}`}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src={getAssetPath(logoSrc)}
              alt="Green Desert Logo"
              width={150}
              height={40}
              className="h-8 md:h-12 w-auto transition-opacity duration-300"
              priority
            />
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
          // style={{ background: "blue" }}
          >
            {navigationItems.map((navItem) => (
              <NavigationMenuLink
                key={navItem.label}
                item={navItem}
                variant={navVariant}
                onOpenChange={handleMenuToggle(navItem.label)}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={`/${language === "ar" ? "ar-SA" : "en"}/contact`}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
              isHeroVisible
                ? "bg-white text-slate-900 hover:bg-white/90"
                : "bg-slate-900 text-white hover:bg-slate-800",
            )}
          >
            {t("labels.contactUsCta.label")}
          </Link>
          {/* {!isMobile && (
            <LanguageDropdown
              language={language}
              setLanguage={setLanguage}
              variant={navVariant}
            />
          )} */}
          {isMobile && (
            <MobileMenu
              navigationItems={navigationItems}
              variant={navVariant}
            />
          )}
        </div>
      </div>
    </header>
  );
}
