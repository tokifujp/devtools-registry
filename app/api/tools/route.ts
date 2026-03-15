import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Tool } from '@/types/tool';

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

    const created = await prisma.tool.create({
      data: {
        id: tool.id,
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
