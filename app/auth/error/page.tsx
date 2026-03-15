'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="text-red-500" size={32} />
        <h1 className="text-2xl font-bold">ログインエラー</h1>
      </div>

      <div className="mb-6">
        {error === 'AccessDenied' ? (
          <p className="text-gray-700 dark:text-gray-300">
            申し訳ございません。このアカウントはアクセスが許可されていません。
          </p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            ログイン中にエラーが発生しました。もう一度お試しください。
          </p>
        )}
      </div>

      <Link
        href="/"
        className="block w-full text-center bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        ホームに戻る
      </Link>
    </div>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-center">読み込み中...</p>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}