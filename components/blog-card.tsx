import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn, formatHref, isExternalHref } from '@/lib/utils'
import { Heading } from '@/components/typography'
import { getAssetPath } from '@/lib/assets'

// Narrow post shape so this component works with both
// lib/blog and lib/blog-static post sources
export interface BlogCardPost {
  slug: string
  title: string
  date?: string
  excerpt?: string
  author?: string
  image?: string
  tags?: string[]
  url?: string
  meta?: string
}

interface BlogCardProps {
  post: BlogCardPost
  isRTL: boolean
  languageRoute: string
  href?: string
  external?: boolean
  imageClassName?: string
}

export function BlogCard({ post, isRTL, languageRoute, href, imageClassName, external }: BlogCardProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isRTL) {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const firstTag = post.tags && post.tags.length > 0 ? post.tags[0] : undefined
  const rawHref = href ?? post.url
  const resolvedHref = formatHref(rawHref, languageRoute)
  const isExternal = external || isExternalHref(rawHref)
  const anchorHref = isExternal ? (rawHref ?? "#") : resolvedHref
  const imageSrc = post.image ? getAssetPath(post.image) : getAssetPath('/placeholder.jpg')

  const CardContent = (
      <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 transition-colors duration-300 hover:shadow-lg hover:border-gray-300 hover:cursor-pointer">
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className={cn(
                imageClassName || "object-cover"
              )}
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          {/* Single Tag (max one) */}
          {firstTag && (
            <div className={`${isRTL ? 'text-right' : 'text-left'} mb-3`}>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {firstTag}
              </span>
            </div>
          )}

          {/* Title */}
          <Heading as="h2" size="lg" className={`mb-3 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'} transition-colors`}>
            {post.title}
          </Heading>

          {/* Excerpt */}
          {post.excerpt && (
            <p className={`flex-1 text-gray-600 mb-6 line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              {post.excerpt}
            </p>
          )}

          {/* Bottom bar: date and arrow at opposite sides */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            {isRTL ? (
              <>
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-[-2px]" />
                <span>{post.meta ?? (post.date ? formatDate(post.date) : null)}</span>
              </>
            ) : (
              <>
                <span>{post.meta ?? (post.date ? formatDate(post.date) : null)}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </div>
        </div>
      </article>
  )

  if (isExternal) {
    return (
      <a href={anchorHref} target="_blank" rel="noopener noreferrer" className="group block h-full">
        {CardContent}
      </a>
    )
  }

  return (
    <Link href={anchorHref} className="group block h-full">
      {CardContent}
    </Link>
  )
}
