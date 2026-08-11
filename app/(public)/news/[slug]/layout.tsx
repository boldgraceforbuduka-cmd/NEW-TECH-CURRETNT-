// app/(public)/news/[slug]/layout.tsx

import { Metadata } from 'next';
import { APP_URL, fetchArticles } from '@/lib/api/client';
import { generateSlug } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const articles = await fetchArticles({ limit: 100 });

    const article = articles.find(
      (a) => generateSlug(a.title) === params.slug
    );

    if (!article) {
      return {
        title: 'Article Not Found — Tech Current',
        description:
          'The article you are looking for does not exist.',
      };
    }

    const title = `${article.title} — Tech Current`;

    const description =
      article.description ||
      'Read the latest technology news on Tech Current.';

    const imageUrl =
      article.image_url ||
      `${APP_URL}/og-default.jpg`;

    return {
      title,
      description,

      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        url: `${APP_URL}/news/${params.slug}`,
        type: 'article',
        publishedTime: article.published_at,
        authors: article.author
          ? [article.author]
          : undefined,
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error(
      'Failed to generate article metadata:',
      error
    );

    return {
      title: 'Tech Current',
      description:
        'Latest technology news, AI, startups, cybersecurity and more.',
    };
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}