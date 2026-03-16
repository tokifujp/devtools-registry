import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import ToolDetailPage from '@/components/ToolDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTool(slug: string) {
  const tool = await prisma.tool.findUnique({
    where: { slug },
  });

  if (!tool) {
    return null;
  }

  return {
    ...tool,
    officialSite: tool.officialSite || undefined,
    githubUrl: tool.githubUrl || undefined,
    tags: JSON.parse(tool.tags),
    installations: JSON.parse(tool.installations),
    usage: JSON.parse(tool.usage),
    createdAt: tool.createdAt.toISOString(),
    updatedAt: tool.updatedAt.toISOString(),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || 'https://devtools.tokifuji.dev';
  const pageUrl = `${siteUrl}/tools/${slug}`;

  return {
    title: `${tool.name} - DevTools Registry`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - DevTools Registry`,
      description: tool.description,
      url: pageUrl,
      siteName: 'DevTools Registry',
      type: 'article',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - DevTools Registry`,
      description: tool.description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tool = await getTool(slug);

  if (!tool) {
    notFound();
  }

  return <ToolDetailPage tool={tool} />;
}