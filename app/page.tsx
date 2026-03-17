'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Download, Upload, Trash2, Edit, ExternalLink, Github } from 'lucide-react';
import { Tool } from '@/types/tool';
import { useSession, signIn } from 'next-auth/react';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButton from '@/components/AuthButton';
import ToolModal from '@/components/ToolModal';
import ToolDetailModal from '@/components/ToolDetailModal';
import Footer from '@/components/Footer';
import MarkdownContent from '@/components/MarkdownContent';

export default function Home() {
  const { data: session } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [detailTool, setDetailTool] = useState<Tool | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [tools, searchQuery]);

  useEffect(() => {
    // URLパラメータから編集対象のIDを取得
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');

    if (editId && tools.length > 0) {
      const toolToEdit = tools.find(t => t.id === editId);
      if (toolToEdit) {
        setEditingTool(toolToEdit);
        setIsModalOpen(true);
        // URLパラメータをクリア
        window.history.replaceState({}, '', '/');
      }
    }
  }, [tools]);

  const loadTools = async () => {
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      setTools(data);
    } catch (error) {
      console.error('Failed to load tools:', error);
    }
  };

  const filterTools = () => {
    if (!searchQuery.trim()) {
      setFilteredTools(tools);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query)) ||
      tool.installations.some(inst => inst.os.toLowerCase().includes(query))
    );
    setFilteredTools(filtered);
  };

  const handleSaveTool = async (tool: Tool) => {
    if (!session) {
      signIn();
      return;
    }

    try {
      const method = editingTool ? 'PUT' : 'POST';
      const url = editingTool ? `/api/tools/${tool.id}` : '/api/tools';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool),
      });

      await loadTools();
      setIsModalOpen(false);
      setEditingTool(null);
    } catch (error) {
      console.error('Failed to save tool:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEditTool = (tool: Tool) => {
    if (!session) {
      signIn();
      return;
    }
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDeleteTool = async (id: string) => {
    if (!session) {
      signIn();
      return;
    }

    if (!confirm('このツールを削除しますか？')) return;

    try {
      await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      await loadTools();
    } catch (error) {
      console.error('Failed to delete tool:', error);
      alert('削除に失敗しました');
    }
  };

  const handleExport = async () => {
    const data = JSON.stringify(tools, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devtools-registry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!session) {
      signIn();
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedTools = JSON.parse(content);

        for (const tool of importedTools) {
          await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tool),
          });
        }

        await loadTools();
        alert('インポートしました');
      } catch (error) {
        console.error('Import failed:', error);
        alert('インポートに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">DevTools Registry</h1>
            <p className="text-gray-600 dark:text-gray-400">開発環境・ツールの記録帳</p>
          </div>
          <div className="flex items-center gap-3">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ツール名、カテゴリ、OS、タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {session && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  ツール追加
                </button>

                <button
                  onClick={handleExport}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download size={20} />
                  エクスポート
                </button>

                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <Upload size={20} />
                  インポート
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg">
              {searchQuery ? '該当するツールが見つかりません' : 'ツールが登録されていません'}
            </p>
            {!searchQuery && session && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                最初のツールを追加する
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-xl font-semibold mb-1 hover:text-blue-600 dark:hover:text-blue-400 block"
                    >
                      {tool.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tool.category}</p>
                  </div>
                  <div className="flex gap-1">
                    {tool.officialSite && (
                      <a
                        href={tool.officialSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {tool.githubUrl && (
                      <a
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {tool.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 overflow-hidden">
                  <MarkdownContent content={tool.description} />
                </div>

                <div className="mb-4 space-y-1">
                  {tool.installations.map((inst, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="font-medium">{inst.os}</span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-500 dark:text-gray-400">{inst.installMethod}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex-1 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    詳細
                  </Link>
                  {session && (
                    <>
                      <button
                        onClick={() => handleEditTool(tool)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {isModalOpen && (
        <ToolModal
          tool={editingTool}
          onSave={handleSaveTool}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTool(null);
          }}
        />
      )}

      {detailTool && (
        <ToolDetailModal
          tool={detailTool}
          onClose={() => setDetailTool(null)}
          onEdit={(tool) => {
            setDetailTool(null);
            handleEditTool(tool);
          }}
        />
      )}
    </main>
  );
}