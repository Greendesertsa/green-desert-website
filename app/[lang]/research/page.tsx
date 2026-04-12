import type { Metadata } from "next"
import { Header } from "@/components/header"
import FooterWithNews from "@/components/footer-with-news"
import { SectionCardCarousel } from "@/components/section-solutions-pathways"
import { Text as TypographyText } from "@/components/typography"
import enResearchContent from "@/content/i18n/en/research.json"
import arResearchContent from "@/content/i18n/ar/research.json"

interface PageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const isArabic = lang === "ar-SA"

  const title = isArabic ? "البحوث | الصحراء الخضراء" : "Research | Green Desert"
  const description = isArabic
    ? "تابع آخر المستجدات البحثية لدى الصحراء الخضراء."
    : "Follow Green Desert research updates and insights."

  return {
    title,
    description,
    alternates: {
      canonical: `https://greendesert.sa/${lang}/research`,
      languages: {
        "en-US": "https://greendesert.sa/en/research",
        "ar-SA": "https://greendesert.sa/ar-SA/research",
      },
    },
    openGraph: {
      type: "article",
      url: `https://greendesert.sa/${lang}/research`,
      siteName: "Green Desert",
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
      locale: isArabic ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  }
}

export default async function ResearchPage({ params }: PageProps) {
  const { lang } = await params
  const language = lang === "ar-SA" ? "ar" : "en"
  const isRTL = language === "ar"
  const content = language === "ar" ? arResearchContent : enResearchContent

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.hero.title}
          </h1>
          <TypographyText className="text-gray-600 max-w-3xl mx-auto">
            {content.hero.intro}
          </TypographyText>
        </div>
      </div>

      <div>
        {content.sections.map((section, i) => (
          <SectionCardCarousel
            key={i}
            section={section}
            isRTL={isRTL}
          />
        ))}
      </div>

      <FooterWithNews lang={lang} />
    </div>
  )
}

export const dynamic = "force-static"
