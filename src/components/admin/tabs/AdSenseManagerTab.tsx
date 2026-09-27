import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { DollarSign, Check, Sparkles, Layout, ToggleLeft, ToggleRight, AlertCircle, Eye } from 'lucide-react';

export const AdSenseManagerTab: React.FC = () => {
  const { adSense, updateAdSense } = useAdmin();
  const [form, setForm] = useState(adSense);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdSense(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Google AdSense & Monetization Suite
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Monetize non-intrusive container slots with Google AdSense. Auto-ads and targeted responsive display ad units
            blend seamlessly with Rovela's liquid-glass design.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'AdSense Saved!' : 'Save Monetization'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AdSense Configuration */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
            <span>Publisher Account Credentials</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, enabled: !form.enabled })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                form.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}
            >
              {form.enabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
              <span>{form.enabled ? 'AdSense Active' : 'AdSense Disabled'}</span>
            </button>
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Google AdSense Publisher ID (ca-pub-xxx)
            </label>
            <input
              type="text"
              value={form.publisherId}
              onChange={(e) => setForm({ ...form, publisherId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              placeholder="pub-9482018471928491"
              required
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Found under Google AdSense &gt; Account &gt; Settings &gt; Publisher ID
            </span>
          </div>

          {/* Auto Ads Toggle */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Google Auto Ads Optimization</span>
              <span className="text-[11px] text-slate-400">
                Allows Google to dynamically place ads in optimal positions using AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, autoAds: !form.autoAds })}
              className="cursor-pointer"
            >
              {form.autoAds ? (
                <ToggleRight className="w-6 h-6 text-purple-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-500" />
              )}
            </button>
          </div>

          {/* Slot Placements */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">Dedicated Placement Slots</span>
            <div className="space-y-2.5">
              {[
                { id: 'headerBanner', label: 'Top Navigation Header Banner', size: '728 × 90 Leaderboard' },
                { id: 'sidebarSlot', label: 'Left Rail / Sidebar Ad Slot', size: '300 × 250 Medium Rectangle' },
                { id: 'chatDrawer', label: 'Chat Info Drawer Ad Slot', size: 'Responsive Liquid Box' },
                { id: 'footerBanner', label: 'Global Footer Banner', size: '970 × 90 Large Leaderboard' },
              ].map((slot) => {
                const isSlotActive = (form.slots as any)[slot.id];
                return (
                  <label
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSlotActive
                        ? 'bg-purple-600/15 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block">{slot.label}</span>
                      <span className="text-[10.5px] text-slate-400">{slot.size}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSlotActive}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          slots: { ...form.slots, [slot.id]: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Ad Slot Visual Mock */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <Eye className="w-4 h-4 text-purple-400" />
              Live Ad Preview & Compliance
            </h4>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs mb-4 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Ads are restricted from interfering with active voice/video calls and encrypted message bubbles to
                maintain an executive user experience.
              </span>
            </div>

            {/* Ad Unit Mock Container */}
            <div className="p-4 rounded-2xl border border-dashed border-purple-500/40 bg-purple-950/20 text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300/70 block">
                Google AdSense Preview Unit ({form.enabled ? 'Live Slot' : 'Inactive Slot'})
              </span>
              <div className="h-28 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-slate-400">
                <DollarSign className="w-6 h-6 text-amber-400/80 mb-1" />
                <span className="text-xs font-semibold text-white">Rovela Sponsored Partner</span>
                <span className="text-[10px] text-slate-400 font-mono">ca-pub-{form.publisherId.slice(-8)}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Targeted display unit rendered with frosted liquid-glass border
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>Estimated eCPM: $2.40 - $4.80</span>
            <span className="text-emerald-400 font-bold">Policy Approved</span>
          </div>
        </div>
      </div>
    </form>
  );
};
