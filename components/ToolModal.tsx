'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Tool, Installation, Command } from '@/types/tool';

interface ToolModalProps {
  tool: Tool | null;
  onSave: (tool: Tool) => void;
  onClose: () => void;
}

export default function ToolModal({ tool, onSave, onClose }: ToolModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [officialSite, setOfficialSite] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [usageTips, setUsageTips] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setCategory(tool.category);
      setTags(tool.tags.join(', '));
      setOfficialSite(tool.officialSite || '');
      setGithubUrl(tool.githubUrl || '');
      setDescription(tool.description);
      setInstallations(tool.installations);
      setCommands(tool.usage.commonCommands);
      setUsageTips(tool.usage.tips);
      setNotes(tool.notes);
    }
  }, [tool]);

  const addInstallation = () => {
    setInstallations([
      ...installations,
      {
        id: Date.now().toString(),
        os: '',
        installMethod: '',
        commands: '',
        configFiles: '',
        configNotes: '',
        installedAt: new Date().toISOString().split('T')[0],
        notes: ''
      }
    ]);
  };

  const updateInstallation = (index: number, field: keyof Installation, value: string) => {
    const updated = [...installations];
    updated[index] = { ...updated[index], [field]: value };
    setInstallations(updated);
  };

  const removeInstallation = (index: number) => {
    setInstallations(installations.filter((_, i) => i !== index));
  };

  const addCommand = () => {
    setCommands([
      ...commands,
      {
        id: Date.now().toString(),
        command: '',
        description: ''
      }
    ]);
  };

  const updateCommand = (index: number, field: keyof Command, value: string) => {
    const updated = [...commands];
    updated[index] = { ...updated[index], [field]: value };
    setCommands(updated);
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTool: Tool = {
      id: tool?.id || Date.now().toString(),
      name,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      officialSite: officialSite || undefined,
      githubUrl: githubUrl || undefined,
      description,
      installations,
      usage: {
        commonCommands: commands,
        tips: usageTips
      },
      notes,
      createdAt: tool?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newTool);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">
            {tool ? 'ツール編集' : 'ツール追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本情報</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                ツール名 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  カテゴリ *
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="例: CLI Tool, IDE, Library"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  タグ（カンマ区切り）
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="例: Rust, Search, Performance"
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  公式サイト
                </label>
                <input
                  type="url"
                  value={officialSite}
                  onChange={(e) => setOfficialSite(e.target.value)}
                  placeholder="https://..."
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                概要・用途 *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="textarea"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">インストール情報</h3>
              <button
                type="button"
                onClick={addInstallation}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                OS追加
              </button>
            </div>

            {installations.map((inst, idx) => (
              <div key={inst.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">OS #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeInstallation(idx)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      OS/Distribution *
                    </label>
                    <input
                      type="text"
                      value={inst.os}
                      onChange={(e) => updateInstallation(idx, 'os', e.target.value)}
                      placeholder="例: Ubuntu 22.04"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      インストール方法 *
                    </label>
                    <input
                      type="text"
                      value={inst.installMethod}
                      onChange={(e) => updateInstallation(idx, 'installMethod', e.target.value)}
                      placeholder="例: apt, brew, cargo"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    インストールコマンド *
                  </label>
                  <textarea
                    value={inst.commands}
                    onChange={(e) => updateInstallation(idx, 'commands', e.target.value)}
                    rows={3}
                    placeholder="$ sudo apt install ripgrep"
                    className="textarea"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    設定ファイルパス
                  </label>
                  <input
                    type="text"
                    value={inst.configFiles || ''}
                    onChange={(e) => updateInstallation(idx, 'configFiles', e.target.value)}
                    placeholder="例: ~/.config/ripgrep/config"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    設定方法
                  </label>
                  <textarea
                    value={inst.configNotes || ''}
                    onChange={(e) => updateInstallation(idx, 'configNotes', e.target.value)}
                    rows={2}
                    className="textarea"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    備考
                  </label>
                  <textarea
                    value={inst.notes || ''}
                    onChange={(e) => updateInstallation(idx, 'notes', e.target.value)}
                    rows={2}
                    className="textarea"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">使い方</h3>
              <button
                type="button"
                onClick={addCommand}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                コマンド追加
              </button>
            </div>

            {commands.map((cmd, idx) => (
              <div key={cmd.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">コマンド #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCommand(idx)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    コマンド
                  </label>
                  <input
                    type="text"
                    value={cmd.command}
                    onChange={(e) => updateCommand(idx, 'command', e.target.value)}
                    placeholder="$ rg 'pattern' --type rust"
                    className="input font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    説明
                  </label>
                  <input
                    type="text"
                    value={cmd.description}
                    onChange={(e) => updateCommand(idx, 'description', e.target.value)}
                    placeholder="Rustファイルのみ検索"
                    className="input"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                Tips・小ネタ
              </label>
              <textarea
                value={usageTips}
                onChange={(e) => setUsageTips(e.target.value)}
                rows={4}
                placeholder="便利な使い方やハマりポイントなど"
                className="textarea"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              メモ
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="textarea"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary">
              キャンセル
            </button>
            <button type="submit" className="btn-primary">
              {tool ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
