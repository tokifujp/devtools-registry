import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { generateUniqueSlug } from '../lib/slugify';

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('既存ツールにslugを追加中...');

  const allTools = await prisma.tool.findMany();

  console.log(`全${allTools.length}件のツールをチェック中...`);

  let count = 0;
  for (const tool of allTools) {
    const needsSlug = !tool.slug || tool.slug === '' || tool.slug.trim() === '';

    if (needsSlug) {
      const slug = generateUniqueSlug(tool.name, tool.id);

      await prisma.tool.update({
        where: { id: tool.id },
        data: { slug },
      });

      console.log(`✓ ${tool.name} -> ${slug}`);
      count++;
    }
  }

  console.log(`${count}件のツールを更新しました`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });