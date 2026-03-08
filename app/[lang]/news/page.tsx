import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import FooterWithNews from "@/components/footer-with-news";
import { BlogCard } from "@/components/blog-card";
import { getAllEntries } from "@/lib/posts";
import enNewsContent from "@/content/i18n/en/news.json";
import arNewsContent from "@/content/i18n/ar/news.json";
import { Text as TypographyText } from "@/components/typography";
import { getAssetPath } from "@/lib/assets";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar-SA";

  const title = isArabic ? "الأخبار | الصحراء الخضراء" : "News | Green Desert";
  const description = isArabic
    ? "آخر الأخبار والشراكات والتجارب الميدانية من فريق الصحراء الخضراء."
    : "Latest news, partnerships, and field pilots from the Green Desert team.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://greendesert.sa/${lang}/news`,
      languages: {
        "en-US": "https://greendesert.sa/en/news",
        "ar-SA": "https://greendesert.sa/ar-SA/news",
      },
    },
    openGraph: {
      type: "article",
      url: `https://greendesert.sa/${lang}/news`,
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
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { lang } = await params;
  const language = lang === "ar-SA" ? "ar" : "en";
  const languageRoute = language === "ar" ? "ar-SA" : "en";
  const content = language === "ar" ? arNewsContent : enNewsContent;
  const posts = await getAllEntries("news", language);
  const isArabic = language === "ar";

  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>
          <TypographyText className="text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </TypographyText>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  isRTL={isArabic}
                  languageRoute={languageRoute}
                  href={post.url ?? `/news/${post.slug}`}
                />
              ))}
            </div>

            {rest.length > 0 && (
              <div className="mt-10 space-y-3">
                {rest.map((post) => {
                  const href = post.url
                    ? post.url
                    : `/${languageRoute}/news/${post.slug}`;
                  return (
                    <div
                      key={post.slug}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                    >
                      {post.image && (
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getAssetPath(post.image)}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] uppercase tracking-wide text-emerald-600">
                          {formatDate(post.date, isArabic)}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {post.title}
                          </p>
                          <Link
                            href={href}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 shrink-0"
                            target={post.url ? "_blank" : undefined}
                            rel={post.url ? "noopener noreferrer" : undefined}
                          >
                            {isArabic ? "اقرأ المزيد" : "Read more"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {isArabic ? "لا توجد أخبار بعد" : "No news yet"}
            </h3>
            <TypographyText className="text-gray-600 max-w-md mx-auto">
              {isArabic
                ? "نحن نعمل على إضافة أخبار جديدة. تابعونا للمستجدات!"
                : "We're working on adding fresh news. Check back soon!"}
            </TypographyText>
            <Link
              href={`/${languageRoute}`}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              {isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to home"}
            </Link>
          </div>
        )}
      </div>
      <FooterWithNews lang={lang} />
    </div>
  );
}

export const dynamic = "force-static";
