import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleDetail } from "@/components/blog/ArticleDetail";
import { JsonLd } from "@/components/JsonLd";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  getSiteSettings,
} from "@/lib/queries";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildArticleMetadata,
} from "@/lib/seo";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);
  if (!article) return {};
  return buildArticleMetadata(article, settings);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);
  if (!article) notFound();

  const related = await getRelatedPosts(slug);

  const breadcrumbs = breadcrumbJsonLd(
    [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: article.title, path: `/blog/${article.slug}` },
    ],
    settings,
  );

  return (
    <>
      <JsonLd data={articleJsonLd(article, settings)} />
      <JsonLd data={breadcrumbs} />
      <ReadingProgress />
      <Header variant="inner" active="blog" />
      <ArticleDetail article={article} related={related} />
      <Footer variant="inner" />
    </>
  );
}
