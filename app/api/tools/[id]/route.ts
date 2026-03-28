import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { ToolSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/slugify';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = ToolSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }
    const tool = result.data;

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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
