'use client';

import { useState } from 'react';
import { X, Edit, ExternalLink, Github, Copy, Check } from 'lucide-react';
import { Tool } from '@/types/tool';

interface ToolDetailModalProps {
  tool: Tool;
  onClose: () => void;
  onEdit: (tool: Tool) => void;
}

export default function ToolDetailModal({ tool, onClose, onEdit }: ToolDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'install' | 'usage' | 'notes'>('install');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-3xl font-bold mb-2">{tool.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{tool.category}</p>
            </div>
            <div className="flex gap-2 items-start">
              <button
                onClick={() => onEdit(tool)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Edit size={20} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {tool.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 text-sm">
            {tool.officialSite && (
              <a
                href={tool.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <ExternalLink size={16} />
                公式サイト
              </a>
            )}
            {tool.githubUrl && (
              <a
                href={tool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Github size={16} />
                GitHub
              </a>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-4">{tool.description}</p>

          <div className="flex gap-1 mt-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('install')}
              className={`tab ${activeTab === 'install' ? 'tab-active' : ''}`}
            >
              インストール
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`tab ${activeTab === 'usage' ? 'tab-active' : ''}`}
            >
              使い方
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`tab ${activeTab === 'notes' ? 'tab-active' : ''}`}
            >
              メモ
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'install' && (
            <div className="space-y-6">
              {tool.installations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">インストール情報が登録されていません</p>
              ) : (
                tool.installations.map((inst, idx) => (
                  <div key={inst.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold">{inst.os}</h3>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">
                        {inst.installMethod}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">インストールコマンド</h4>
                          <button
                            onClick={() => copyToClipboard(inst.commands, idx * 10)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {copiedIndex === idx * 10 ? (
                              <>
                                <Check size={14} />
                                コピー済み
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                コピー
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          {inst.commands}
                        </pre>
                      </div>

                      {inst.configFiles && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">設定ファイル</h4>
                          <code className="block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded text-sm">
                            {inst.configFiles}
                          </code>
                        </div>
                      )}

                      {inst.configNotes && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">設定方法</h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {inst.configNotes}
                          </div>
                        </div>
                      )}

                      {inst.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">備考</h4>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {inst.notes}
                          </div>
                        </div>
                      )}

                      {inst.installedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          インストール日: {inst.installedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              {tool.usage.commonCommands.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">よく使うコマンド</h3>
                  <div className="space-y-4">
                    {tool.usage.commonCommands.map((cmd, idx) => (
                      <div key={cmd.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{cmd.command}</code>
                          <button
                            onClick={() => copyToClipboard(cmd.command, idx * 10 + 1000)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {copiedIndex === idx * 10 + 1000 ? (
                              <>
                                <Check size={14} />
                                コピー済み
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                コピー
                              </>
                            )}
                          </button>
                        </div>
                        {cmd.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">→ {cmd.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tool.usage.tips && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tips・小ネタ</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {tool.usage.tips}
                  </div>
                </div>
              )}

              {tool.usage.commonCommands.length === 0 && !tool.usage.tips && (
                <p className="text-gray-500 dark:text-gray-400">使い方が登録されていません</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              {tool.notes ? (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {tool.notes}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">メモが登録されていません</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
