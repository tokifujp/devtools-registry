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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [officialSite, setOfficialSite] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [commonCommands, setCommonCommands] = useState<Command[]>([]);
  const [tips, setTips] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setCategory(tool.category);
      setTags(tool.tags);
      setOfficialSite(tool.officialSite || '');
      setGithubUrl(tool.githubUrl || '');
      setDescription(tool.description);
      setInstallations(tool.installations);
      setCommonCommands(tool.usage.commonCommands);
      setTips(tool.usage.tips);
      setNotes(tool.notes);
    }
  }, [tool]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddInstallation = () => {
    setInstallations([
      ...installations,
      {
        id: Date.now().toString(),
        os: '',
        installMethod: '',
        commands: '',
        configFiles: '',
        configNotes: '',
        installedAt: '',
        notes: '',
      },
    ]);
  };

  const handleRemoveInstallation = (index: number) => {
    setInstallations(installations.filter((_, i) => i !== index));
  };

  const handleUpdateInstallation = (index: number, field: keyof Installation, value: string) => {
    const updated = [...installations];
    updated[index] = { ...updated[index], [field]: value };
    setInstallations(updated);
  };

  const handleAddCommand = () => {
    setCommonCommands([
      ...commonCommands,
      {
        id: Date.now().toString(),
        command: '',
        description: '',
      },
    ]);
  };

  const handleRemoveCommand = (index: number) => {
    setCommonCommands(commonCommands.filter((_, i) => i !== index));
  };

  const handleUpdateCommand = (index: number, field: keyof Command, value: string) => {
    const updated = [...commonCommands];
    updated[index] = { ...updated[index], [field]: value };
    setCommonCommands(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTool: Tool = {
      id: tool?.id || Date.now().toString(),
      slug: tool?.slug || '',
      name,
      category,
      tags,
      officialSite,
      githubUrl,
      description,
      installations,
      usage: {
        commonCommands,
        tips,
      },
      notes,
      createdAt: tool?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newTool);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{tool ? 'ツール編集' : 'ツール追加'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">ツール名 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">カテゴリ *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
                placeholder="CLI Tool, Library, etc."
                required
              />
            </div>
          </div>

          <div>
            <label className="label">タグ</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="input flex-1"
                placeholder="タグを入力してEnter"
              />
              <button type="button" onClick={handleAddTag} className="btn-secondary">
                追加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(idx)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">公式サイト</label>
              <input
                type="url"
                value={officialSite}
                onChange={(e) => setOfficialSite(e.target.value)}
                className="input"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="label">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="input"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          <div>
            <label className="label">概要・用途 *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={3}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="label mb-0">インストール情報</label>
              <button type="button" onClick={handleAddInstallation} className="btn-secondary flex items-center gap-2">
                <Plus size={16} />
                追加
              </button>
            </div>

            {installations.map((inst, idx) => (
              <div key={inst.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">インストール #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstallation(idx)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="label text-sm">OS *</label>
                    <input
                      type="text"
                      value={inst.os}
                      onChange={(e) => handleUpdateInstallation(idx, 'os', e.target.value)}
                      className="input text-sm"
                      placeholder="macOS, Ubuntu, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="label text-sm">インストール方法 *</label>
                    <input
                      type="text"
                      value={inst.installMethod}
                      onChange={(e) => handleUpdateInstallation(idx, 'installMethod', e.target.value)}
                      className="input text-sm"
                      placeholder="Homebrew, apt, etc."
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="label text-sm">コマンド *</label>
                  <textarea
                    value={inst.commands}
                    onChange={(e) => handleUpdateInstallation(idx, 'commands', e.target.value)}
                    className="input text-sm font-mono"
                    rows={2}
                    placeholder="brew install tool"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="label text-sm">設定ファイル</label>
                  <input
                    type="text"
                    value={inst.configFiles}
                    onChange={(e) => handleUpdateInstallation(idx, 'configFiles', e.target.value)}
                    className="input text-sm"
                    placeholder="~/.config/tool/config.yml"
                  />
                </div>

                <div className="mb-3">
                  <label className="label text-sm">設定方法</label>
                  <textarea
                    value={inst.configNotes}
                    onChange={(e) => handleUpdateInstallation(idx, 'configNotes', e.target.value)}
                    className="input text-sm"
                    rows={2}
                  />
                </div>

                <div className="mb-3">
                  <label className="label text-sm">備考</label>
                  <textarea
                    value={inst.notes}
                    onChange={(e) => handleUpdateInstallation(idx, 'notes', e.target.value)}
                    className="input text-sm"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="label text-sm">インストール日</label>
                  <input
                    type="date"
                    value={inst.installedAt}
                    onChange={(e) => handleUpdateInstallation(idx, 'installedAt', e.target.value)}
                    className="input text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="label mb-0">よく使うコマンド</label>
              <button type="button" onClick={handleAddCommand} className="btn-secondary flex items-center gap-2">
                <Plus size={16} />
                追加
              </button>
            </div>

            {commonCommands.map((cmd, idx) => (
              <div key={cmd.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">コマンド #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveCommand(idx)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-2">
                  <label className="label text-sm">コマンド</label>
                  <input
                    type="text"
                    value={cmd.command}
                    onChange={(e) => handleUpdateCommand(idx, 'command', e.target.value)}
                    className="input text-sm font-mono"
                    placeholder="tool --flag value"
                  />
                </div>

                <div>
                  <label className="label text-sm">説明</label>
                  <input
                    type="text"
                    value={cmd.description}
                    onChange={(e) => handleUpdateCommand(idx, 'description', e.target.value)}
                    className="input text-sm"
                    placeholder="このコマンドの説明"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="label">Tips・小ネタ</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="input"
              rows={3}
              placeholder="便利な使い方、注意点など"
            />
          </div>

          <div>
            <label className="label">メモ</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              rows={3}
              placeholder="自由メモ"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" className="btn-primary flex-1">
              {tool ? '更新' : '作成'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}