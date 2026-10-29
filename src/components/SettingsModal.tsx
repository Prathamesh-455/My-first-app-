import React, { useState } from 'react';
import {
  X,
  Save,
  Settings,
  Heart,
  MapPin,
  Calendar,
  Hotel,
  Utensils,
  User,
  Sun,
  Moon,
  LogOut,
  Shield,
  Crown,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  Lock
} from 'lucide-react';
import { WeddingSettings, CurrentUser } from '../types/wedding';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WeddingSettings;
  onSave: (newSettings: WeddingSettings) => void;
  currentUser: CurrentUser;
  theme: 'light' | 'dark';
  onToggleTheme: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

type SettingsTab = 'profile' | 'wedding' | 'theme' | 'logout';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  currentUser,
  theme,
  onToggleTheme,
  onLogout,
  onSwitchRole,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState<WeddingSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const isHost = currentUser.role === 'host';

  const handleSaveWeddingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const tabs: { id: SettingsTab; label: string; icon: any; description: string }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Account identity & permissions',
    },
    {
      id: 'wedding',
      label: 'Wedding Details',
      icon: Heart,
      description: 'Couple names, dates & venue',
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: theme === 'dark' ? Moon : Sun,
      description: 'Switch light / dark mode',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      description: 'Sign out of session',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-amber-200">
                  Settings &amp; Preferences
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-medium">
                  ShubhMangal
                </span>
              </div>
              <p className="text-xs text-rose-200/80">Manage profile, wedding parameters, theme and session</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-rose-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 px-4 pt-2 gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  isSelected
                    ? 'border-amber-600 dark:border-amber-400 text-amber-900 dark:text-amber-300 bg-white dark:bg-stone-900 font-bold shadow-xs'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800/40'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-stone-800 dark:text-stone-200">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md ${
                    isHost
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-rose-950'
                      : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                  }`}
                >
                  {isHost ? <Crown className="w-7 h-7" /> : <Heart className="w-7 h-7" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 truncate">
                      {currentUser.name}
                    </h4>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isHost
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      {currentUser.role === 'host' ? 'Host (Admin)' : 'Wedding Guest'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5 truncate">
                    {currentUser.email}
                  </p>
                  {currentUser.guestId && (
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                      Guest Directory ID: <span className="font-mono">{currentUser.guestId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Permissions & Roles Overview */}
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Authority Privileges</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isHost ? 'Guest & Headcount Management' : 'RSVP Simulation'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isHost
                        ? 'Add, edit, delete guests and monitor live attendance telemetry'
                        : 'Simulate natural WhatsApp replies with Gemini AI parsing'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                      {isHost ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>Catering &amp; Food Headcount</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isHost
                        ? 'Full budget calculation and per-plate costing enabled'
                        : 'Dining schedule viewable; budget numbers protected'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Hotel Room Allocation</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isHost
                        ? 'Assign heritage palace wings and room numbers'
                        : 'View allotted room arrangements and check-in timeline'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Invitation Dispatch</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Send official wedding PDF cards and photo invitations
                    </p>
                  </div>
                </div>
              </div>

              {/* Switch Role Action */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    Switch to {isHost ? 'Wedding Guest' : 'Host'} Mode
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Change role to experience the app as an invited guest or host
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchRole();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-400/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Role</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WEDDING DETAILS */}
          {activeTab === 'wedding' && (
            <form onSubmit={handleSaveWeddingDetails} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Couple Display Title
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.coupleNames}
                    onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                    placeholder="Aarav & Diya"
                    className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Wedding Dates
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.weddingDates}
                      onChange={(e) => setFormData({ ...formData, weddingDates: e.target.value })}
                      placeholder="Dec 12 - 14, 2026"
                      className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Destination City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.venueCity}
                      onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                      placeholder="Udaipur, Rajasthan"
                      className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Venue / Palace Name
                </label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="The Oberoi Udaivilas & Lake Palace"
                  className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Hotel Rooms Blocked
                  </label>
                  <div className="relative">
                    <Hotel className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min="5"
                      max="500"
                      value={formData.totalRoomsBlocked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalRoomsBlocked: parseInt(e.target.value, 10) || 50,
                        })
                      }
                      className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Catering Budget / Plate (₹)
                  </label>
                  <div className="relative">
                    <Utensils className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min="500"
                      max="15000"
                      step="100"
                      value={formData.cateringPerPlateBudget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cateringPerPlateBudget: parseInt(e.target.value, 10) || 1800,
                        })
                      }
                      className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold">Wedding parameters updated successfully!</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-950 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-200 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Wedding Details</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: THEME (LIGHT / DARK) */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Theme &amp; Visual Appearance
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Choose between Warm Royal Light Mode or Midnight Velvet Dark Mode
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <div
                  onClick={() => onToggleTheme('light')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    theme === 'light'
                      ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300'
                  }`}
                >
                  {theme === 'light' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 font-serif text-sm">Light Mode</h5>
                      <span className="text-[11px] text-stone-500">Royal Ivory &amp; Crimson</span>
                    </div>
                  </div>

                  {/* Visual preview */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                    <div className="h-3 w-3/4 bg-stone-200 rounded-sm"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-1/2 bg-amber-100 rounded-md"></div>
                      <div className="h-6 w-1/2 bg-rose-100 rounded-md"></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 mt-2.5">
                    Traditional wedding celebration palette with bright ivory background and festive maroon accents.
                  </p>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => onToggleTheme('dark')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    theme === 'dark'
                      ? 'border-amber-400 bg-stone-850 shadow-md ring-2 ring-amber-400/20'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300'
                  }`}
                >
                  {theme === 'dark' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-300 flex items-center justify-center border border-stone-700">
                      <Moon className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-100 font-serif text-sm">Dark Mode</h5>
                      <span className="text-[11px] text-stone-400">Midnight Velvet &amp; Gold</span>
                    </div>
                  </div>

                  {/* Visual preview */}
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="h-3 w-3/4 bg-stone-800 rounded-sm"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-1/2 bg-stone-900 border border-amber-500/40 rounded-md"></div>
                      <div className="h-6 w-1/2 bg-stone-900 border border-rose-500/40 rounded-md"></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 mt-2.5">
                    Sleek evening palace aesthetic with reduced glare for night time planning and battery saving.
                  </p>
                </div>
              </div>

              {/* Direct Quick Toggle */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200 block">
                    Current Theme: <span className="capitalize text-amber-600 dark:text-amber-400">{theme} Mode</span>
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Clicking switches the entire application theme instantly
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-rose-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Switch to Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Switch to Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LOGOUT */}
          {activeTab === 'logout' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-200">
                    Sign Out of ShubhMangal
                  </h4>
                  <p className="text-xs text-rose-700/90 dark:text-rose-300/80 mt-1">
                    You are currently active as <strong>{currentUser.name}</strong> ({currentUser.role}). Signing out will securely end your session and bring you back to the ShubhMangal entrance screen.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Current Account:</span>
                  <strong className="text-stone-900 dark:text-stone-100">{currentUser.name}</strong>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Session Email:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">{currentUser.email}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Role Access:</span>
                  <span className="capitalize font-semibold text-amber-700 dark:text-amber-400">{currentUser.role}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Saved Data:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">All RSVPs &amp; Guest Changes Persisted</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-xs cursor-pointer"
                >
                  Stay Logged In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Confirm Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
