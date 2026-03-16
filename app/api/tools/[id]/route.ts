import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Tool } from '@/types/tool';
import { generateUniqueSlug } from '@/lib/slugify';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const tool: Tool = await request.json();

    // 名前が変更された場合はslugも更新
    const slug = generateUniqueSlug(tool.name, tool.id);

    const updated = await prisma.tool.update({
      where: { id },
      data: {
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/tools error:', error);
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.tool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tools error:', error);
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}