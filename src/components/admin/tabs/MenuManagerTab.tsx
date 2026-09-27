import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Menu, Plus, Trash2, Edit2, Check, Sparkles, X, ExternalLink, ArrowUpDown } from 'lucide-react';
import { MenuItem, FooterColumn } from '../../../types/admin';

export const MenuManagerTab: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    footerCopyright,
    setFooterCopyright,
    footerColumns,
    updateFooterColumns,
  } = useAdmin();

  const [activeLocation, setActiveLocation] = useState<'all' | 'header' | 'footer'>('all');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [copyrightText, setCopyrightText] = useState(footerCopyright);
  const [isSaved, setIsSaved] = useState(false);

  // New Menu Item
  const [newMenu, setNewMenu] = useState<{
    label: string;
    path: string;
    location: 'header' | 'sidebar' | 'footer';
    target: '_self' | '_blank';
    order: number;
  }>({
    label: '',
    path: '/',
    location: 'header',
    target: '_self',
    order: 1,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.label.trim()) return;
    addMenuItem(newMenu);
    setNewMenu({ label: '', path: '/', location: 'header', target: '_self', order: 1 });
    setShowAddMenuModal(false);
  };

  const handleSaveFooter = () => {
    setFooterCopyright(copyrightText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const filteredMenus = menuItems.filter((m) =>
    activeLocation === 'all' ? true : m.location === activeLocation
  );

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Navigation Menu & Footer Layout Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Add, edit, or delete header/footer navigation links and customize multi-column footer structures and
            copyright credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddMenuModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Navigation Menu Items */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Active Navigation Links</h4>
              <p className="text-xs text-slate-400">Header navbar and global routing items</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1">
              {(['all', 'header', 'footer'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setActiveLocation(loc)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeLocation === loc
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className="p-3 rounded-xl bg-[#0F0B1A] border border-white/10 flex items-center justify-between group hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-purple-400">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{menu.label}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 uppercase font-mono">
                        {menu.location}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      {menu.path}
                      {menu.target === '_blank' && <ExternalLink className="w-3 h-3 text-slate-500" />}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteMenuItem(menu.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                    title="Delete Menu Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Footer Layout & Copyright Editor */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white">Footer Layout & Legal</h4>
            <button
              type="button"
              onClick={handleSaveFooter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save Footer'}</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Footer Copyright Notice
            </label>
            <textarea
              rows={3}
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
              placeholder="© 2026 Rovela Inc. All rights reserved."
            />
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-300 block">Footer Link Columns</span>
            {footerColumns.map((col, idx) => (
              <div key={col.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Column {idx + 1}: {col.title}</span>
                  <span className="text-[10px] text-slate-400">{col.links.length} links</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  {col.links.map((link) => (
                    <div key={link.label} className="truncate">• {link.label}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add Navigation Link
              </h4>
              <button
                type="button"
                onClick={() => setShowAddMenuModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Link Title / Label</label>
                <input
                  type="text"
                  value={newMenu.label}
                  onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
                  placeholder="e.g. Security Whitepaper"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target URL / Path</label>
                <input
                  type="text"
                  value={newMenu.path}
                  onChange={(e) => setNewMenu({ ...newMenu, path: e.target.value })}
                  placeholder="e.g. /security or https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Placement Location</label>
                  <select
                    value={newMenu.location}
                    onChange={(e) => setNewMenu({ ...newMenu, location: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="header">Header Navbar</option>
                    <option value="sidebar">Sidebar Rail</option>
                    <option value="footer">Footer Menu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target</label>
                  <select
                    value={newMenu.target}
                    onChange={(e) => setNewMenu({ ...newMenu, target: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="_self">Same Window (_self)</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
