'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const components: Components = {
    // リンクは新しいタブで開く
    a: ({ node, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" />
    ),
    // コードブロックのスタイル  
    code: ({ node, children, ...props }) => {
      // nodeの構造を見て、ブロックコードかインラインコードか判定
      const isInline = node?.position?.start.line === node?.position?.end.line;

      return isInline ? (
        <code
          className="!px-1.5 !py-0.5 !bg-gray-100 dark:!bg-gray-800 !rounded !text-sm !text-gray-900 dark:!text-gray-100 before:!content-none after:!content-none"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code
          className="!text-gray-100 !text-sm !font-mono before:!content-none after:!content-none"
          style={{ whiteSpace: 'pre' }}
          {...props}
        >
          {children}
        </code>
      );
    },
    // preタグをカスタマイズ
    pre: ({ node, children, ...props }) => (
      <pre
        className="!bg-gray-900 dark:!bg-gray-950 !p-4 !rounded-lg !overflow-x-auto !my-4"
        style={{ whiteSpace: 'pre' }}
        {...props}
      >
        {children}
      </pre>
    ),
    // テーブルのスタイル
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
      </div>
    ),
  };

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}