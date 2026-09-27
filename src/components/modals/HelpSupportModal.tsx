import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  MessageSquare,
  AlertTriangle,
  FileText,
  Shield,
  Search,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle2,
  BookOpen,
  LifeBuoy,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'faq' | 'contact' | 'report' | 'about';
}

const FAQS = [
  {
    q: 'How does end-to-end encryption protect my conversations?',
    a: 'Every message, call, and shared media on Rovela is encrypted with cryptographic keys stored only on your device. Neither network intermediaries nor platform operators can decrypt your private communications.',
    category: 'Security',
  },
  {
    q: 'How do I lock private chats behind PIN or Biometrics?',
    a: 'Swipe right or tap the chat header options to select "Lock Chat". You can configure your 6-digit Security PIN and biometric unlock (Face ID / Fingerprint) in Settings → Privacy & Security.',
    category: 'Privacy',
  },
  {
    q: 'How do 24-hour Status updates work?',
    a: 'You can share photos, video clips, and formatted text updates visible to your contacts for 24 hours. Control audience visibility anytime in Status Privacy settings.',
    category: 'Features',
  },
  {
    q: 'Where are my archived and starred messages kept?',
    a: 'Archived chats are grouped into the Archived Chats view accessible from your Chats menu and "Your Rovela" hub. Starred or pinned messages appear prioritized with distinct badges.',
    category: 'Chats',
  },
  {
    q: 'How do I clear local media cache or change download settings?',
    a: 'Navigate to Settings → Data & Storage. There you can toggle auto-download on Wi-Fi/cellular and clear cached temporary files without deleting chat history.',
    category: 'Storage',
  },
];

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq',
}) => {
  const { showToast, currentUser } = useChat();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'report' | 'about'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Contact Support state
  const [contactSubject, setContactSubject] = useState('');
  const [contactCategory, setContactCategory] = useState('technical');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Bug Report state
  const [reportTitle, setReportTitle] = useState('');
  const [reportSeverity, setReportSeverity] = useState('medium');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactMessage.trim()) {
      showToast('Please fill in all fields', undefined, 'error');
      return;
    }
    setContactSubmitted(true);
    showToast('Support ticket #ROV-' + Math.floor(100000 + Math.random() * 900000) + ' created', undefined, 'success');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDescription.trim()) {
      showToast('Please provide bug details', undefined, 'error');
      return;
    }
    setReportSubmitted(true);
    showToast('Report submitted to Trust & Engineering desk', undefined, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[var(--rovela-surface)] rounded-3xl border border-[var(--rovela-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[var(--rovela-text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--rovela-border)] flex items-center justify-between bg-[var(--rovela-surface-secondary)]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--rovela-text-primary)]">
                Help & Support
              </h2>
              <p className="text-xs text-[var(--rovela-text-secondary)]">
                Answers, troubleshooting guides, and team assistance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--rovela-text-muted)] hover:text-[var(--rovela-text-primary)] hover:bg-[var(--rovela-surface-hover)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border-b border-[var(--rovela-border)] overflow-x-auto no-scrollbar bg-[var(--rovela-surface)] shrink-0">
          {[
            { id: 'faq', label: 'Help Center & FAQ', icon: BookOpen },
            { id: 'contact', label: 'Contact Support', icon: MessageSquare },
            { id: 'report', label: 'Report a Problem', icon: AlertTriangle },
            { id: 'about', label: 'About Rovela', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--rovela-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles and troubleshooting topics..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl border border-[var(--rovela-border)] bg-[var(--rovela-surface-secondary)]/50 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-[var(--rovela-surface-hover)] cursor-pointer"
                      >
                        <div className="pr-3">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md inline-block mb-1">
                            {faq.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[var(--rovela-text-primary)]">
                            {faq.q}
                          </h4>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[var(--rovela-text-muted)] shrink-0 transition-transform ${
                            isExpanded ? 'rotate-90 text-purple-600 dark:text-purple-400' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-4 sm:px-4 text-xs text-[var(--rovela-text-secondary)] leading-relaxed border-t border-[var(--rovela-border)]/60 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTACT SUPPORT TAB */}
          {activeTab === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-[var(--rovela-text-secondary)] max-w-sm mx-auto">
                    Our support team will reach out to <strong>{currentUser.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactSubject('');
                      setContactMessage('');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Category
                    </label>
                    <select
                      value={contactCategory}
                      onChange={(e) => setContactCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      <option value="technical">Technical Issue & App Performance</option>
                      <option value="account">Account, Username & Access</option>
                      <option value="security">Privacy & Security Questions</option>
                      <option value="billing">Enterprise & Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Summary of your inquiry"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe what you need help with..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-purple-900/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Support</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* REPORT A PROBLEM TAB */}
          {activeTab === 'report' && (
            <div>
              {reportSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--rovela-text-primary)]">
                    Report Logged
                  </h3>
                  <p className="text-xs text-[var(--rovela-text-secondary)] max-w-sm mx-auto">
                    Thank you for helping keep Rovela reliable. Our engineering team has received your telemetry bundle.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReportSubmitted(false);
                      setReportTitle('');
                      setReportDescription('');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Include reproduction steps and what happened versus what was expected.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Issue Summary
                    </label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="e.g. Audio call mute button unresponsive in landscape"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Severity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setReportSeverity(sev)}
                          className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider capitalize transition-all cursor-pointer ${
                            reportSeverity === sev
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-[var(--rovela-surface-secondary)] text-[var(--rovela-text-secondary)] hover:bg-[var(--rovela-surface-hover)]'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--rovela-text-secondary)] mb-1">
                      Steps to Reproduce
                    </label>
                    <textarea
                      rows={4}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="1. Go to Calls tab&#10;2. Start voice call with contact&#10;3. Tap mute button..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] text-[var(--rovela-text-primary)] placeholder-[var(--rovela-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-purple-900/20"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Submit Diagnostic Report</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ABOUT ROVELA TAB */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--rovela-surface-secondary)] border border-[var(--rovela-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--rovela-text-primary)]">Platform Version</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">Rovela v2.4 (Build 2026.9)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--rovela-text-primary)]">Security Protocol</span>
                  <span className="text-[var(--rovela-text-secondary)]">Double-Ratchet E2EE + PIN Vault</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--rovela-text-primary)]">Compliance</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GDPR & ISO-27001 Aligned</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[var(--rovela-border)] space-y-3">
                <h4 className="font-bold text-[var(--rovela-text-primary)]">Legal & Governance</h4>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Terms of Service: User rights and acceptable use policies are active.', undefined, 'info')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold text-[var(--rovela-text-primary)]">Terms of Service</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Privacy Policy: End-to-end encrypted storage; zero selling of personal data.', undefined, 'info')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--rovela-surface-hover)] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold text-[var(--rovela-text-primary)]">Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--rovela-text-muted)]" />
                  </button>
                </div>
              </div>

              <p className="text-center text-[11px] text-[var(--rovela-text-muted)] pt-2">
                © 2026 Rovela Secure Messaging Inc. All rights reserved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
