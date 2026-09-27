import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Languages, Plus, Trash2, Edit2, Search, Check, Sparkles, Globe, X } from 'lucide-react';
import { LanguageKeyword } from '../../../types/admin';

export const LanguagesTab: React.FC = () => {
  const { languages, languageKeywords, addLanguageKeyword, updateLanguageKeyword, deleteLanguageKeyword } = useAdmin();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Keyword Form
  const [newKey, setNewKey] = useState({
    key: '',
    en: '',
    es: '',
    fr: '',
    de: '',
    ar: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.key.trim() || !newKey.en.trim()) return;
    addLanguageKeyword(newKey);
    setNewKey({ key: '', en: '', es: '', fr: '', de: '', ar: '' });
    setShowAddModal(false);
  };

  const filteredKeywords = languageKeywords.filter(
    (kw) =>
      kw.key.toLowerCase().includes(search.toLowerCase()) ||
      kw.en.toLowerCase().includes(search.toLowerCase()) ||
      kw.es.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Localization, Translation & Language Keywords
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Manage multilingual string dictionaries and translation keys. Edit labels in real time across English,
            Spanish, French, German, and Arabic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Language Key</span>
        </button>
      </div>

      {/* Language Badges Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className="p-3.5 rounded-xl bg-[#140F24] border border-white/10 flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">{lang.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {lang.nativeName} ({lang.code.toUpperCase()})
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                lang.isDefault ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400'
              }`}
            >
              {lang.isDefault ? 'Default' : lang.direction.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Keywords Table Header & Search */}
      <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword strings or translations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredKeywords.length} of {languageKeywords.length} keywords
          </span>
        </div>

        {/* Translation Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-semibold">Key Identifier</th>
                <th className="pb-3 font-semibold">English (EN)</th>
                <th className="pb-3 font-semibold">Spanish (ES)</th>
                <th className="pb-3 font-semibold">French (FR)</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredKeywords.map((kw) => (
                <tr key={kw.id} className="text-slate-300 group hover:bg-white/[0.02]">
                  <td className="py-3 font-mono text-[11px] text-purple-300">{kw.key}</td>
                  <td className="py-3 text-white font-medium">
                    {editingId === kw.id ? (
                      <input
                        type="text"
                        defaultValue={kw.en}
                        onBlur={(e) => updateLanguageKeyword(kw.id, { en: e.target.value })}
                        className="px-2 py-1 rounded bg-[#0A0713] border border-purple-500 text-xs text-white w-full"
                      />
                    ) : (
                      kw.en
                    )}
                  </td>
                  <td className="py-3 text-slate-300">
                    {editingId === kw.id ? (
                      <input
                        type="text"
                        defaultValue={kw.es}
                        onBlur={(e) => updateLanguageKeyword(kw.id, { es: e.target.value })}
                        className="px-2 py-1 rounded bg-[#0A0713] border border-purple-500 text-xs text-white w-full"
                      />
                    ) : (
                      kw.es || '—'
                    )}
                  </td>
                  <td className="py-3 text-slate-300">
                    {editingId === kw.id ? (
                      <input
                        type="text"
                        defaultValue={kw.fr}
                        onBlur={(e) => updateLanguageKeyword(kw.id, { fr: e.target.value })}
                        className="px-2 py-1 rounded bg-[#0A0713] border border-purple-500 text-xs text-white w-full"
                      />
                    ) : (
                      kw.fr || '—'
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(editingId === kw.id ? null : kw.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                        title={editingId === kw.id ? 'Done' : 'Inline Edit'}
                      >
                        {editingId === kw.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Edit2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLanguageKeyword(kw.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                        title="Delete Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Keyword Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add Language Keyword & Values
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Key Identifier (dot.notation)
                </label>
                <input
                  type="text"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="e.g. auth.login_button"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">English Value (Default)</label>
                <input
                  type="text"
                  value={newKey.en}
                  onChange={(e) => setNewKey({ ...newKey, en: e.target.value })}
                  placeholder="e.g. Sign In to Rovela"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Spanish (ES)</label>
                  <input
                    type="text"
                    value={newKey.es}
                    onChange={(e) => setNewKey({ ...newKey, es: e.target.value })}
                    placeholder="e.g. Iniciar Sesión"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">French (FR)</label>
                  <input
                    type="text"
                    value={newKey.fr}
                    onChange={(e) => setNewKey({ ...newKey, fr: e.target.value })}
                    placeholder="e.g. Se Connecter"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">German (DE)</label>
                  <input
                    type="text"
                    value={newKey.de}
                    onChange={(e) => setNewKey({ ...newKey, de: e.target.value })}
                    placeholder="e.g. Anmelden"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Arabic (AR)</label>
                  <input
                    type="text"
                    value={newKey.ar}
                    onChange={(e) => setNewKey({ ...newKey, ar: e.target.value })}
                    placeholder="e.g. تسجيل الدخول"
                    dir="rtl"
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
