import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  Users,
  Activity,
  DollarSign,
  Globe,
  ArrowUpRight,
  TrendingUp,
  Server,
  Cpu,
  HardDrive,
  ShieldCheck,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle2,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { trafficStats, accountAnalytics, paymentStats, globalSettings, adminUsers } = useAdmin();

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/25 flex items-center justify-center text-purple-300 ring-1 ring-purple-400/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Global Platform Telemetry & Real-Time Performance
            </h3>
            <p className="text-xs text-slate-300">
              All 14 distributed edge clusters operating at 99.98% uptime. Real-time metrics streaming active.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Streams Connected
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real-time Site Traffic */}
        <div className="p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-violet-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Active Traffic</span>
            <span className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/30">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {trafficStats.activeVisitors.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{trafficStats.requestsPerMin.toLocaleString()} req / min</span>
            <span className="text-purple-300 font-medium">Bounce: {trafficStats.bounceRate}%</span>
          </div>
        </div>

        {/* Account Creation Analysis */}
        <div className="p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">User Accounts</span>
            <span className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {accountAnalytics.totalSignups.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              {accountAnalytics.monthlyGrowthRate}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>+{accountAnalytics.dailySignups} today</span>
            <span className="text-purple-300 font-medium">{adminUsers.length} in directory</span>
          </div>
        </div>

        {/* Payments & MRR */}
        <div className="p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Monthly Revenue</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {globalSettings.currencySymbol}
              {paymentStats.mrr.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.7%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total: {globalSettings.currencySymbol}{paymentStats.totalRevenue.toLocaleString()}</span>
            <span className="text-emerald-300 font-medium">Pending: {globalSettings.currencySymbol}{paymentStats.pendingPayouts}</span>
          </div>
        </div>

        {/* Infrastructure & Security */}
        <div className="p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">System Health</span>
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              99.98%
            </span>
            <span className="text-xs font-bold text-cyan-300">Optimal</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latency: 14ms</span>
            <span className="text-cyan-300 font-medium">Verified: {accountAnalytics.emailVerificationRate}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Real-time Traffic by Geography + Account Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Traffic Geographic Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Real-Time Traffic Distribution by Geography
              </h4>
              <p className="text-xs text-slate-400">Live active sessions streaming from global ISP nodes</p>
            </div>
            <span className="text-xs text-purple-300 font-mono">Avg Session: {trafficStats.avgSessionDuration}</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {trafficStats.geoDistribution.map((geo) => (
              <div key={geo.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-200 flex items-center gap-2">
                    <span className="text-base">{geo.flag}</span>
                    {geo.country}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-[11px]">{geo.visitors} active</span>
                    <span className="text-purple-300 font-bold w-10 text-right">{geo.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-500"
                    style={{ width: `${geo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Creation Analysis & Device Breakdown */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              Account Creation Analysis
            </h4>
            <p className="text-xs text-slate-400 mb-4">Signups and platform device accessibility</p>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Daily Signups (Today)</span>
                <span className="text-white font-extrabold">+{accountAnalytics.dailySignups} users</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Monthly Run Rate</span>
                <span className="text-emerald-400 font-extrabold">{accountAnalytics.monthlyGrowthRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Email Verification</span>
                <span className="text-purple-300 font-extrabold">{accountAnalytics.emailVerificationRate}</span>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
              Device Segmentation
            </span>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Mobile PWA / iOS & Android
                </span>
                <span className="text-white font-bold">{accountAnalytics.deviceBreakdown.mobile}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${accountAnalytics.deviceBreakdown.mobile}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-slate-300 flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Desktop Web & Mac/Win
                </span>
                <span className="text-white font-bold">{accountAnalytics.deviceBreakdown.desktop}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${accountAnalytics.deviceBreakdown.desktop}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-slate-300 flex items-center gap-2">
                  <Tablet className="w-3.5 h-3.5 text-pink-400" /> Tablets & iPads
                </span>
                <span className="text-white font-bold">{accountAnalytics.deviceBreakdown.tablet}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: `${accountAnalytics.deviceBreakdown.tablet}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>Brute-force limit active</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Shield Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Payment Ledger & Cluster Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment & Credit Economy */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Payment & Messaging Credits Settlement
              </h4>
              <p className="text-xs text-slate-400">Transaction volume, membership tiers, and creator payouts</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              Gateway: Active (Stripe/Crypto)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Total Gross Inflows</span>
              <span className="text-lg font-bold text-white mt-1 block">
                {globalSettings.currencySymbol}{paymentStats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Credits Circulating</span>
              <span className="text-lg font-bold text-purple-300 mt-1 block">
                {paymentStats.tokensIssued.toLocaleString()} CR
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Pending Referral Payouts</span>
              <span className="text-lg font-bold text-amber-300 mt-1 block">
                {globalSettings.currencySymbol}{paymentStats.pendingPayouts.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-2 font-semibold">Transaction ID</th>
                  <th className="pb-2 font-semibold">User</th>
                  <th className="pb-2 font-semibold">Tier / Item</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'TX-90412', user: 'Sarah Connor', plan: 'Rovela Pro Lifetime', amount: '$49.00', status: 'Completed', date: 'Just now' },
                  { id: 'TX-90411', user: 'Alex River', plan: '5,000 Call Credits', amount: '$15.00', status: 'Completed', date: '3m ago' },
                  { id: 'TX-90410', user: 'Marcus Vance', plan: 'Enterprise Team Vault', amount: '$199.00', status: 'Completed', date: '12m ago' },
                ].map((tx) => (
                  <tr key={tx.id} className="text-slate-300">
                    <td className="py-2.5 font-mono text-[11px] text-purple-300">{tx.id}</td>
                    <td className="py-2.5 text-white font-medium">{tx.user}</td>
                    <td className="py-2.5 text-slate-400">{tx.plan}</td>
                    <td className="py-2.5 font-semibold text-white">{tx.amount}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server & Cluster Health */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-cyan-400" />
              Cluster Telemetry
            </h4>
            <p className="text-xs text-slate-400 mb-4">Real-time resource utilization</p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" /> CPU Core Load
                  </span>
                  <span className="text-white font-mono font-bold">28% (Optimal)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Memory (RAM) Allocation
                  </span>
                  <span className="text-white font-mono font-bold">4.2 GB / 16.0 GB</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Database Query Latency
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">14 ms avg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-xs text-slate-300 font-medium">Node Environment</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-white">Production Edge v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
