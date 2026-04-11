import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Options as SanitizeSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element, ElementContent } from "hast";
import { getAssetPath } from "./assets";

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function rehypeYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const nonEmpty = node.children.filter(
        (c) => !(c.type === "text" && c.value.trim() === "")
      );
      if (nonEmpty.length !== 1) return;
      const child = nonEmpty[0] as Element;
      if (child.type !== "element" || child.tagName !== "a") return;
      const href = child.properties?.href as string | undefined;
      if (!href) return;
      const videoId = extractYouTubeId(href);
      if (!videoId) return;

      const iframe: ElementContent = {
        type: "element",
        tagName: "iframe",
        properties: {
          src: `https://www.youtube.com/embed/${videoId}`,
          title: "YouTube video player",
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: true,
          width: "100%",
          height: "400",
        },
        children: [],
      };
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["youtube-embed"] },
        children: [iframe],
      };
    });
  };
}

const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    div: [...((defaultSchema.attributes?.div as string[]) ?? []), "class"],
    iframe: [
      ["src", /^https:\/\/www\.youtube\.com\/embed\//],
      "title",
      "frameborder",
      "allow",
      "allowfullscreen",
      "width",
      "height",
    ],
  },
};

export type EntryKind = "blog" | "news";

export interface ContentEntry {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  image?: string;
  tags?: string[];
  url?: string;
  language: "en" | "ar";
}

const BASE_DIR: Record<EntryKind, string> = {
  blog: path.join(process.cwd(), "content/blog"),
  news: path.join(process.cwd(), "content/news"),
};

function getSlugs(kind: EntryKind, language: "en" | "ar"): string[] {
  const dir = path.join(BASE_DIR[kind], language);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

export async function getEntryBySlug(
  kind: EntryKind,
  slug: string,
  language: "en" | "ar",
): Promise<ContentEntry | null> {
  try {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(BASE_DIR[kind], language, `${realSlug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeYouTubeEmbed)
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeStringify)
      .process(content);

    const dateValue =
      data.date instanceof Date
        ? data.date.toISOString()
        : data.date || new Date().toISOString();
    const contentHtml = String(processedContent).replace(
      /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
      (match, src) => {
        if (src.startsWith("http") || src.startsWith("data:")) return match;
        const resolved = getAssetPath(src);
        return match.replace(src, resolved);
      },
    );

    return {
      slug: realSlug,
      title: data.title || realSlug,
      date: dateValue,
      excerpt: data.excerpt || content.substring(0, 200) + "...",
      content: contentHtml,
      author: data.author,
      image: data.image,
      tags: data.tags || [],
      url: data.url,
      language,
    };
  } catch (error) {
    console.error(`Error reading ${kind} ${slug}:`, error);
    return null;
  }
}

export async function getAllEntries(
  kind: EntryKind,
  language: "en" | "ar",
): Promise<ContentEntry[]> {
  const slugs = getSlugs(kind, language);
  const posts = await Promise.all(
    slugs.map((slug) => getEntryBySlug(kind, slug, language)),
  );
  return posts
    .filter((p): p is ContentEntry => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
