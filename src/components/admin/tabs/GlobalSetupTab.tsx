import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  Palette,
  DollarSign,
  Image,
  Clock,
  Check,
  Sparkles,
  Sliders,
  Globe,
  Upload,
  RefreshCw,
} from 'lucide-react';

export const GlobalSetupTab: React.FC = () => {
  const { globalSettings, updateGlobalSettings } = useAdmin();
  const [form, setForm] = useState(globalSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const presetColors = [
    { name: 'Rovela Electric Violet', primary: '#7C3AED', glow: '#A855F7' },
    { name: 'Cyber Neon Cyan', primary: '#0284C7', glow: '#38BDF8' },
    { name: 'Aurora Emerald', primary: '#059669', glow: '#34D399' },
    { name: 'Sunset Crimson', primary: '#E11D48', glow: '#FB7185' },
    { name: 'Royal Gold', primary: '#D97706', glow: '#FBBF24' },
    { name: 'Deep Space Indigo', primary: '#4F46E5', glow: '#818CF8' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Global Platform Setup & Brand Customization
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure site currency, brand typography, logo & favicon assets, timezones, and dynamic liquid-glass
            accent styling that propagates across the entire application shell.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save Global Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Branding & Identity */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Image className="w-4 h-4 text-purple-400" />
            Site Identity & Media Assets
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Site Name</label>
            <input
              type="text"
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Rovela"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Tagline</label>
            <input
              type="text"
              value={form.siteTagline}
              onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Liquid-Glass Human Connections"
            />
          </div>

          {/* Logo & Favicon with Live Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Logo URL</label>
              <input
                type="text"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                placeholder="/rovela-icon.png"
              />
              <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <img
                  src={form.logoUrl}
                  alt="Logo preview"
                  className="w-10 h-10 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/rovela-icon.png';
                  }}
                />
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-white block">Current Logo</span>
                  Transparent PNG / SVG
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Favicon URL</label>
              <input
                type="text"
                value={form.faviconUrl}
                onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                placeholder="/favicon.png"
              />
              <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <img
                  src={form.faviconUrl}
                  alt="Favicon preview"
                  className="w-8 h-8 object-contain rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/favicon.png';
                  }}
                />
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-white block">Browser Tab Icon</span>
                  32x32 / 64x64 ico/png
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Currency & Timezone Settings */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Currency & Timezone Settings
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Currency Code</label>
              <select
                value={form.currencyCode}
                onChange={(e) => {
                  const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', NGN: '₦', CAD: 'CA$', JPY: '¥' };
                  setForm({
                    ...form,
                    currencyCode: e.target.value,
                    currencySymbol: map[e.target.value] || '$',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="NGN">NGN - Nigerian Naira (₦)</option>
                <option value="CAD">CAD - Canadian Dollar ($)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="$"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Symbol Position</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  form.currencyPosition === 'prefix'
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="currencyPosition"
                  checked={form.currencyPosition === 'prefix'}
                  onChange={() => setForm({ ...form, currencyPosition: 'prefix' })}
                  className="hidden"
                />
                <span>Prefix (e.g. $100.00)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  form.currencyPosition === 'suffix'
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="currencyPosition"
                  checked={form.currencyPosition === 'suffix'}
                  onChange={() => setForm({ ...form, currencyPosition: 'suffix' })}
                  className="hidden"
                />
                <span>Suffix (e.g. 100.00 $)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Timezone</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
              <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
              <option value="Europe/Paris (UTC+1)">Europe/Paris (UTC+1)</option>
              <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1)</option>
              <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
              <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
              <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
            </select>
          </div>
        </div>

        {/* 3. Site Color & Liquid-Glass Theme Engine */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Palette className="w-4 h-4 text-purple-400" />
            Site Color Engine & Liquid-Glass Palette
          </h4>

          {/* Quick Preset Theme Palettes */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">Preset Color Harmonies</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {presetColors.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setForm({ ...form, primaryColor: palette.primary, glowColor: palette.glow })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    form.primaryColor === palette.primary
                      ? 'border-purple-400 bg-purple-500/20 ring-1 ring-purple-400'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: palette.primary }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: palette.glow }} />
                  </div>
                  <span className="text-[11px] font-bold text-white block truncate">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hex Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Glow Accent Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.glowColor}
                  onChange={(e) => setForm({ ...form, glowColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={form.glowColor}
                  onChange={(e) => setForm({ ...form, glowColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Glass Blur Radius ({form.surfaceGlassBlur}px)
              </label>
              <input
                type="range"
                min="8"
                max="40"
                value={form.surfaceGlassBlur}
                onChange={(e) => setForm({ ...form, surfaceGlassBlur: Number(e.target.value) })}
                className="w-full accent-purple-500 mt-2"
              />
            </div>
          </div>

          {/* Real-time Theme Preview Card */}
          <div className="p-4 rounded-2xl border border-white/10 relative overflow-hidden" style={{ background: '#0D0B12' }}>
            <div
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: form.primaryColor }}
            />
            <div
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: form.glowColor }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Live Liquid-Glass Preview</h5>
                  <p className="text-xs text-slate-300">
                    Showing primary {form.primaryColor} with glow {form.glowColor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md"
                  style={{
                    backgroundColor: form.primaryColor,
                    boxShadow: `0 4px 16px ${form.glowColor}50`,
                  }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
