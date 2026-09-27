import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Shield, Plus, Trash2, Edit2, Check, Sparkles, X } from 'lucide-react';
import { AdminRoleItem } from '../../../types/admin';

const PERMISSION_KEYS: { key: keyof AdminRoleItem['permissions']; label: string; desc: string }[] = [
  { key: 'accessAdmin', label: 'Access Admin Dashboard', desc: 'Can enter the admin console and view telemetry' },
  { key: 'manageUsers', label: 'Manage & Ban Users', desc: 'Can ban, suspend, credit, and edit user profiles' },
  { key: 'manageRoles', label: 'Manage Roles & Permissions', desc: 'Can create and reconfigure security roles' },
  { key: 'editLayout', label: 'Edit Layout & Forms', desc: 'Can reorder menus, registration forms, and site styling' },
  { key: 'manageSettings', label: 'Global Setup & SEO', desc: 'Can modify currency, SEO tags, PWA, and custom scripts' },
  { key: 'manageBilling', label: 'Manage Billing & Payouts', desc: 'Can process transactions and referral commissions' },
  { key: 'moderateChats', label: 'Moderate Messaging & Calls', desc: 'Can review reported messages and remove toxic content' },
  { key: 'sendBroadcasts', label: 'Send Announcements & Mass Alerts', desc: 'Can dispatch platform-wide push and in-app banners' },
];

export const RoleManagementTab: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRoleItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // New Role Form
  const [newRole, setNewRole] = useState<{
    name: string;
    description: string;
    badgeColor: string;
    permissions: AdminRoleItem['permissions'];
  }>({
    name: '',
    description: '',
    badgeColor: '#8B5CF6',
    permissions: {
      accessAdmin: true,
      manageUsers: false,
      manageRoles: false,
      editLayout: false,
      manageSettings: false,
      manageBilling: false,
      moderateChats: true,
      sendBroadcasts: false,
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name.trim()) return;
    addRole({
      ...newRole,
      isSystem: false,
    });
    setNewRole({
      name: '',
      description: '',
      badgeColor: '#8B5CF6',
      permissions: {
        accessAdmin: true,
        manageUsers: false,
        manageRoles: false,
        editLayout: false,
        manageSettings: false,
        manageBilling: false,
        moderateChats: true,
        sendBroadcasts: false,
      },
    });
    setShowAddModal(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const countActivePermissions = (perms: AdminRoleItem['permissions']) => {
    return Object.values(perms).filter(Boolean).length;
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Role-Based Access Control (RBAC) & Permissions Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Create custom roles, adjust permission hierarchies, and assign specific operational capabilities to
            administrators, moderators, and team members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Role</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Role changes saved successfully!</span>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const activeCount = countActivePermissions(role.permissions);
          return (
            <div
              key={role.id}
              className="p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: role.badgeColor }} />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                            System Role
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-400">{role.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingRole(role)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                      title="Edit Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!role.isSystem && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete role "${role.name}"?`)) {
                            deleteRole(role.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Granted Permissions List */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Assigned Privileges ({activeCount} active)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSION_KEYS.filter((p) => role.permissions[p.key]).map((perm) => (
                      <span
                        key={perm.key}
                        className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10.5px] font-mono text-purple-200"
                      >
                        {perm.label}
                      </span>
                    ))}
                    {activeCount === 0 && (
                      <span className="text-[11px] text-slate-500 italic">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Updated: Active Policy</span>
                <button
                  type="button"
                  className="text-purple-400 font-semibold hover:text-purple-300 cursor-pointer"
                  onClick={() => setEditingRole(role)}
                >
                  Modify Permissions →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Role */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Create Custom Role
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role Title</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g. Content Reviewer"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role Description</label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="e.g. Can moderate messages and process support tickets"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Permissions Checklist */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Granted Permissions</span>
                <div className="space-y-2">
                  {PERMISSION_KEYS.map((perm) => {
                    const isChecked = newRole.permissions[perm.key];
                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-purple-600/15 border-purple-500/40 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              permissions: {
                                ...newRole.permissions,
                                [perm.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-500 mt-0.5"
                        />
                        <div>
                          <span className="font-semibold block">{perm.label}</span>
                          <span className="text-[11px] text-slate-400">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save New Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Role */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                Edit Role: {editingRole.name}
              </h4>
              <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role Title</label>
                <input
                  type="text"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role Description</label>
                <input
                  type="text"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Permissions Checklist */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Granted Permissions</span>
                <div className="space-y-2">
                  {PERMISSION_KEYS.map((perm) => {
                    const isChecked = editingRole.permissions[perm.key];
                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-purple-600/15 border-purple-500/40 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setEditingRole({
                              ...editingRole,
                              permissions: {
                                ...editingRole.permissions,
                                [perm.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded text-purple-600 accent-purple-500 mt-0.5"
                        />
                        <div>
                          <span className="font-semibold block">{perm.label}</span>
                          <span className="text-[11px] text-slate-400">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateRole(editingRole.id, editingRole);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save Role Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
