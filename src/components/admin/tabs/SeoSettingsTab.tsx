import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  Search,
  FileCode,
  Globe,
  Sparkles,
  Check,
  Download,
  Copy,
  Share2,
  FileText,
} from 'lucide-react';

export const SeoSettingsTab: React.FC = () => {
  const { seoSettings, updateSeoSettings, generateSitemap, generateRobotsTxt } = useAdmin();
  const [form, setForm] = useState(seoSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [activeViewer, setActiveViewer] = useState<'none' | 'sitemap' | 'robots'>('none');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const handleGenerateSitemap = () => {
    const sitemap = generateSitemap();
    setForm((prev) => ({ ...prev, sitemapXml: sitemap }));
    setActiveViewer('sitemap');
  };

  const handleGenerateRobots = () => {
    const robots = generateRobotsTxt();
    setForm((prev) => ({ ...prev, robotsTxt: robots }));
    setActiveViewer('robots');
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">SEO, Meta & Crawler Infrastructure</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure OpenGraph social cards, search engine indexes, and dynamically generate standard-compliant XML
            Sitemaps and Robots.txt directives.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'SEO Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta Tags Configuration */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Search className="w-4 h-4 text-purple-400" />
            Global Meta Tags & Search Indexing
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="Rovela — Next-Generation Liquid Glass Communication"
              required
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Recommended: 50–60 characters ({form.metaTitle.length} characters)
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Experience fluid voice, video, stories, and encrypted real-time messaging with crystal clarity."
              required
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Recommended: 120–160 characters ({form.metaDescription.length} characters)
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              value={form.metaKeywords}
              onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              placeholder="messaging, encrypted chat, video calls, rovela, voice notes"
            />
          </div>

          {/* Social Share Card Image (OG Image) */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Social Card Image (OpenGraph Image URL)
            </label>
            <input
              type="text"
              value={form.metaImage}
              onChange={(e) => setForm({ ...form, metaImage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              placeholder="https://..."
            />
            <div className="mt-2 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <img
                src={form.metaImage}
                alt="OG Preview"
                className="w-16 h-10 object-cover rounded-lg border border-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/rovela-icon.png';
                }}
              />
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-white block">Preview Social Banner</span>
                Recommended: 1200 × 630px
              </div>
            </div>
          </div>
        </div>

        {/* Google & Crawler Generators: Sitemap & Robots.txt */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <FileCode className="w-4 h-4 text-purple-400" />
            Sitemap & Search Engine Directives
          </h4>

          {/* Generator Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGenerateSitemap}
              className="p-3.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                Generate Sitemap (XML)
              </span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              type="button"
              onClick={handleGenerateRobots}
              className="p-3.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Generate Robots.txt
              </span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>

          {/* Editable Robots.txt Directive */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Robots.txt Settings Content</label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleCopy(form.robotsTxt, 'robots')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'robots' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'robots' ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(form.robotsTxt, 'robots.txt', 'text/plain')}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <textarea
              rows={5}
              value={form.robotsTxt}
              onChange={(e) => setForm({ ...form, robotsTxt: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0A0713] border border-white/10 text-xs font-mono text-emerald-300 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Sitemap.xml Output */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Sitemap XML Content</label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleCopy(form.sitemapXml, 'sitemap')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'sitemap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'sitemap' ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(form.sitemapXml, 'sitemap.xml', 'application/xml')}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <textarea
              rows={6}
              value={form.sitemapXml}
              onChange={(e) => setForm({ ...form, sitemapXml: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0A0713] border border-white/10 text-[11px] font-mono text-purple-300 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
