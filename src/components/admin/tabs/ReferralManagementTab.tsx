import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { DollarSign, Check, Sparkles, Trash2, Percent, Users, ArrowUpRight, ToggleLeft, ToggleRight } from 'lucide-react';

export const ReferralManagementTab: React.FC = () => {
  const { referrals, updateReferrals, deleteReferralRule } = useAdmin();
  const [form, setForm] = useState(referrals);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReferrals(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Referral Program & Affiliate Commission Engine
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure invite rewards and referral commissions. Switch seamlessly between Flat rate payout and Percentage
            shares, review affiliate signups, and delete anomalous records.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Referral Settings Saved!' : 'Save Referral Rules'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commission Rules Configuration */}
        <div className="p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white">Commission Parameters</h4>
            <button
              type="button"
              onClick={() => setForm({ ...form, programActive: !form.programActive })}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-300 cursor-pointer"
            >
              {form.programActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
              <span>{form.programActive ? 'Program Active' : 'Paused'}</span>
            </button>
          </div>

          {/* Commission Type: Flat vs Percentage */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Commission Payout Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  form.commissionType === 'percentage'
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="commissionType"
                  checked={form.commissionType === 'percentage'}
                  onChange={() => setForm({ ...form, commissionType: 'percentage' })}
                  className="hidden"
                />
                <Percent className="w-4 h-4 text-purple-400" />
                <span>Percentage (%)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  form.commissionType === 'flat'
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="commissionType"
                  checked={form.commissionType === 'flat'}
                  onChange={() => setForm({ ...form, commissionType: 'flat' })}
                  className="hidden"
                />
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Flat Rate ($)</span>
              </label>
            </div>
          </div>

          {/* Commission Rate */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Commission Value ({form.commissionType === 'percentage' ? '%' : '$ USD'})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={form.commissionType === 'percentage' ? 100 : 1000}
                value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-sm font-bold text-white font-mono focus:outline-none focus:border-purple-500"
                required
              />
              <span className="text-xs text-slate-400 font-bold">
                {form.commissionType === 'percentage' ? '%' : 'USD'}
              </span>
            </div>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              {form.commissionType === 'percentage'
                ? `Affiliates receive ${form.commissionRate}% on all referral payments`
                : `Affiliates receive $${form.commissionRate} fixed bonus per paying user`}
            </span>
          </div>

          {/* Minimum Payout Threshold */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Minimum Payout Threshold ($)</label>
            <input
              type="number"
              min="10"
              value={form.minPayoutThreshold}
              onChange={(e) => setForm({ ...form, minPayoutThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              required
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Minimum balance required before withdraw request is permitted
            </span>
          </div>
        </div>

        {/* Affiliate Referral Log Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Referrals Ledger & Payout Queue
              </h4>
              <p className="text-xs text-slate-400">Track which users invited new paying subscribers</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">{referrals.rules.length} total referrals</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold">Referrer (Affiliate)</th>
                  <th className="pb-3 font-semibold">Invited User</th>
                  <th className="pb-3 font-semibold">Commission Earned</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {referrals.rules.map((ref) => (
                  <tr key={ref.id} className="text-slate-300 group hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-white">{ref.referrerName}</td>
                    <td className="py-3 text-purple-300 font-medium">{ref.referredUser}</td>
                    <td className="py-3 font-bold text-emerald-400">${ref.earnedAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ref.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px] font-mono">{ref.date}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete referral record for ${ref.referredUser}?`)) {
                            deleteReferralRule(ref.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                        title="Delete Referral Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
};
