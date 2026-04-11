"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn, formatDate } from "@/lib/utils";
import type { ContentEntry } from "@/lib/posts";
import { useContent, useLanguage } from "./language-provider";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "./ui/icon";
import { getAssetPath } from "@/lib/assets";

interface ArticleDetailProps {
  post: ContentEntry;
  languageRoute: string;
  root: "news" | "blog";
}

export function ArticleDetail({
  post,
  languageRoute,
  root,
}: ArticleDetailProps) {
  const content = useContent();
  const { isRTL } = useLanguage();
  const articleRef = useRef<HTMLElement>(null);
  const alignText = "";

  useEffect(() => {
    if (!articleRef.current) return;
    articleRef.current.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }, [post.content]);

  const rootLink =
    root === "news"
      ? content.footer.sections[2].links[0]
      : content.footer.sections[2].links[1];

  const TagList =
    post.tags && post.tags.length > 0 ? (
      <div className={cn("mb-6 flex flex-wrap gap-2")}>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full border border-gray-400 text-gray-700 text-xs font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
    ) : null;

  return (
    <div className="bg-white" lang={languageRoute}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 max-w-5xl">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/${languageRoute}${rootLink.href}`}
                  className="text-gray/70 hover:text-gray"
                >
                  {rootLink.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray/50">
              <Icon name="chevron-right" className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className={cn("mb-10", alignText)}>
          {TagList}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <div className={cn("flex items-center gap-4 text-sm text-gray-600")}>
            <time dateTime={post.date}>{formatDate(post.date, isRTL)}</time>
            {post.author ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gray-400" />
                {content.labels.by}
                <span className="font-bold">{post.author}</span>
              </span>
            ) : null}
          </div>
          {post.image && (
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm h-96">
              <Image
                src={getAssetPath(post.image)}
                alt={post.title}
                width={728}
                height={332}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}
        </header>

        <article
          ref={articleRef}
          className={cn(
            "blog-article prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-xl prose-img:border prose-img:border-gray-200",
            isRTL
              ? "prose-h1:text-right prose-h2:text-right prose-h3:text-right prose-p:text-right prose-li:text-right"
              : "",
          )}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></article>
      </div>
    </div>
  );
}
