export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 英数字、空白、ハイフン以外を削除
    .replace(/[\s_-]+/g, '-') // 空白やアンダースコアをハイフンに
    .replace(/^-+|-+$/g, ''); // 先頭・末尾のハイフンを削除
}

// 重複を避けるためにIDを付加する関数
export function generateUniqueSlug(name: string, id: string): string {
  const baseSlug = slugify(name);
  // IDの最初の8文字を追加（ripgrep-cm7abc12）
  return `${baseSlug}-${id.substring(0, 8)}`;
}
