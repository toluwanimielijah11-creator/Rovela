import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Code, Check, Sparkles, ShieldAlert, FileCode2 } from 'lucide-react';

export const CustomScriptsTab: React.FC = () => {
  const { customScripts, updateCustomScripts } = useAdmin();
  const [form, setForm] = useState(customScripts);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomScripts(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const insertSnippet = (field: 'headerScript' | 'bodyScript' | 'footerScript', snippet: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n\n${snippet}` : snippet,
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">Custom JavaScript & Script Injection</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Inject third-party analytics (Google Tag Manager, Meta Pixel, Hotjar), support chat widgets, or custom CSS
            styling safely into the document Header (&lt;head&gt;), Body start (&lt;body&gt;), and Footer.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Scripts Saved!' : 'Save Custom Scripts'}</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Header Scripts */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                Header Scripts (&lt;head&gt;)
              </h4>
              <p className="text-xs text-slate-400">
                Executed in the &lt;head&gt; before page rendering. Ideal for Analytics, Web Fonts, and Meta trackers.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                insertSnippet(
                  'headerScript',
                  `<!-- Google Analytics 4 -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXX');\n</script>`
                )
              }
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              + Insert GA4 Snippet
            </button>
          </div>
          <textarea
            rows={5}
            value={form.headerScript}
            onChange={(e) => setForm({ ...form, headerScript: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-[#090710] border border-white/10 font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500 resize-none"
            placeholder="<script>/* Header Javascript */</script>"
          />
        </div>

        {/* Body Scripts */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                Body Start Scripts (&lt;body&gt;)
              </h4>
              <p className="text-xs text-slate-400">
                Injected immediately after the opening &lt;body&gt; tag. Ideal for noscript pixels and splash handlers.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                insertSnippet(
                  'bodyScript',
                  `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
                )
              }
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              + Insert GTM Noscript
            </button>
          </div>
          <textarea
            rows={4}
            value={form.bodyScript}
            onChange={(e) => setForm({ ...form, bodyScript: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-[#090710] border border-white/10 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="<noscript>/* Body Tag */</noscript>"
          />
        </div>

        {/* Footer Scripts */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                Footer Scripts (Before &lt;/body&gt;)
              </h4>
              <p className="text-xs text-slate-400">
                Executed after DOM content is fully loaded. Ideal for external chat widgets, surveys, and defer scripts.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                insertSnippet(
                  'footerScript',
                  `<!-- Custom Live Support Widget -->\n<script>\n  window.addEventListener('load', function() {\n    console.log('Rovela Liquid Glass client initialized.');\n  });\n</script>`
                )
              }
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              + Insert Client Hook
            </button>
          </div>
          <textarea
            rows={5}
            value={form.footerScript}
            onChange={(e) => setForm({ ...form, footerScript: e.target.value })}
            className="w-full p-3.5 rounded-xl bg-[#090710] border border-white/10 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="<script>/* Footer Scripts */</script>"
          />
        </div>
      </div>
    </form>
  );
};
