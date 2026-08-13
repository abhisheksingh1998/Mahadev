import type {Metadata} from 'next'
import {imageUrl} from './sanity'
import type {PostDetail, SanityImage, SiteSettings} from './types'

const DEFAULT_SITE_NAME = 'Mahadev Book'
const DEFAULT_SITE_URL = 'https://mahadevbook.com'

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return DEFAULT_SITE_URL
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

export function resolveOgImage(
  image?: SanityImage | null,
  fallback = '/images/logo.png',
): string {
  const url = imageUrl(image, 1200) || fallback
  if (url.startsWith('http')) return url
  return absoluteUrl(url)
}

type BuildMetadataOptions = {
  title: string
  description?: string
  path?: string
  image?: SanityImage | null
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  noIndex?: boolean
  canonicalUrl?: string
  siteName?: string
}

export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const canonical =
    opts.canonicalUrl || (opts.path ? absoluteUrl(opts.path) : getSiteUrl())
  const ogImage = resolveOgImage(opts.image)
  const siteName = opts.siteName || DEFAULT_SITE_NAME

  return {
    title: opts.title,
    description: opts.description,
    alternates: {canonical},
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName,
      locale: 'en_US',
      type: opts.type || 'website',
      images: [{url: ogImage, width: 1200, height: 630, alt: opts.title}],
      ...(opts.type === 'article' && opts.publishedTime
        ? {
            publishedTime: opts.publishedTime,
            modifiedTime: opts.modifiedTime || opts.publishedTime,
            authors: opts.author ? [opts.author] : undefined,
            tags: opts.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [ogImage],
    },
    ...(opts.noIndex ? {robots: {index: false, follow: false}} : {}),
  }
}

export function buildSiteMetadata(settings: SiteSettings): Metadata {
  const siteName = settings.organizationName || DEFAULT_SITE_NAME
  const siteUrl = settings.siteUrl?.replace(/\/$/, '') || getSiteUrl()

  const verification: Metadata['verification'] = {}
  if (settings.googleSiteVerification) {
    verification.google = settings.googleSiteVerification
  }
  if (settings.bingSiteVerification) {
    verification.other = {'msvalidate.01': settings.bingSiteVerification}
  }

  const base = buildMetadata({
    title: settings.title || siteName,
    description: settings.description,
    path: '/',
    image: settings.ogImage || settings.logo,
    siteName,
  })

  return {
    ...base,
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.title || siteName,
      template: `%s | ${siteName}`,
    },
    ...(Object.keys(verification).length > 0 ? {verification} : {}),
    ...(settings.twitterHandle
      ? {twitter: {...(base.twitter || {}), creator: `@${settings.twitterHandle.replace(/^@/, '')}`}}
      : {}),
  }
}

export function buildArticleMetadata(
  article: PostDetail,
  settings: SiteSettings,
): Metadata {
  const siteName = settings.organizationName || DEFAULT_SITE_NAME

  return buildMetadata({
    title: article.seoTitle || `${article.title} | ${siteName} Blog`,
    description: article.seoDescription || article.excerpt,
    path: `/blog/${article.slug}`,
    image: article.seoOgImage || article.mainImage || settings.ogImage,
    type: 'article',
    publishedTime: article.publishedAt,
    author: article.authorName,
    tags: article.tags,
    noIndex: article.seoNoIndex,
    canonicalUrl: article.seoCanonicalUrl,
    siteName,
  })
}

export function organizationJsonLd(settings: SiteSettings) {
  const siteUrl = settings.siteUrl?.replace(/\/$/, '') || getSiteUrl()
  const name = settings.organizationName || DEFAULT_SITE_NAME

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: siteUrl,
    logo: resolveOgImage(settings.logo || settings.ogImage),
    description: settings.description,
    ...(settings.footer?.email
      ? {contactPoint: {'@type': 'ContactPoint', email: settings.footer.email, contactType: 'customer support'}}
      : {}),
    sameAs: settings.footer?.socialLinks
      ?.map((link) => link.url)
      .filter(Boolean),
  }
}

export function websiteJsonLd(settings: SiteSettings) {
  const siteUrl = settings.siteUrl?.replace(/\/$/, '') || getSiteUrl()
  const name = settings.organizationName || DEFAULT_SITE_NAME

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: siteUrl,
    description: settings.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function articleJsonLd(article: PostDetail, settings: SiteSettings) {
  const siteUrl = settings.siteUrl?.replace(/\/$/, '') || getSiteUrl()
  const name = settings.organizationName || DEFAULT_SITE_NAME

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: resolveOgImage(article.seoOgImage || article.mainImage || settings.ogImage),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName || name,
    },
    publisher: {
      '@type': 'Organization',
      name,
      logo: {
        '@type': 'ImageObject',
        url: resolveOgImage(settings.logo || settings.ogImage),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${article.slug}`,
    },
    ...(article.tags?.length ? {keywords: article.tags.join(', ')} : {}),
  }
}

export function faqJsonLd(items: {question?: string; answer?: string}[]) {
  const valid = items.filter((item) => item.question && item.answer)
  if (!valid.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function breadcrumbJsonLd(
  items: {name: string; path: string}[],
  settings?: SiteSettings,
) {
  const siteUrl = settings?.siteUrl?.replace(/\/$/, '') || getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
