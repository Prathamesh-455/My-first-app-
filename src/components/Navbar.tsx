import React, { useState } from 'react';
import {
  Menu,
  Heart,
  Plus,
  Download,
  Settings,
  Crown,
  Lock,
  LayoutDashboard,
  MessageSquareCode,
  Users,
  UtensilsCrossed,
  Hotel,
  Sparkles,
  Scroll
} from 'lucide-react';
import { WeddingSettings, CurrentUser, AppTab } from '../types/wedding';
import { NavigationMenu } from './NavigationMenu';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  settings: WeddingSettings;
  currentUser: CurrentUser;
  onOpenAddGuest: () => void;
  onOpenSettings: () => void;
  onExportCsv: () => void;
  onResetData?: () => void;
  totalConfirmedGuests: number;
  totalGuests: number;
  totalRoomsRequired: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  currentUser,
  onOpenAddGuest,
  onOpenSettings,
  onExportCsv,
  totalConfirmedGuests,
  totalGuests,
  totalRoomsRequired,
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const isHost = currentUser.role === 'host';

  const tabLabels: Record<AppTab, { label: string; icon: any }> = {
    dashboard: {
      label: 'Host dashboard',
      icon: LayoutDashboard,
    },
    simulator: {
      label: 'Whatsapp RSVP Simulator',
      icon: MessageSquareCode,
    },
    guests: {
      label: 'Guest Directory',
      icon: Users,
    },
    invitation: {
      label: 'invitation letter',
      icon: Scroll,
    },
    catering: {
      label: 'Catering and food budget',
      icon: UtensilsCrossed,
    },
    rooms: {
      label: 'room allotment',
      icon: Hotel,
    },
  };

  return (
    <header className="bg-gradient-to-r from-rose-950 via-[#3a0611] to-amber-950 text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-40">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: ONLY the three lines hamburger button (no text "Navigation Menu") */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNavMenuOpen(true)}
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
            className="flex items-center justify-center p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-rose-950 font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ring-1 ring-amber-300/40"
          >
            {/* Exactly the three lines hamburger icon */}
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center: Name of the software on top in the middle of UI: "ShubhMangal" */}
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center select-none flex flex-col items-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/60 hidden xs:block" />
              <h1 className="font-serif text-xl sm:text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 drop-shadow-xs">
                ShubhMangal
              </h1>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/60 hidden xs:block" />
            </div>
            <p className="text-[10px] text-amber-300/80 font-medium tracking-widest uppercase hidden sm:block">
              Wedding Guest &amp; RSVP Management
            </p>
          </div>
        </div>

        {/* Upper Right Corner: Setting Icon & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Authority Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border shadow-xs ${
              isHost
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                : 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
            }`}
          >
            {isHost ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
                <span className="bg-amber-400 text-rose-950 text-[10px] px-1 rounded font-black">
                  Host
                </span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
                <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[10px] px-1 rounded flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Guest
                </span>
              </>
            )}
          </div>

          {/* Host Only Add Guest button */}
          {isHost && (
            <button
              onClick={onOpenAddGuest}
              className="hidden lg:flex items-center gap-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700/60 font-semibold px-2.5 py-1.5 rounded-xl text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Guest</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            title="Export Guest List to CSV"
            className="hidden sm:flex items-center gap-1.5 bg-rose-900/60 hover:bg-rose-800/80 text-rose-100 border border-rose-700/60 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* REQUIREMENT: Settings icon on the upper right corner of the page */}
          <button
            onClick={onOpenSettings}
            title="Settings (Profile, Wedding Details, Theme, Logout)"
            aria-label="Settings"
            className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-amber-600/25 hover:from-amber-500/40 hover:to-amber-600/40 text-amber-200 border border-amber-400/60 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Settings className="w-5 h-5 text-amber-300 animate-spin-hover" />
          </button>
        </div>
      </div>

      {/* 5 Dedicated Separate Navigation Menu Tabs */}
      <div className="bg-rose-950/95 border-t border-rose-900/70 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-max">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(isHost
              ? [
                  {
                    id: 'dashboard' as const,
                    label: 'Host dashboard',
                    icon: LayoutDashboard,
                    badge: `${totalConfirmedGuests} Confirmed`,
                    badgeColor: 'bg-rose-900 text-amber-200 border-rose-700',
                  },
                  {
                    id: 'simulator' as const,
                    label: 'Whatsapp RSVP Simulator',
                    icon: MessageSquareCode,
                    badge: 'AI Active',
                    badgeColor: 'bg-emerald-800 text-emerald-200 border-emerald-600',
                  },
                  {
                    id: 'guests' as const,
                    label: 'Guest Directory',
                    icon: Users,
                    badge: `${totalConfirmedGuests}/${totalGuests}`,
                    badgeColor: 'bg-amber-800 text-amber-200 border-amber-600',
                  },
                  {
                    id: 'invitation' as const,
                    label: 'invitation letter',
                    icon: Scroll,
                    badge: 'Patrika',
                    badgeColor: 'bg-amber-700 text-amber-100 border-amber-500',
                  },
                  {
                    id: 'catering' as const,
                    label: 'Catering and food budget',
                    icon: UtensilsCrossed,
                    badge: 'Budget',
                    badgeColor: 'bg-amber-600 text-rose-950 font-bold',
                  },
                  {
                    id: 'rooms' as const,
                    label: 'room allotment',
                    icon: Hotel,
                    badge: `${totalRoomsRequired} Rms`,
                    badgeColor: 'bg-indigo-800 text-indigo-200 border-indigo-600',
                  },
                ]
              : [
                  {
                    id: 'dashboard' as const,
                    label: 'Host dashboard',
                    icon: LayoutDashboard,
                    badge: `${totalConfirmedGuests} Confirmed`,
                    badgeColor: 'bg-rose-900 text-amber-200 border-rose-700',
                  },
                  {
                    id: 'simulator' as const,
                    label: 'Whatsapp RSVP Simulator',
                    icon: MessageSquareCode,
                    badge: 'AI Active',
                    badgeColor: 'bg-emerald-800 text-emerald-200 border-emerald-600',
                  },
                  {
                    id: 'invitation' as const,
                    label: 'invitation letter',
                    icon: Scroll,
                    badge: 'Royal Invite',
                    badgeColor: 'bg-amber-500 text-rose-950 font-bold border-amber-400',
                  },
                  {
                    id: 'catering' as const,
                    label: 'Catering and food budget',
                    icon: UtensilsCrossed,
                    badge: 'Menu View',
                    badgeColor: 'bg-emerald-900 text-emerald-200 border-emerald-700',
                  },
                  {
                    id: 'rooms' as const,
                    label: 'room allotment',
                    icon: Hotel,
                    badge: `${totalRoomsRequired} Rms`,
                    badgeColor: 'bg-indigo-800 text-indigo-200 border-indigo-600',
                  },
                ]
            ).map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-rose-950 shadow-md ring-1 ring-amber-300 font-bold scale-102'
                      : 'text-rose-200/80 hover:text-white hover:bg-rose-900/60'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? 'bg-rose-950 text-amber-200 border-rose-900'
                        : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-amber-300/70 font-serif hidden xl:inline">
            {isHost ? '6 Dedicated Interfaces' : '5 Dedicated Interfaces'} • Click Tab or Open Menu
          </span>
        </div>
      </div>

      {/* Slide-in Navigation Drawer (Menu) */}
      <NavigationMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        settings={settings}
        totalConfirmedGuests={totalConfirmedGuests}
        totalGuests={totalGuests}
        totalRoomsRequired={totalRoomsRequired}
      />
    </header>
  );
};
