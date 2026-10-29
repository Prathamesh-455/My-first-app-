import React from 'react';
import {
  X,
  LayoutDashboard,
  MessageSquareCode,
  Users,
  UtensilsCrossed,
  Hotel,
  Crown,
  Heart,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Lock,
  Scroll
} from 'lucide-react';
import { CurrentUser, WeddingSettings, AppTab } from '../types/wedding';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  currentUser: CurrentUser;
  settings: WeddingSettings;
  totalConfirmedGuests: number;
  totalGuests: number;
  totalRoomsRequired: number;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentUser,
  settings,
  totalConfirmedGuests,
  totalGuests,
  totalRoomsRequired,
}) => {
  if (!isOpen) return null;

  const isHost = currentUser.role === 'host';

  const menuItems: Array<{
    id: AppTab;
    title: string;
    subtitle: string;
    icon: any;
    badge: string;
    badgeColor: string;
  }> = isHost
    ? [
        {
          id: 'dashboard',
          title: 'Host dashboard',
          subtitle: 'Live RSVP stats, family ratios, and headcount analytics',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'bg-rose-900 text-amber-200 border-rose-800',
        },
        {
          id: 'simulator',
          title: 'Whatsapp RSVP Simulator',
          subtitle: 'Simulate guest replies with AI natural language parsing & PDF dispatch',
          icon: MessageSquareCode,
          badge: 'AI Active',
          badgeColor: 'bg-emerald-800 text-emerald-200 border-emerald-600',
        },
        {
          id: 'guests',
          title: 'Guest Directory',
          subtitle: 'Manage guests, phone numbers, family sides, and RSVP statuses',
          icon: Users,
          badge: `${totalConfirmedGuests}/${totalGuests}`,
          badgeColor: 'bg-amber-800 text-amber-200 border-amber-600',
        },
        {
          id: 'invitation',
          title: 'invitation letter',
          subtitle: 'Shubh Vivah Patrika, Vedic shlokas, auspicious karyakram & PDF download',
          icon: Scroll,
          badge: 'Royal Invite',
          badgeColor: 'bg-amber-600 text-rose-950 font-bold border-amber-500',
        },
        {
          id: 'catering',
          title: 'Catering and food budget',
          subtitle: 'Meal schedule, strict Jain counters & food budget estimator (Host Only)',
          icon: UtensilsCrossed,
          badge: 'Budget',
          badgeColor: 'bg-amber-600 text-rose-950 font-bold',
        },
        {
          id: 'rooms',
          title: 'room allotment',
          subtitle: 'Hotel quotas, palace wing assignments, and elder special needs',
          icon: Hotel,
          badge: `${totalRoomsRequired} Rms`,
          badgeColor: 'bg-indigo-800 text-indigo-200 border-indigo-600',
        },
      ]
    : [
        {
          id: 'dashboard',
          title: 'Host dashboard',
          subtitle: 'Wedding guest RSVP statistics & event summary',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'bg-rose-900 text-amber-200 border-rose-800',
        },
        {
          id: 'simulator',
          title: 'Whatsapp RSVP Simulator',
          subtitle: 'Simulate guest replies with AI natural language parsing & PDF dispatch',
          icon: MessageSquareCode,
          badge: 'AI Active',
          badgeColor: 'bg-emerald-800 text-emerald-200 border-emerald-600',
        },
        // REQUIREMENT: "remove the guest directory from the guest UI. Instead of that add the option named 'invitation letter' with the proper demo invitation letter for wedding in indian style"
        {
          id: 'invitation',
          title: 'invitation letter',
          subtitle: 'Your personal Vivah Patrika, Vedic rituals, Lake Pichola venue & PDF copy',
          icon: Scroll,
          badge: 'Royal Invite',
          badgeColor: 'bg-amber-500 text-rose-950 font-bold border-amber-400',
        },
        {
          id: 'catering',
          title: 'Catering and food budget',
          subtitle: 'Celebrations dining menu & meal preferences (Budget Host Protected)',
          icon: UtensilsCrossed,
          badge: 'Host Only',
          badgeColor: 'bg-stone-800 text-stone-300',
        },
        {
          id: 'rooms',
          title: 'room allotment',
          subtitle: 'Hotel quotas, palace wing assignments, and elder special needs',
          icon: Hotel,
          badge: `${totalRoomsRequired} Rms`,
          badgeColor: 'bg-indigo-800 text-indigo-200 border-indigo-600',
        },
      ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Slide-in Navigation Drawer */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#2a040b] via-[#3d0610] to-[#1f0206] text-white shadow-2xl flex flex-col justify-between border-r border-amber-500/30 z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-rose-800/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-rose-950 shadow-md">
                <Heart className="w-5 h-5 fill-rose-950 text-rose-950" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-amber-200 block leading-tight">
                  {settings.coupleNames}
                </span>
                <span className="text-[11px] text-rose-300 font-serif">Vivah Navigation Menu</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Logged-in User Profile Card */}
          <div className="p-3 rounded-2xl bg-rose-950/70 border border-amber-400/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isHost ? 'bg-amber-400 text-rose-950' : 'bg-emerald-400 text-stone-950'
                }`}
              >
                {isHost ? <Crown className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <span className="font-semibold text-xs text-white block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-rose-300/80 truncate block font-mono">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                isHost ? 'bg-amber-400 text-rose-950' : 'bg-emerald-400 text-stone-950'
              }`}
            >
              {isHost ? 'Host' : 'Guest'}
            </span>
          </div>
        </div>

        {/* Navigation Menu Options List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-300/70 px-2 mb-2">
            Wedding Operations Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/15 text-white border border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                    : 'text-rose-200/90 hover:text-white hover:bg-rose-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-rose-950'
                        : 'bg-rose-950 text-rose-300 group-hover:bg-rose-900 group-hover:text-amber-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-amber-100 group-hover:text-amber-200 flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.id === 'catering' && !isHost && (
                        <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-0.5 font-normal">
                          <Lock className="w-2.5 h-2.5" /> Budget Protected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-200/70 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-rose-400/50'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-rose-800/40 bg-rose-950/60 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-300 font-serif font-bold text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ShubhMangal</span>
          </div>
          <p className="text-[11px] text-rose-200/70">
            Automated RSVP &amp; Wedding Operations System
          </p>
        </div>
      </div>
    </div>
  );
};
