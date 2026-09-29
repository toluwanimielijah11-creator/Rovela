import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAdmin } from '../../context/AdminContext';
import {
  ShieldAlert,
  Activity,
  Sliders,
  Palette,
  Globe,
  Code,
  DollarSign,
  Shield,
  Languages,
  Menu as MenuIcon,
  FileText,
  Smartphone,
  Users,
  KeyRound,
  Share2,
  Megaphone,
  Bell,
  Mail,
  AlertTriangle,
  ArrowLeft,
  Search,
  CheckCircle2,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

// Tab Components
import { OverviewTab } from './tabs/OverviewTab';
import { FeatureManagerTab } from './tabs/FeatureManagerTab';
import { GlobalSetupTab } from './tabs/GlobalSetupTab';
import { SeoSettingsTab } from './tabs/SeoSettingsTab';
import { CustomScriptsTab } from './tabs/CustomScriptsTab';
import { AdSenseManagerTab } from './tabs/AdSenseManagerTab';
import { BruteForceTab } from './tabs/BruteForceTab';
import { LanguagesTab } from './tabs/LanguagesTab';
import { MenuManagerTab } from './tabs/MenuManagerTab';
import { FormBuilderTab } from './tabs/FormBuilderTab';
import { PwaSettingsTab } from './tabs/PwaSettingsTab';
import { PagesManagerTab } from './tabs/PagesManagerTab';
import { UsersManagementTab } from './tabs/UsersManagementTab';
import { RoleManagementTab } from './tabs/RoleManagementTab';
import { ReferralManagementTab } from './tabs/ReferralManagementTab';
import { AnnouncementsTab } from './tabs/AnnouncementsTab';
import { MassNotificationsTab } from './tabs/MassNotificationsTab';
import { EmailSmtpTab } from './tabs/EmailSmtpTab';
import { ModerationReportsTab } from './tabs/ModerationReportsTab';

export type AdminTabId =
  | 'overview'
  | 'feature_manager'
  | 'global_setup'
  | 'seo'
  | 'custom_scripts'
  | 'adsense'
  | 'brute_force'
  | 'languages'
  | 'menu_manager'
  | 'form_builder'
  | 'pwa'
  | 'pages'
  | 'users'
  | 'roles'
  | 'referrals'
  | 'announcements'
  | 'mass_notifications'
  | 'smtp'
  | 'reports';

interface TabGroup {
  name: string;
  tabs: Array<{
    id: AdminTabId;
    label: string;
    icon: any;
    badge?: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { setActiveSection, currentUser, reports, adminMetrics, isAdmin } = useChat();
  const { globalSettings, features, impersonatingUser, activeAdminTab, setActiveAdminTab } = useAdmin();

  const [tabSearch, setTabSearch] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTab = activeAdminTab || 'overview';
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--rovela-bg)] text-center select-none">
        <div className="p-4 rounded-3xl bg-red-500/10 text-red-500 mb-4 border border-red-500/20 shadow-lg">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--rovela-text-primary)] tracking-tight">
          Admin Access Restricted
        </h2>
        <p className="text-sm text-[var(--rovela-text-secondary)] max-w-md mt-2 mb-6 leading-relaxed">
          Privileged administrative operations require verified server-side credentials. Your account is not authorized as a Rovela system administrator.
        </p>
        <button
          type="button"
          onClick={() => setActiveSection('chats')}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Return to Chats
        </button>
      </div>
    );
  }

  const tabGroups: TabGroup[] = [
    {
      name: 'Users',
      tabs: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'reports', label: 'Reports & Moderation', icon: AlertTriangle, badge: pendingReportsCount > 0 ? `${pendingReportsCount}` : undefined },
        { id: 'roles', label: 'Role Permissions', icon: KeyRound },
        { id: 'referrals', label: 'Referral Engine', icon: Share2 },
      ],
    },
    {
      name: 'Content',
      tabs: [
        { id: 'pages', label: 'Public Pages & Policies', icon: FileText },
        { id: 'announcements', label: 'Announcements & Banners', icon: Megaphone },
        { id: 'mass_notifications', label: 'Broadcast Notifications', icon: Bell },
        { id: 'menu_manager', label: 'Menu & Footer Links', icon: MenuIcon },
      ],
    },
    {
      name: 'Platform',
      tabs: [
        { id: 'feature_manager', label: 'Feature Controls', icon: Sliders, badge: `${features.filter((f) => f.enabled).length} ON` },
        { id: 'global_setup', label: 'System Settings', icon: Palette },
        { id: 'form_builder', label: 'Registration Form Builder', icon: Layers, badge: '40+ Fields' },
        { id: 'brute_force', label: 'Security & Rate Limits', icon: Shield },
        { id: 'smtp', label: 'Email SMTP Relay', icon: Mail },
        { id: 'pwa', label: 'PWA Web App Setup', icon: Smartphone },
        { id: 'languages', label: 'Localization & Languages', icon: Languages },
      ],
    },
    {
      name: 'Analytics',
      tabs: [
        { id: 'overview', label: 'Platform Statistics & Usage', icon: Activity },
      ],
    },
    {
      name: 'SEO / Site',
      tabs: [
        { id: 'seo', label: 'Site Metadata & Crawlers', icon: Globe },
        { id: 'custom_scripts', label: 'Custom Scripts & Tags', icon: Code },
        { id: 'adsense', label: 'AdSense & Monetization', icon: DollarSign },
      ],
    },
  ];

  const allTabs = tabGroups.flatMap((g) => g.tabs);
  const currentTabObj = allTabs.find((t) => t.id === activeTab);
  const CurrentIcon = currentTabObj?.icon || ShieldAlert;

  const filteredTabs = allTabs.filter((t) =>
    t.label.toLowerCase().includes(tabSearch.toLowerCase())
  );

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const areAllGroupsCollapsed = tabGroups.every((g) => !!collapsedGroups[g.name]);

  const toggleAllGroups = () => {
    if (areAllGroupsCollapsed) {
      setCollapsedGroups({});
    } else {
      const next: Record<string, boolean> = {};
      tabGroups.forEach((g) => {
        next[g.name] = true;
      });
      setCollapsedGroups(next);
    }
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tabId: AdminTabId) => {
    setActiveAdminTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const expandAndFocusSearch = () => {
    setIsSidebarCollapsed(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'feature_manager':
        return <FeatureManagerTab />;
      case 'global_setup':
        return <GlobalSetupTab />;
      case 'seo':
        return <SeoSettingsTab />;
      case 'custom_scripts':
        return <CustomScriptsTab />;
      case 'adsense':
        return <AdSenseManagerTab />;
      case 'brute_force':
        return <BruteForceTab />;
      case 'languages':
        return <LanguagesTab />;
      case 'menu_manager':
        return <MenuManagerTab />;
      case 'form_builder':
        return <FormBuilderTab />;
      case 'pwa':
        return <PwaSettingsTab />;
      case 'pages':
        return <PagesManagerTab />;
      case 'users':
        return <UsersManagementTab />;
      case 'roles':
        return <RoleManagementTab />;
      case 'referrals':
        return <ReferralManagementTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'mass_notifications':
        return <MassNotificationsTab />;
      case 'smtp':
        return <EmailSmtpTab />;
      case 'reports':
        return <ModerationReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E0A1A] text-slate-100 overflow-hidden select-none">
      {/* Top Admin Header Bar */}
      <div className="p-3.5 sm:p-5 border-b border-purple-500/20 bg-[#140F24]/90 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Desktop Sidebar Toggle Button */}
          <Tooltip
            content={isSidebarCollapsed ? 'Expand navigation menu (Ctrl+B)' : 'Collapse navigation menu (Ctrl+B)'}
            position="bottom"
          >
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
              aria-label={isSidebarCollapsed ? 'Expand admin menu' : 'Collapse admin menu'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-purple-300" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-purple-300" />
              )}
            </button>
          </Tooltip>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
                {globalSettings.siteName} Master Admin Suite
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono uppercase tracking-wider font-bold shrink-0">
                Super Admin
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate hidden sm:block">
              Full-site layout management, feature hot-swapping, SEO, SMTP relay, and identity governance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle admin modules menu"
          >
            <MenuIcon className="w-4 h-4" />
            <span>{isMobileMenuOpen ? 'Hide Menu' : 'Modules'}</span>
            {isMobileMenuOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('more')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold border border-white/10 transition-all active:scale-95 cursor-pointer ml-auto sm:ml-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Admin Console</span>
          </button>
        </div>
      </div>

      {/* Mobile Active Module Bar Indicator & Quick Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#120E22] border-b border-purple-500/20 text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-400 text-[11px] font-medium">Active:</span>
          <div className="flex items-center gap-1.5 text-white font-bold truncate">
            <CurrentIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{currentTabObj?.label || 'Overview'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 font-semibold text-[11px] shrink-0 border border-purple-500/20 transition-all cursor-pointer"
        >
          <span>{isMobileMenuOpen ? 'Collapse' : 'Switch Module'}</span>
          {isMobileMenuOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Main Admin Workspace: Left Sidebar + Tab View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Navigation Rail (Desktop Collapsible) / Drawer (Mobile Collapsible) */}
        <div
          className={`${
            isMobileMenuOpen ? 'flex' : 'hidden lg:flex'
          } ${
            isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
          } w-full bg-[#120E22]/95 border-b lg:border-b-0 lg:border-r border-purple-500/20 flex-col shrink-0 overflow-y-auto max-h-[50vh] lg:max-h-full transition-all duration-200 ease-in-out z-20`}
        >
          {/* Top of Sidebar: Header & Search Controls */}
          {isSidebarCollapsed ? (
            /* Collapsed Desktop View: Compact Controls */
            <div className="p-3 border-b border-white/5 flex flex-col items-center gap-2 shrink-0">
              <Tooltip content="Expand navigation menu (Ctrl+B)" position="right">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-10 h-10 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-purple-500/30 active:scale-95"
                  aria-label="Expand admin menu"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              </Tooltip>

              <Tooltip content="Search admin modules" position="right">
                <button
                  type="button"
                  onClick={expandAndFocusSearch}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-95"
                  aria-label="Search admin modules"
                >
                  <Search className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          ) : (
            /* Expanded View: Header, Search Input, and Collapse Button */
            <div className="p-3 border-b border-white/5 sticky top-0 bg-[#120E22] z-10 shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Modules & Tools</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                    {allTabs.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleAllGroups}
                    className="text-[10px] px-2 py-1 rounded hover:bg-white/10 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                    title={areAllGroupsCollapsed ? 'Expand all categories' : 'Collapse all categories'}
                  >
                    {areAllGroupsCollapsed ? 'Expand All' : 'Collapse All'}
                  </button>

                  <Tooltip content="Collapse menu (Ctrl+B)" position="left">
                    <button
                      type="button"
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white items-center justify-center transition-all cursor-pointer"
                      aria-label="Collapse menu rail"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Quick Tab Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={tabSearch}
                  onChange={(e) => setTabSearch(e.target.value)}
                  placeholder="Search admin modules..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {tabSearch && (
                  <button
                    type="button"
                    onClick={() => setTabSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab Navigation Sections */}
          <div className="p-2 sm:p-3 space-y-3 flex-1 overflow-y-auto">
            {isSidebarCollapsed ? (
              /* ================= COLLAPSED ICON RAIL ================= */
              <div className="flex flex-col items-center gap-1.5">
                {tabGroups.map((group, groupIdx) => (
                  <React.Fragment key={group.name}>
                    {groupIdx > 0 && <div className="w-6 h-px bg-white/10 my-1" />}
                    {group.tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <Tooltip
                          key={tab.id}
                          content={`${tab.label}${tab.badge ? ` (${tab.badge})` : ''}`}
                          position="right"
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectTab(tab.id)}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center relative transition-colors cursor-pointer focus:outline-none ${
                              isActive
                                ? 'bg-purple-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                            aria-label={tab.label}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                            {tab.badge && (
                              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-[#120E22]" />
                            )}
                          </button>
                        </Tooltip>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* Bottom expand button */}
                <div className="pt-2 w-full flex justify-center">
                  <Tooltip content="Expand menu (Ctrl+B)" position="right">
                    <button
                      type="button"
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="w-10 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Expand navigation menu"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ) : tabSearch.trim() ? (
              /* ================= SEARCH RESULTS (EXPANDED) ================= */
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">
                  Matching Modules ({filteredTabs.length})
                </span>
                {filteredTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus:outline-none ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-purple-400" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 font-mono">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* ================= GROUPED ACCORDION (EXPANDED) ================= */
              tabGroups.map((group) => {
                const isGroupCollapsed = !!collapsedGroups[group.name];
                const activeInThisGroup = group.tabs.some((t) => t.id === activeTab);

                return (
                  <div key={group.name} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.name)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-purple-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{group.name}</span>
                        <span className="text-[9px] text-slate-500 font-normal">
                          ({group.tabs.length})
                        </span>
                        {activeInThisGroup && isGroupCollapsed && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        )}
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isGroupCollapsed ? '-rotate-90 text-slate-500' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {!isGroupCollapsed && (
                      <div className="space-y-0.5">
                        {group.tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => handleSelectTab(tab.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus:outline-none ${
                                isActive
                                  ? 'bg-purple-600 text-white'
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon
                                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`}
                                />
                                <span>{tab.label}</span>
                              </div>
                              {tab.badge && (
                                <span
                                  className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  }`}
                                >
                                  {tab.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Tab Viewport Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-6xl mx-auto w-full">{renderActiveTabContent()}</div>
        </div>
      </div>
    </div>
  );
};
