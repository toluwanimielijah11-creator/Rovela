import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  Calendar,
  Shield,
  FileCheck,
  Upload,
  Settings2,
  CheckSquare,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { FormFieldItem } from '../../../types/admin';

// 40+ comprehensive form field widgets library
export const FORM_WIDGET_PALETTE: Array<{
  type: string;
  label: string;
  defaultPlaceholder: string;
  category: FormFieldItem['category'];
  icon: any;
}> = [
  // 1. Basic Fields (8)
  { type: 'text', label: 'Single-line Text', defaultPlaceholder: 'Enter text...', category: 'basic', icon: FileText },
  { type: 'email', label: 'Email Address', defaultPlaceholder: 'user@example.com', category: 'basic', icon: Mail },
  { type: 'password', label: 'Password', defaultPlaceholder: '••••••••', category: 'basic', icon: Lock },
  { type: 'confirm_password', label: 'Confirm Password', defaultPlaceholder: 'Re-enter password', category: 'basic', icon: Lock },
  { type: 'phone', label: 'Phone Number', defaultPlaceholder: '+1 (555) 000-0000', category: 'basic', icon: Phone },
  { type: 'number', label: 'Numeric Value', defaultPlaceholder: '0', category: 'basic', icon: Sliders },
  { type: 'textarea', label: 'Multi-line Paragraph', defaultPlaceholder: 'Write detailed response...', category: 'basic', icon: FileText },
  { type: 'url', label: 'Website URL', defaultPlaceholder: 'https://...', category: 'basic', icon: Globe },

  // 2. Identity & Profile (9)
  { type: 'username', label: 'Rovela Username (@handle)', defaultPlaceholder: '@username', category: 'identity', icon: User },
  { type: 'fullname', label: 'Full Name', defaultPlaceholder: 'Alex Morgan', category: 'identity', icon: User },
  { type: 'firstname', label: 'First Name', defaultPlaceholder: 'Alex', category: 'identity', icon: User },
  { type: 'lastname', label: 'Last Name', defaultPlaceholder: 'Morgan', category: 'identity', icon: User },
  { type: 'gender', label: 'Gender Identity', defaultPlaceholder: 'Select gender', category: 'identity', icon: User },
  { type: 'dob', label: 'Date of Birth (DOB)', defaultPlaceholder: 'YYYY-MM-DD', category: 'identity', icon: Calendar },
  { type: 'avatar', label: 'Avatar Photo Upload', defaultPlaceholder: 'Upload profile image', category: 'identity', icon: Upload },
  { type: 'bio', label: 'Profile Bio / About', defaultPlaceholder: 'Share your background...', category: 'identity', icon: FileText },
  { type: 'pronouns', label: 'Pronouns', defaultPlaceholder: 'they/them, she/her, he/him', category: 'identity', icon: User },

  // 3. Verification & Security (9)
  { type: 'country', label: 'Country / Region', defaultPlaceholder: 'Select country', category: 'verification', icon: Globe },
  { type: 'state', label: 'State / Province', defaultPlaceholder: 'Select province/state', category: 'verification', icon: Globe },
  { type: 'city', label: 'City', defaultPlaceholder: 'City name', category: 'verification', icon: Globe },
  { type: 'postal', label: 'Postal / ZIP Code', defaultPlaceholder: '10001', category: 'verification', icon: Globe },
  { type: 'address', label: 'Street Address', defaultPlaceholder: '123 Main St', category: 'verification', icon: Globe },
  { type: 'national_id', label: 'Government ID / Passport', defaultPlaceholder: 'ID Number', category: 'verification', icon: Shield },
  { type: 'two_factor', label: '2FA Setup Prompt', defaultPlaceholder: 'Authenticator code', category: 'verification', icon: Lock },
  { type: 'sms_otp', label: 'SMS OTP Phone Verification', defaultPlaceholder: '6-digit SMS code', category: 'verification', icon: Phone },
  { type: 'captcha', label: 'Cloudflare / Turnstile Captcha', defaultPlaceholder: 'Verified human', category: 'verification', icon: Shield },

  // 4. Preferences & Localization (5)
  { type: 'language', label: 'Preferred Language', defaultPlaceholder: 'Select language', category: 'preferences', icon: Globe },
  { type: 'timezone', label: 'Account Timezone', defaultPlaceholder: 'UTC / Local', category: 'preferences', icon: Calendar },
  { type: 'currency', label: 'Preferred Currency', defaultPlaceholder: 'USD ($)', category: 'preferences', icon: Sliders },
  { type: 'account_type', label: 'Account Type (Personal / Creator / Business)', defaultPlaceholder: 'Personal', category: 'preferences', icon: User },
  { type: 'referral_code', label: 'Referral Invite Code', defaultPlaceholder: 'ROVELA-VIP', category: 'preferences', icon: Sparkles },

  // 5. Legal & Consent (5)
  { type: 'terms_checkbox', label: 'Terms of Service Checkbox', defaultPlaceholder: 'Accept terms', category: 'legal', icon: FileCheck },
  { type: 'privacy_checkbox', label: 'Privacy Policy Consent', defaultPlaceholder: 'Accept privacy', category: 'legal', icon: FileCheck },
  { type: 'age_verification', label: 'Age 18+ Verification Checkbox', defaultPlaceholder: 'I confirm I am 18+', category: 'legal', icon: CheckSquare },
  { type: 'newsletter', label: 'Marketing Newsletter Opt-In', defaultPlaceholder: 'Subscribe to product drops', category: 'legal', icon: Mail },
  { type: 'cookie_consent', label: 'Cookie & Tracking Consent', defaultPlaceholder: 'Allow telemetry cookies', category: 'legal', icon: CheckSquare },

  // 6. Advanced Widgets (6)
  { type: 'file_upload', label: 'File Attachment / Resume', defaultPlaceholder: 'Choose file...', category: 'advanced', icon: Upload },
  { type: 'social_link', label: 'Social Profile (X, Instagram, LinkedIn)', defaultPlaceholder: 'https://x.com/...', category: 'advanced', icon: Globe },
  { type: 'dropdown_select', label: 'Custom Dropdown Selector', defaultPlaceholder: 'Choose an option', category: 'advanced', icon: Sliders },
  { type: 'radio_group', label: 'Radio Option Buttons', defaultPlaceholder: 'Select one', category: 'advanced', icon: CheckSquare },
  { type: 'security_question', label: 'Security Recovery Question', defaultPlaceholder: 'Mother maiden name?', category: 'advanced', icon: Lock },
  { type: 'digital_signature', label: 'Digital Sign-off / Signature', defaultPlaceholder: 'Draw or type signature', category: 'advanced', icon: Edit2 },
];

export const FormBuilderTab: React.FC = () => {
  const { formFields, addFormField, updateFormField, deleteFormField, reorderFormFields } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingField, setEditingField] = useState<FormFieldItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Filter widget palette
  const filteredWidgets = FORM_WIDGET_PALETTE.filter(
    (w) => selectedCategory === 'all' || w.category === selectedCategory
  );

  const handleAddWidget = (widget: (typeof FORM_WIDGET_PALETTE)[0]) => {
    addFormField({
      type: widget.type,
      label: widget.label,
      name: `${widget.type}_${Date.now().toString().slice(-4)}`,
      placeholder: widget.defaultPlaceholder,
      required: ['email', 'password', 'terms_checkbox', 'username'].includes(widget.type),
      category: widget.category,
    });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...formFields];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFields.length) return;
    const temp = newFields[index];
    newFields[index] = newFields[targetIdx];
    newFields[targetIdx] = temp;
    reorderFormFields(newFields);
  };

  const handleSaveFields = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Visual Registration Form Builder (40+ Fields & Widgets)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Drag-and-drop or click to append fields from our comprehensive 40+ widget library. Customize requirements,
            reorder blocks, and inspect live preview rendering.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveFields}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Form Schema Saved!' : 'Save Form Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 40+ Widget Palette (5 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4 max-h-[820px] flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Widget Palette ({FORM_WIDGET_PALETTE.length}+)</h4>
              <p className="text-xs text-slate-400">Click to add to registration form</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
            {[
              { id: 'all', label: 'All (42)' },
              { id: 'basic', label: 'Basic' },
              { id: 'identity', label: 'Identity' },
              { id: 'verification', label: 'Verification' },
              { id: 'legal', label: 'Legal' },
              { id: 'advanced', label: 'Advanced' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Palette Items Scrollable List */}
          <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
            {filteredWidgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.type}
                  type="button"
                  onClick={() => handleAddWidget(widget)}
                  className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/10 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-500/20 text-purple-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                        {widget.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono capitalize">
                        {widget.category} • {widget.type}
                      </span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-purple-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Active Form Blocks (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4 max-h-[820px] flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Active Form Sequence</h4>
              <p className="text-xs text-slate-400">{formFields.length} configured fields</p>
            </div>
            <span className="text-xs text-purple-300 font-semibold">Drag / Reorder</span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {formFields.map((field, idx) => (
              <div
                key={field.id}
                className="p-3 rounded-xl bg-[#0F0B1A] border border-white/10 hover:border-purple-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{field.label}</span>
                      {field.required && (
                        <span className="text-[10px] text-rose-400 font-bold">*Req</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      type: {field.type} • name: {field.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveField(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(idx, 'down')}
                    disabled={idx === formFields.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingField(field)}
                    className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 cursor-pointer"
                    title="Edit Field Settings"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFormField(field.id)}
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                    title="Delete Field"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Interactive Form Simulator (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#140F24]/80 border border-purple-500/20 backdrop-blur-md space-y-4 max-h-[820px] flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              Live User Registration View
            </h4>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
              Dynamic Render
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0A17] border border-white/10 overflow-y-auto space-y-3 flex-1 text-xs">
            <div className="text-center pb-2 border-b border-white/5">
              <h5 className="font-extrabold text-sm text-white">Create Rovela Account</h5>
              <p className="text-[11px] text-slate-400">Join the liquid-glass network</p>
            </div>

            {formFields.map((f) => (
              <div key={f.id} className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  {f.label} {f.required && <span className="text-rose-400">*</span>}
                </label>
                {f.type.includes('checkbox') ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-purple-500 rounded" />
                    <span className="text-[11px] text-slate-300">{f.label}</span>
                  </div>
                ) : f.type === 'textarea' || f.type === 'bio' ? (
                  <textarea
                    rows={2}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 resize-none"
                  />
                ) : f.type === 'country' || f.type === 'gender' ? (
                  <select className="w-full px-3 py-1.5 rounded-lg bg-[#140F24] border border-white/10 text-xs text-white">
                    <option>{f.placeholder || 'Select...'}</option>
                  </select>
                ) : (
                  <input
                    type={f.type.includes('password') ? 'password' : 'text'}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs shadow-md"
            >
              Complete Registration
            </button>
          </div>
        </div>
      </div>

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#140F24] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-400" />
                Edit Field Properties
              </h4>
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Field Label</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Placeholder Text</label>
                <input
                  type="text"
                  value={editingField.placeholder || ''}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Internal Name / Key</label>
                <input
                  type="text"
                  value={editingField.name}
                  onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0B1A] border border-white/10 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Mandatory Required Field</span>
                <input
                  type="checkbox"
                  checked={editingField.required}
                  onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateFormField(editingField.id, editingField);
                    setEditingField(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
