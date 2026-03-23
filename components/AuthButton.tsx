'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-gray-400">
        <User size={20} />
        <span className="hidden sm:inline">読み込み中...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">ログアウト</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
    >
      <LogIn size={20} />
      <span className="hidden sm:inline">ログイン</span>
    </button>
  );
}
