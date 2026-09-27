import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Smartphone, Check, Sparkles, Download, WifiOff, Layout, Sliders } from 'lucide-react';

export const PwaSettingsTab: React.FC = () => {
  const { pwaSettings, updatePwaSettings } = useAdmin();
  const [form, setForm] = useState(pwaSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePwaSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const manifestJson = {
    name: form.appName,
    short_name: form.shortName,
    description: form.description,
    start_url: '/',
    display: form.displayMode,
    theme_color: form.themeColor,
    background_color: form.backgroundColor,
    icons: [
      { src: '/rovela-icon.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/rovela-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              PWA (Progressive Web App) & Offline Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure mobile home-screen install criteria, offline cache fallback strategies, window display frames,
            and Web App Manifest generation.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'PWA Settings Saved!' : 'Save PWA Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Manifest & Install Parameters */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Smartphone className="w-4 h-4 text-purple-400" />
            Web App Manifest Parameters
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Application Name</label>
              <input
                type="text"
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Short Name (Home Screen)</label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">App Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Theme Color (Status Bar)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.themeColor}
                  onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={form.themeColor}
                  onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Splash Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.backgroundColor}
                  onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={form.backgroundColor}
                  onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Display Mode Window Frame</label>
            <select
              value={form.displayMode}
              onChange={(e) => setForm({ ...form, displayMode: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="standalone">Standalone (Native App Feel, no browser chrome)</option>
              <option value="fullscreen">Fullscreen (Immersive games and calls)</option>
              <option value="minimal-ui">Minimal UI (Simplified browser buttons)</option>
              <option value="browser">Browser (Standard tab view)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Auto-Prompt Install Banner</span>
              <span className="text-[11px] text-slate-400">Shows "Add to Home Screen" on first user visit</span>
            </div>
            <input
              type="checkbox"
              checked={form.installPromptEnabled}
              onChange={(e) => setForm({ ...form, installPromptEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Offline Cache & Manifest JSON */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <WifiOff className="w-4 h-4 text-purple-400" />
            Offline Service Worker & Manifest JSON
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Service Worker Cache Strategy
            </label>
            <select
              value={form.cacheStrategy}
              onChange={(e) => setForm({ ...form, cacheStrategy: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="stale-while-revalidate">Stale-While-Revalidate (Instant cached load + background sync)</option>
              <option value="network-first">Network First (Fresh real-time data priority)</option>
              <option value="cache-first">Cache First (Ultra fast, lower server bandwidth)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Offline Fallback Notice</label>
            <input
              type="text"
              value={form.offlineMessage}
              onChange={(e) => setForm({ ...form, offlineMessage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Generated manifest.webmanifest */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Generated manifest.json Output</label>
              <span className="text-[10.5px] font-mono text-purple-400">Live JSON</span>
            </div>
            <pre className="p-3 rounded-xl bg-[#0A0713] border border-white/10 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-56">
              {JSON.stringify(manifestJson, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </form>
  );
};
