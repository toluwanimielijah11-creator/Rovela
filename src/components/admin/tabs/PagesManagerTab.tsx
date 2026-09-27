import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Eye,
  X,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { SitePageItem } from '../../../types/admin';

export const PagesManagerTab: React.FC = () => {
  const { sitePages, addSitePage, updateSitePage, deleteSitePage } = useAdmin();
  const [selectedPage, setSelectedPage] = useState<SitePageItem | null>(sitePages[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(false);

  // New Page State
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '# New Page\n\nWrite content here...',
    status: 'published' as const,
    metaTitle: '',
    metaDescription: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title.trim() || !newPage.slug.trim()) return;
    addSitePage(newPage);
    setNewPage({
      title: '',
      slug: '',
      content: '# New Page\n\nWrite content here...',
      status: 'published',
      metaTitle: '',
      metaDescription: '',
    });
    setShowAddModal(false);
  };

  const handleSaveSelected = () => {
    if (!selectedPage) return;
    updateSitePage(selectedPage.id, selectedPage);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Site Pages & Dynamic Content CMS
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Author and publish static and dynamic informational pages (Privacy Policy, Terms of Service, About Rovela,
            Security Audits) with instant markdown preview rendering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Page</span>
          </button>

          {selectedPage && (
            <button
              type="button"
              onClick={handleSaveSelected}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'Page Saved!' : 'Save Changes'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pages Directory (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white">Site Pages Directory</h4>
            <span className="text-xs text-purple-300 font-mono">{sitePages.length} pages</span>
          </div>

          <div className="space-y-2">
            {sitePages.map((page) => (
              <div
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  selectedPage?.id === page.id
                    ? 'bg-purple-600/20 border-purple-500 shadow-md'
                    : 'bg-[#0F0B1A] border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      {page.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        page.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-400 mt-0.5 block">/{page.slug}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSitePage(page.id);
                      if (selectedPage?.id === page.id) {
                        setSelectedPage(sitePages.find((p) => p.id !== page.id) || null);
                      }
                    }}
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rich Content Editor & Preview (8 cols) */}
        {selectedPage ? (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={selectedPage.title}
                  onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-xs font-mono text-purple-300">/{selectedPage.slug}</span>
              </div>

              {/* Preview Mode Selector */}
              <div className="flex items-center gap-1 bg-[#0F0B1A] p-1 rounded-xl border border-white/10 text-xs">
                {(['split', 'edit', 'preview'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={`px-3 py-1 rounded-lg capitalize cursor-pointer font-semibold transition-all ${
                      previewMode === mode ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Metadata Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Slug URL</label>
                <input
                  type="text"
                  value={selectedPage.slug}
                  onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Publication Status</label>
                <select
                  value={selectedPage.status}
                  onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-xs text-white"
                >
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Admin Only)</option>
                </select>
              </div>
            </div>

            {/* Content Editor / Preview */}
            <div
              className={`grid gap-4 ${
                previewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {/* Textarea Editor */}
              {previewMode !== 'preview' && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Markdown / HTML Content
                  </span>
                  <textarea
                    rows={14}
                    value={selectedPage.content}
                    onChange={(e) => setSelectedPage({ ...selectedPage, content: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#080611] border border-white/10 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Live Preview Pane */}
              {previewMode !== 'edit' && (
                <div>
                  <span className="text-[11px] font-semibold text-purple-300 block mb-1">
                    Live HTML Render Preview
                  </span>
                  <div className="p-4 rounded-xl bg-[#080611] border border-purple-500/20 text-xs text-slate-300 space-y-2 h-[340px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    <h3 className="text-base font-extrabold text-white">{selectedPage.title}</h3>
                    <div className="text-slate-300">{selectedPage.content}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 text-center text-slate-400">
            Select a page from the directory or create a new one.
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add New Site Page
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '');
                    setNewPage({ ...newPage, title, slug });
                  }}
                  placeholder="e.g. Compliance Whitepaper"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">URL Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500 font-mono">/</span>
                  <input
                    type="text"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    placeholder="compliance"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Content</label>
                <textarea
                  rows={4}
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                />
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
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
