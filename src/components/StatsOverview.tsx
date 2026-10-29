import React from 'react';
import {
  UserCheck,
  Hotel,
  Utensils,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Plus,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Crown
} from 'lucide-react';
import { Guest, WeddingSettings } from '../types/wedding';

interface StatsOverviewProps {
  guests: Guest[];
  settings: WeddingSettings;
  onOpenAddGuest: () => void;
  onExportCsv?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  guests,
  settings,
  onOpenAddGuest,
  onExportCsv,
}) => {
  // Calculations
  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const pendingGuests = guests.filter((g) => g.status === 'pending');
  const tentativeGuests = guests.filter((g) => g.status === 'tentative');
  const declinedGuests = guests.filter((g) => g.status === 'declined');

  const totalConfirmedHeadcount = confirmedGuests.reduce((sum, g) => sum + (g.totalMembers || 0), 0);
  const totalAdults = confirmedGuests.reduce((sum, g) => sum + (g.adults || 0), 0);
  const totalChildren = confirmedGuests.reduce((sum, g) => sum + (g.children || 0), 0);

  // Side of family counts
  const groomSideHeadcount = confirmedGuests
    .filter((g) => g.familySide === 'Groom')
    .reduce((sum, g) => sum + (g.totalMembers || 0), 0);

  const brideSideHeadcount = confirmedGuests
    .filter((g) => g.familySide === 'Bride')
    .reduce((sum, g) => sum + (g.totalMembers || 0), 0);

  const mutualSideHeadcount = confirmedGuests
    .filter((g) => g.familySide === 'Mutual')
    .reduce((sum, g) => sum + (g.totalMembers || 0), 0);

  // Hotel rooms required
  const totalRoomsRequired = confirmedGuests.reduce((sum, g) => sum + (g.roomsRequired || 0), 0);
  const roomsRemaining = Math.max(0, settings.totalRoomsBlocked - totalRoomsRequired);

  // Dietary totals across all confirmed
  const dietaryBreakdown = {
    pureVeg: confirmedGuests.filter((g) => g.dietary === 'Pure Veg').reduce((sum, g) => sum + g.totalMembers, 0),
    jain: confirmedGuests.filter((g) => g.dietary === 'Jain').reduce((sum, g) => sum + g.totalMembers, 0),
    nonVeg: confirmedGuests.filter((g) => g.dietary === 'Non-Veg').reduce((sum, g) => sum + g.totalMembers, 0),
    vegan: confirmedGuests.filter((g) => g.dietary === 'Vegan').reduce((sum, g) => sum + g.totalMembers, 0),
  };

  const responseRate = guests.length > 0
    ? Math.round(((confirmedGuests.length + declinedGuests.length) / guests.length) * 100)
    : 0;

  const vipGuestsCount = guests.filter((g) => g.vipStatus).length;
  const vipConfirmedCount = confirmedGuests.filter((g) => g.vipStatus).length;

  return (
    <div className="space-y-4">
      {/* Executive Overview Header Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200/90 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xl tracking-tight">
              Host Executive Dashboard
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live RSVP Active
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Real-time guest tracking, food headcounts, and hotel room allotment analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-stone-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={onOpenAddGuest}
            className="bg-gradient-to-r from-rose-950 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Key Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Confirmed Headcount */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-xs border border-stone-200 dark:border-stone-800 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              Confirmed Headcount
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
              {totalConfirmedHeadcount}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">attending</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-700"></span>
              Adults: <strong className="text-stone-800 dark:text-stone-100">{totalAdults}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Kids: <strong className="text-stone-800 dark:text-stone-100">{totalChildren}</strong>
            </span>
          </div>
        </div>

        {/* Hotel Rooms Needed */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-xs border border-stone-200 dark:border-stone-800 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              Hotel Rooms Allotment
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Hotel className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
              {totalRoomsRequired}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              / {settings.totalRoomsBlocked} blocked
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <span
              className={`font-semibold ${
                roomsRemaining < 5 ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {roomsRemaining} buffer rooms left
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              {Math.round((totalRoomsRequired / settings.totalRoomsBlocked) * 100)}% Booked
            </span>
          </div>
        </div>

        {/* Peak Food Catering Estimate */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-xs border border-stone-200 dark:border-stone-800 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              Catering Plates Headcount
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
              {totalConfirmedHeadcount}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">peak wedding plates</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span>
              Veg: <strong className="text-stone-800 dark:text-stone-100">{dietaryBreakdown.pureVeg}</strong>
            </span>
            <span>
              Jain: <strong className="text-stone-800 dark:text-stone-100">{dietaryBreakdown.jain}</strong>
            </span>
            <span>
              Non-Veg: <strong className="text-stone-800 dark:text-stone-100">{dietaryBreakdown.nonVeg}</strong>
            </span>
          </div>
        </div>

        {/* RSVP Response Rate */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-xs border border-stone-200 dark:border-stone-800 transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              RSVP Response Velocity
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-serif">
              {responseRate}%
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              ({confirmedGuests.length + declinedGuests.length}/{guests.length} replies)
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{confirmedGuests.length} Yes</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              {pendingGuests.length + tentativeGuests.length} Waiting
            </span>
            <span className="text-stone-500 dark:text-stone-400">{declinedGuests.length} No</span>
          </div>
        </div>
      </div>

      {/* Two Balanced Executive Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Family Side Ratio (Ladkewale vs Ladkiwale vs Mutual) */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                Family Side Representation
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Attendance balance between Groom &amp; Bride families
              </p>
            </div>
            <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold px-2 py-0.5 rounded-full">
              {totalConfirmedHeadcount} Confirmed Guests
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span>
                  Groom's Side (Ladkewale)
                </span>
                <span className="font-bold text-stone-900">{groomSideHeadcount} guests</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-700 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      totalConfirmedHeadcount
                        ? (groomSideHeadcount / totalConfirmedHeadcount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Bride's Side (Ladkiwale)
                </span>
                <span className="font-bold text-stone-900">{brideSideHeadcount} guests</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      totalConfirmedHeadcount
                        ? (brideSideHeadcount / totalConfirmedHeadcount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  Mutual &amp; Friends
                </span>
                <span className="font-bold text-stone-900">{mutualSideHeadcount} guests</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      totalConfirmedHeadcount
                        ? (mutualSideHeadcount / totalConfirmedHeadcount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              Rooms and banquet arrangements are evenly balanced across reserved heritage hotel wings.
            </span>
          </div>
        </div>

        {/* Dietary Protocols & VIP Elders Special Needs */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                Dietary &amp; VIP Elder Care
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Kitchen halwai protocols and elder accessibility requirements
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block uppercase">
                Pure Veg
              </span>
              <p className="text-xl font-bold font-serif text-emerald-950 dark:text-emerald-200 mt-0.5">
                {dietaryBreakdown.pureVeg}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold block uppercase">
                Jain (Strict)
              </span>
              <p className="text-xl font-bold font-serif text-amber-950 dark:text-amber-200 mt-0.5">
                {dietaryBreakdown.jain}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800">
              <span className="text-[10px] text-rose-800 dark:text-rose-300 font-semibold block uppercase">
                Non-Veg
              </span>
              <p className="text-xl font-bold font-serif text-rose-950 dark:text-rose-200 mt-0.5">
                {dietaryBreakdown.nonVeg}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 font-semibold block uppercase">
                Vegan/Other
              </span>
              <p className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">
                {dietaryBreakdown.vegan}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                VIP Family Elders Registered:
              </span>
            </div>
            <span className="font-bold text-stone-900 dark:text-stone-100 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full text-[11px]">
              {vipConfirmedCount} of {vipGuestsCount} Confirmed
            </span>
          </div>

          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span>• Ground floor &amp; elevator priority assigned</span>
            <span>• Strict Jain halwai kitchen separated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
