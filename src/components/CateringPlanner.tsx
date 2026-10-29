import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Printer,
  Calculator,
  ShieldAlert,
  Flame,
  Music,
  PartyPopper,
  Wine,
  Leaf,
  Drumstick,
  Coffee,
  Crown,
  Lock,
  Heart
} from 'lucide-react';
import { Guest, WeddingSettings, WeddingEvent, UserRole } from '../types/wedding';

interface CateringPlannerProps {
  guests: Guest[];
  settings: WeddingSettings;
  userRole?: UserRole;
}

export const CateringPlanner: React.FC<CateringPlannerProps> = ({
  guests,
  settings,
  userRole = 'host',
}) => {
  const isHost = userRole === 'host';
  const [bufferPercentage, setBufferPercentage] = useState<number>(10);
  const [plateCost, setPlateCost] = useState<number>(settings.cateringPerPlateBudget || 1800);

  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');

  const events: {
    name: WeddingEvent;
    title: string;
    meal: string;
    timing: string;
    icon: any;
    accent: string;
    guestHighlights: string;
  }[] = [
    {
      name: 'Mehendi',
      title: 'Mehendi & High Tea Mela',
      meal: 'Lunch Buffet + Chaat Counters',
      timing: 'Day 1 • 12:30 PM - 4:00 PM',
      icon: Sparkles,
      accent: 'border-emerald-300 bg-emerald-50/50',
      guestHighlights: 'Authentic Rajasthani Dal Baati Churma, Jodhpur Pyaaz Kachori, Live Pani Puri & Kulfi',
    },
    {
      name: 'Sangeet',
      title: 'Royal Sangeet & Cocktail Night',
      meal: 'Grand Dinner Buffet + Live Grills',
      timing: 'Day 1 • 7:30 PM - Late Night',
      icon: Music,
      accent: 'border-purple-300 bg-purple-50/50',
      guestHighlights: 'Live Tandoor & Barbeque, Wood-Fired Artisan Pizzas, Signature Cocktail Bars & Desserts',
    },
    {
      name: 'Haldi',
      title: 'Haldi & Phoolon Ki Holi',
      meal: 'Traditional Sattvic Brunch',
      timing: 'Day 2 • 10:00 AM - 1:30 PM',
      icon: Flame,
      accent: 'border-amber-300 bg-amber-50/50',
      guestHighlights: 'Fresh Coconut Water, Traditional Poha, Jalebi-Fafda, Masala Chai & Festive Mithai',
    },
    {
      name: 'Wedding',
      title: 'Auspicious Phere & Royal Wedding Feast',
      meal: 'Maharaja Royal Thali & Feast',
      timing: 'Day 2 • 6:30 PM - 11:30 PM',
      icon: PartyPopper,
      accent: 'border-rose-300 bg-rose-50/50',
      guestHighlights: 'Royal Silver Thali Service, Shahi Paneer, Gatte ki Sabzi, Malpua Rabdi & Paan Counter',
    },
    {
      name: 'Reception',
      title: 'Grand Reception Gala',
      meal: 'Multi-Cuisine Continental & Indian Banquet',
      timing: 'Day 3 • 7:00 PM - Midnight',
      icon: Wine,
      accent: 'border-blue-300 bg-blue-50/50',
      guestHighlights: 'Global Gourmet Stations, Live Pasta & Risotto Bar, Royal Awadhi Biryani & Exotic Gelato',
    },
  ];

  const eventCateringData = events.map((ev) => {
    const attendees = confirmedGuests.filter((g) => g.confirmedEvents.includes(ev.name));
    const totalHeadcount = attendees.reduce((sum, g) => sum + g.totalMembers, 0);
    const adults = attendees.reduce((sum, g) => sum + g.adults, 0);
    const children = attendees.reduce((sum, g) => sum + g.children, 0);

    const pureVeg = attendees
      .filter((g) => g.dietary === 'Pure Veg')
      .reduce((sum, g) => sum + g.totalMembers, 0);

    const jain = attendees
      .filter((g) => g.dietary === 'Jain')
      .reduce((sum, g) => sum + g.totalMembers, 0);

    const nonVeg = attendees
      .filter((g) => g.dietary === 'Non-Veg')
      .reduce((sum, g) => sum + g.totalMembers, 0);

    const vegan = attendees
      .filter((g) => g.dietary === 'Vegan')
      .reduce((sum, g) => sum + g.totalMembers, 0);

    const bufferPlates = Math.ceil(totalHeadcount * (bufferPercentage / 100));
    const totalOrderPlates = totalHeadcount + bufferPlates;
    const estimatedCost = totalOrderPlates * plateCost;

    return {
      ...ev,
      attendeesCount: attendees.length,
      totalHeadcount,
      adults,
      children,
      pureVeg,
      jain,
      nonVeg,
      vegan,
      bufferPlates,
      totalOrderPlates,
      estimatedCost,
    };
  });

  const totalCateringBudget = eventCateringData.reduce((sum, e) => sum + e.estimatedCost, 0);
  const peakEvent = [...eventCateringData].sort((a, b) => b.totalOrderPlates - a.totalOrderPlates)[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <UtensilsCrossed className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xl flex items-center gap-2">
                  <span>Food Catering &amp; Banquet Experience</span>
                  {isHost ? (
                    <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                      Host Authority • Budget Unlocked
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                      Guest View
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {isHost
                    ? 'Exact plate counts, Jain dietary separation, budget estimations & buffer calculations'
                    : 'Celebration feasts, meal timings, dietary offerings, and royal culinary experiences'}
                </p>
              </div>
            </div>
          </div>

          {/* BUDGET SECTION: Strictly allowed for HOST ONLY */}
          {isHost ? (
            <div className="flex items-center gap-4 flex-wrap bg-amber-50/60 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-700 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Kitchen Buffer: <strong>+{bufferPercentage}%</strong>
                </label>
                <div className="flex items-center gap-1">
                  {[5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setBufferPercentage(pct)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        bufferPercentage === pct
                          ? 'bg-rose-900 text-amber-200'
                          : 'bg-white text-stone-700 border border-stone-300'
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-l border-amber-300 pl-3">
                <label className="block text-stone-700 font-semibold mb-1">
                  Avg Cost / Plate: <strong>₹{plateCost.toLocaleString('en-IN')}</strong>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="4000"
                  step="100"
                  value={plateCost}
                  onChange={(e) => setPlateCost(Number(e.target.value))}
                  className="w-28 accent-rose-900 cursor-pointer"
                />
              </div>

              <div className="border-l border-amber-300 pl-3">
                <span className="block text-stone-600 text-[11px] font-semibold">
                  Est. Food Budget (Host Only)
                </span>
                <strong className="text-rose-950 font-serif text-base font-extrabold">
                  ₹{(totalCateringBudget / 100000).toFixed(2)} Lakhs
                </strong>
              </div>
            </div>
          ) : (
            /* WEDDING GUEST VIEW: Budget numbers are completely hidden! */
            <div className="flex items-center gap-2.5 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-300 text-xs text-emerald-950">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <strong className="block font-bold">Royal Rajasthani Hospitality</strong>
                <span className="text-[11px] text-emerald-800">
                  Separate Pure Vegetarian, Sattvic &amp; strict Jain cooking counters prepared for your family.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dietary Rules Reminder for Indian Wedding Catering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2">
            <Leaf className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Strict Jain Kitchen Protocol</strong>
              <span>
                Separate cooking vessels and dedicated dining counter without onion, garlic, or root vegetables.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Pure Vegetarian Counters</strong>
              <span>
                Traditional Sattvic cooking for auspicious wedding rituals and family elders.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2">
            <Drumstick className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Live Barbeque &amp; Grills</strong>
              <span>
                Featured during the Royal Sangeet &amp; Cocktail Gala at distinct dinner islands.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Event by Event Detailed Cards */}
      <div className="space-y-4">
        {eventCateringData.map((ev) => {
          const Icon = ev.icon;
          return (
            <div
              key={ev.name}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${ev.accent} transition-all hover:shadow-md`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-stone-600 font-medium">
                      {ev.meal} • <span className="text-stone-700">{ev.timing}</span>
                    </p>
                    <p className="text-[11px] text-amber-800 font-serif italic mt-0.5">
                      Menu: {ev.guestHighlights}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-600 block">
                      {isHost ? 'Total Plates with Buffer' : 'Confirmed Attendees'}
                    </span>
                    <span className="text-2xl font-extrabold font-serif text-stone-900">
                      {isHost ? ev.totalOrderPlates : ev.totalHeadcount}{' '}
                      <span className="text-xs font-normal text-stone-600">
                        {isHost ? `(${ev.totalHeadcount} + ${ev.bufferPlates} buf)` : 'guests'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Plate count & Catering matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-600 block text-[11px]">Confirmed Guests</span>
                  <span className="text-lg font-bold font-serif text-stone-900">
                    {ev.totalHeadcount}
                  </span>
                  <span className="text-[10px] text-stone-600 block">
                    {ev.adults} Adults, {ev.children} Kids
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-emerald-800 block text-[11px] font-semibold">Pure Veg</span>
                  <span className="text-lg font-bold font-serif text-emerald-950">
                    {ev.pureVeg}
                  </span>
                  <span className="text-[10px] text-emerald-700 block">
                    {isHost ? `+ ${Math.ceil(ev.pureVeg * (bufferPercentage / 100))} buffer` : 'Available for all'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-amber-800 block text-[11px] font-semibold">Jain (No Root)</span>
                  <span className="text-lg font-bold font-serif text-amber-950">
                    {ev.jain}
                  </span>
                  <span className="text-[10px] text-amber-700 block">
                    {isHost ? `+ ${Math.ceil(ev.jain * (bufferPercentage / 100))} buffer` : 'Strict Jain kitchen'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="text-rose-800 block text-[11px] font-semibold">Non-Veg</span>
                  <span className="text-lg font-bold font-serif text-rose-950">
                    {ev.nonVeg}
                  </span>
                  <span className="text-[10px] text-rose-700 block">
                    {isHost ? `+ ${Math.ceil(ev.nonVeg * (bufferPercentage / 100))} buffer` : 'Live grill counter'}
                  </span>
                </div>

                {/* 5th Column: Host sees Cost Estimate, Guest sees Culinary Style */}
                {isHost ? (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 col-span-2 sm:col-span-1">
                    <span className="text-amber-900 block text-[11px] font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-700" />
                      Cost Estimate
                    </span>
                    <span className="text-lg font-bold font-serif text-amber-950">
                      ₹{(ev.estimatedCost / 1000).toFixed(0)}k
                    </span>
                    <span className="text-[10px] text-stone-600 block">
                      @ ₹{plateCost}/plate (Host only)
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 col-span-2 sm:col-span-1">
                    <span className="text-indigo-800 block text-[11px] font-semibold">Banquet Style</span>
                    <span className="text-sm font-bold font-serif text-indigo-950 mt-0.5 block">
                      Royal Thali &amp; Buffet
                    </span>
                    <span className="text-[10px] text-indigo-700 block">
                      Live Chef Stations
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
