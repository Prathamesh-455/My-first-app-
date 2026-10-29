import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  Edit2,
  Trash2,
  Download,
  Hotel,
  Utensils,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle,
  Sparkles,
  Phone,
  UserCheck,
  FileText,
  MailCheck
} from 'lucide-react';
import { Guest, FamilySide, RSVPStatus, DietaryPreference, WeddingEvent, WeddingSettings } from '../types/wedding';
import { downloadWeddingInvitationPdf } from '../utils/weddingPdfGenerator';

interface GuestListProps {
  guests: Guest[];
  settings: WeddingSettings;
  onOpenAddGuest: () => void;
  onEditGuest: (guest: Guest) => void;
  onDeleteGuest: (id: string) => void;
  onSimulateGuestChat: (guestId: string) => void;
  onExportCsv: () => void;
  onUpdateStatus: (id: string, newStatus: RSVPStatus) => void;
}

export const GuestList: React.FC<GuestListProps> = ({
  guests,
  settings,
  onOpenAddGuest,
  onEditGuest,
  onDeleteGuest,
  onSimulateGuestChat,
  onExportCsv,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sideFilter, setSideFilter] = useState<'All' | FamilySide>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | RSVPStatus>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | DietaryPreference>('All');
  const [roomFilter, setRoomFilter] = useState<'All' | 'needsRoom' | 'noRoom'>('All');

  // Filtered guests
  const filteredGuests = guests.filter((g) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.relation.toLowerCase().includes(q) ||
        (g.notes && g.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Side filter
    if (sideFilter !== 'All' && g.familySide !== sideFilter) return false;

    // Status filter
    if (statusFilter !== 'All' && g.status !== statusFilter) return false;

    // Dietary filter
    if (dietaryFilter !== 'All' && g.dietary !== dietaryFilter) return false;

    // Room filter
    if (roomFilter === 'needsRoom' && (!g.hotelNeeded || g.roomsRequired <= 0)) return false;
    if (roomFilter === 'noRoom' && g.hotelNeeded && g.roomsRequired > 0) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xl flex items-center gap-2">
              <span>Wedding Guest Directory &amp; RSVP Management</span>
              <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-mono font-medium">
                {filteredGuests.length} of {guests.length} shown
              </span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Manage invitations, send official PDF invites, track real-time headcounts, and simulate guest WhatsApp chats.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => downloadWeddingInvitationPdf(settings)}
              className="bg-rose-900 hover:bg-rose-800 text-amber-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Official Invite (PDF)</span>
            </button>

            <button
              onClick={onOpenAddGuest}
              className="bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>

            <button
              onClick={onExportCsv}
              className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-medium px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-stone-300 dark:border-stone-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, relation..."
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800"
            />
          </div>

          {/* Family Side Filter */}
          <div>
            <select
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value as any)}
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
            >
              <option value="All">All Family Sides</option>
              <option value="Groom">Groom (Ladkewale)</option>
              <option value="Bride">Bride (Ladkiwale)</option>
              <option value="Mutual">Mutual &amp; Friends</option>
            </select>
          </div>

          {/* RSVP Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
            >
              <option value="All">All RSVP Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="tentative">Tentative</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div>
            <select
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value as any)}
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
            >
              <option value="All">All Diets</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Jain">Jain Food</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Guest / Family</th>
                <th className="py-3 px-3">Side &amp; Relation</th>
                <th className="py-3 px-3">RSVP Status</th>
                <th className="py-3 px-3">Headcount</th>
                <th className="py-3 px-3">Confirmed Events</th>
                <th className="py-3 px-3">Dietary</th>
                <th className="py-3 px-3">Hotel Stay</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/60 transition-colors">
                      {/* Name & Phone */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 text-xs shrink-0">
                            {guest.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 flex-wrap">
                              <span>{guest.name}</span>
                              {guest.vipStatus && (
                                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] px-1 rounded font-bold">
                                  VIP
                                </span>
                              )}
                              {guest.invitationSent && (
                                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                  <MailCheck className="w-2.5 h-2.5" /> PDF Sent
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-stone-400" />
                              {guest.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Side & Relation */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-0.5 ${
                            guest.familySide === 'Groom'
                              ? 'bg-rose-100 text-rose-900 border border-rose-200'
                              : guest.familySide === 'Bride'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-teal-100 text-teal-900 border border-teal-200'
                          }`}
                        >
                          {guest.familySide === 'Groom' ? 'Ladkewale' : guest.familySide === 'Bride' ? 'Ladkiwale' : 'Mutual'}
                        </span>
                        <div className="text-[11px] text-stone-600 truncate max-w-[140px]">
                          {guest.relation}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <select
                          value={guest.status}
                          onChange={(e) => onUpdateStatus(guest.id, e.target.value as RSVPStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            guest.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : guest.status === 'declined'
                              ? 'bg-stone-100 text-stone-700 border-stone-300'
                              : guest.status === 'tentative'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="tentative">Tentative</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>

                      {/* Headcount */}
                      <td className="py-3 px-3">
                        {guest.status === 'confirmed' ? (
                          <div>
                            <span className="font-bold text-stone-900 text-sm font-serif">
                              {guest.totalMembers}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              ({guest.adults}A, {guest.children}K)
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Confirmed Events */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {guest.status === 'confirmed' && guest.confirmedEvents.length > 0 ? (
                            guest.confirmedEvents.map((ev) => (
                              <span
                                key={ev}
                                className="bg-stone-100 text-stone-700 border border-stone-200 text-[10px] px-1.5 py-0.2 rounded"
                              >
                                {ev}
                              </span>
                            ))
                          ) : guest.status === 'confirmed' ? (
                            <span className="text-stone-400 italic">None selected</span>
                          ) : (
                            <span className="text-stone-400 italic">—</span>
                          )}
                        </div>
                      </td>

                      {/* Dietary */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            guest.dietary === 'Pure Veg'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : guest.dietary === 'Jain'
                              ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold'
                              : guest.dietary === 'Non-Veg'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-stone-50 text-stone-600'
                          }`}
                        >
                          {guest.dietary}
                        </span>
                      </td>

                      {/* Hotel Stay */}
                      <td className="py-3 px-3">
                        {guest.hotelNeeded && guest.roomsRequired > 0 ? (
                          <div>
                            <span className="text-indigo-900 font-semibold flex items-center gap-1">
                              <Hotel className="w-3 h-3 text-indigo-600" />
                              {guest.roomsRequired} Room{guest.roomsRequired > 1 ? 's' : ''}
                            </span>
                            {guest.allocatedRoomNumbers && guest.allocatedRoomNumbers.length > 0 && (
                              <span className="text-[10px] text-stone-500 block">
                                Rms: {guest.allocatedRoomNumbers.join(', ')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 text-[11px]">Own Stay</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Download Personalized PDF Invite */}
                          <button
                            onClick={() => downloadWeddingInvitationPdf(settings, guest.name, `Vivah_Invite_${guest.name.replace(/\s+/g, '_')}.pdf`)}
                            title="Download Personalized Wedding Invitation (PDF)"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Simulate Chat button */}
                          <button
                            onClick={() => onSimulateGuestChat(guest.id)}
                            title="Open WhatsApp Chat &amp; Send PDF / Media"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => onEditGuest(guest)}
                            title="Edit Guest Details"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => onDeleteGuest(guest.id)}
                            title="Delete Guest"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <p className="text-sm">No guests found matching your search filters.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSideFilter('All');
                        setStatusFilter('All');
                        setDietaryFilter('All');
                      }}
                      className="mt-2 text-xs text-rose-800 hover:underline font-medium cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
