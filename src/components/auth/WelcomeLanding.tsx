import React from 'react';
import { RovelaLogo } from '../ui/RovelaLogo';
import { Button } from '../ui/Button';
import { GlassPanel } from '../ui/GlassPanel';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Shield, Sparkles, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WelcomeLandingProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onOpenAuth }) => {
  const { login, switchDemoUser, users } = useChat();

  return (
    <div className="min-h-screen w-full bg-[#0D0B12] text-slate-100 relative overflow-hidden flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      {/* Ambient background light gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-700/20 via-violet-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-tl from-purple-900/20 via-violet-800/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <RovelaLogo size="md" showWordmark showTagline />

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => onOpenAuth('login')}
            className="text-slate-300 hover:text-white"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onOpenAuth('register')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left Column: Value Proposition */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-Gen Real-Time Communication</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-sans">
            Connect. Chat. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Belong.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
            Rovela is an original real-time messaging platform sculpted in modern liquid glass.
            Effortless conversations, rich group channels, and instant responsiveness without visual noise.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start mb-10">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('register')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Start Chatting Free
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto"
            >
              Sign In to Account
            </Button>
          </div>

          {/* Instant Quick Demo Exploration */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2.5">
              Quick Prototype Demo Access:
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  login('alex.rivers@rovela.dev');
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Enter as Alex Rivers</span>
                <span className="text-[10px] text-purple-400">(Designer)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('user-1');
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Enter as Elena Vance</span>
                <span className="text-[10px] text-slate-400">(Architect)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('user-2');
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Enter as Marcus Sterling</span>
                <span className="text-[10px] text-slate-400">(Researcher)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Liquid-Glass Mock Preview Card */}
        <div className="flex-1 w-full max-w-lg">
          <GlassPanel
            variant="surface"
            className="p-6 sm:p-7 border border-purple-500/25 shadow-[0_20px_50px_rgba(13,11,18,0.8)] relative overflow-hidden"
          >
            {/* Ambient accent header within preview */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-purple-400/30">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Elena Vance"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#13101B]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Elena Vance</h4>
                  <p className="text-xs text-purple-300/80">Active now · Distributed Systems</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-semibold text-emerald-400">Live</span>
              </div>
            </div>

            {/* Simulated Live Messages inside preview */}
            <div className="space-y-3.5 mb-5 text-sm">
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="p-3 rounded-2xl rounded-tl-sm bg-white/[0.07] border border-white/[0.08] text-slate-200">
                  <p className="text-xs sm:text-sm">The new liquid glass aesthetic is remarkably crisp. Readability is 10/10.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">10:14 AM</span>
                </div>
              </div>

              <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[85%]">
                <div className="p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-900/30 border border-purple-400/30">
                  <p className="text-xs sm:text-sm">Built with WCAG AA compliance and zero clutter. Ready for real-time scale! 🚀</p>
                  <span className="text-[10px] text-purple-200 mt-1 flex items-center justify-end gap-1">
                    10:17 AM · Read
                  </span>
                </div>
              </div>
            </div>

            {/* Mini preview composer */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <input
                type="text"
                readOnly
                value="Message Elena Vance..."
                className="bg-transparent text-xs text-slate-400 px-3 py-2 flex-1 focus:outline-none cursor-default"
              />
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </GlassPanel>
        </div>
      </main>

      {/* Feature Highlights Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Instant Real-Time Foundation
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Supabase Ready Architecture
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            WCAG AA Accessible
          </span>
        </div>
        <p>© 2026 ROVELA. All rights reserved.</p>
      </footer>
    </div>
  );
};
