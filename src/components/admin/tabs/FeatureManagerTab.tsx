import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  Shield,
  MessageSquare,
  Video,
  DollarSign,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { SiteFeatureItem } from '../../../types/admin';

export const FeatureManagerTab: React.FC = () => {
  const { features, toggleFeature } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFeatures = features.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const enabledCount = features.filter((f) => f.enabled).length;
  const disabledCount = features.filter((f) => !f.enabled).length;

  const getCategoryIcon = (category: SiteFeatureItem['category']) => {
    switch (category) {
      case 'communication':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'media':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'monetization':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">Platform Feature Manager</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              Live Hot-Swapping
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Control which modules are accessible across client browsers in real time. Toggling off a feature instantly
            deactivates its user-facing routes, menus, and interaction buttons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{enabledCount} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <XCircle className="w-4 h-4" />
            <span>{disabledCount} Disabled</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search features by name, id, or description..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#140F24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'communication', label: 'Calls & Chats' },
            { id: 'security', label: 'Security' },
            { id: 'core', label: 'Core Platform' },
            { id: 'monetization', label: 'Monetization' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'bg-[#140F24] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              feature.enabled
                ? 'bg-[#140F24]/90 border-purple-500/30 shadow-[0_4px_20px_rgba(124,58,237,0.08)]'
                : 'bg-[#100C1C]/60 border-white/5 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      feature.enabled ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {getCategoryIcon(feature.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      {feature.name}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-normal">
                        {feature.category}
                      </span>
                    </h4>
                    <span className="text-[10.5px] font-mono text-purple-400/80">id: {feature.id}</span>
                  </div>
                </div>

                {/* Big Toggle Switch Button */}
                <button
                  type="button"
                  onClick={() => toggleFeature(feature.id, !feature.enabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    feature.enabled
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400/30'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                  aria-label={`Toggle ${feature.name}`}
                >
                  {feature.enabled ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-300" />
                      <span>ENABLED</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                      <span>DISABLED</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{feature.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${feature.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                Status: {feature.enabled ? 'Operational (Client active)' : 'Turned OFF'}
              </span>
              <button
                type="button"
                onClick={() => toggleFeature(feature.id, !feature.enabled)}
                className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline text-[11px]"
              >
                {feature.enabled ? 'Click to Disable' : 'Click to Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-[#140F24] border border-white/10 text-slate-400 text-sm">
          No features found matching "{search}".
        </div>
      )}
    </div>
  );
};
