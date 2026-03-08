"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getAssetPath, getRoutePath } from "@/lib/assets";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { clsx } from "clsx";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Text as TypographyText } from "./typography";
import headerContent from "@/content/i18n/en/header.json";

type NavItem = (typeof headerContent)["nav"][number];

interface MobileMenuProps {
  variant?: "light" | "dark";
  navigationItems?: NavItem[];
}

export function MobileMenu({
  variant = "light",
  navigationItems,
}: MobileMenuProps) {
  const { t, isRTL, language, languageRoute, setLanguage } = useLanguage();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems = navigationItems ?? (t("header.nav") as NavItem[]) ?? [];
  const learnMoreLabel = t("labels.learnMore");

  const formatHref = (href?: string) => {
    if (!href) return undefined;
    const prefixed = href.startsWith("/") ? `/${languageRoute}${href}` : href;
    return getRoutePath(prefixed);
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={clsx(
            "md:hidden p-2 transition-colors duration-300",
            variant === "dark"
              ? "text-white hover:text-white/80"
              : "text-gray-700 hover:text-green-600",
          )}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side={isRTL ? "left" : "right"}
        className="w-full max-w-sm p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <SheetHeader
            className={`flex flex-row items-center justify-between p-6 border-b border-gray-100 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Image
              src={getAssetPath("/logo_GD_black_EN.png")}
              alt="Green Desert Logo"
              width={80}
              height={24}
              className="h-6 w-auto"
            />
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}
            >
              <SheetClose asChild>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                ></button>
              </SheetClose>
              {/* Language Toggle */}
              {/* <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${language === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                    }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${language === 'ar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                    }`}
                >
                  AR
                </button>
              </div> */}
            </div>
          </SheetHeader>

          {/* Navigation Content */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Navigation Links */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-2">
              {navItems.map((item) => {
                const hasSubItems = !!item.subItems?.length;
                const itemHref = formatHref(item.href) ?? "#";
                const isExpanded = expandedMenu === item.label;

                if (!hasSubItems) {
                  return (
                    <a
                      key={item.label}
                      href={itemHref}
                      className="block py-4 px-4 text-xl font-medium text-gray-900 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <div className="rounded-lg overflow-hidden" key={item.label}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        "w-full py-4 px-4 hover:bg-green-50 rounded-lg transition-all duration-200",
                        isExpanded && "bg-green-50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between",
                          isRTL && "flex-row-reverse",
                        )}
                      >
                        <span className="text-xl font-medium text-gray-900 hover:text-green-600">
                          {item.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div
                        className={cn(
                          "mt-2 space-y-1",
                          isRTL ? "mr-4" : "ml-4",
                        )}
                      >
                        {item.subItems?.map((subItem) => {
                          const subHref =
                            "href" in subItem
                              ? formatHref(subItem.href)
                              : undefined;

                          if (subHref) {
                            return (
                              <a
                                key={subItem.label}
                                href={subHref}
                                className="block rounded-lg px-4 py-3 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                              >
                                <span className="text-lg font-medium text-gray-900">
                                  {subItem.label}
                                </span>
                                {subItem.description && (
                                  <TypographyText
                                    variant="muted"
                                    className="mt-1 text-sm"
                                  >
                                    {subItem.description}
                                  </TypographyText>
                                )}
                                <TypographyText
                                  variant="muted"
                                  className="mt-2 text-xs font-semibold uppercase tracking-wide"
                                >
                                  {learnMoreLabel}
                                </TypographyText>
                              </a>
                            );
                          }

                          return (
                            <div
                              key={subItem.label}
                              className="block rounded-lg px-4 py-3 transition-all duration-200"
                            >
                              <span className="text-lg font-medium text-gray-900">
                                {subItem.label}
                              </span>
                              {subItem.description && (
                                <TypographyText
                                  variant="muted"
                                  className="mt-1 text-sm"
                                >
                                  {subItem.description}
                                </TypographyText>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="px-6 py-6 border-t border-gray-100">
              <Link
                href={`/${language === "ar" ? "ar-SA" : "en"}/contact`}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium place-self-start",
                  "bg-gray-100 hover:bg-gray-200 text-gray-700",
                )}
              >
                {t("labels.contactUsCta.label")}
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
