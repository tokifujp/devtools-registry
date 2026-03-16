import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Tool } from '@/types/tool';
import { generateUniqueSlug } from '@/lib/slugify';

export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = tools.map(tool => ({
      ...tool,
      tags: JSON.parse(tool.tags),
      installations: JSON.parse(tool.installations),
      usage: JSON.parse(tool.usage),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('GET /api/tools error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tool: Tool = await request.json();

    // slugを生成（IDを使って一意性を保証）
    const slug = generateUniqueSlug(tool.name, tool.id);

    const created = await prisma.tool.create({
      data: {
        id: tool.id,
        slug,
        name: tool.name,
        category: tool.category,
        tags: JSON.stringify(tool.tags),
        officialSite: tool.officialSite,
        githubUrl: tool.githubUrl,
        description: tool.description,
        installations: JSON.stringify(tool.installations),
        usage: JSON.stringify(tool.usage),
        notes: tool.notes,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error('POST /api/tools error:', error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}