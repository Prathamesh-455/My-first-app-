import React, { useState } from 'react';
import {
  Hotel,
  Key,
  Calendar,
  Users,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Guest, WeddingSettings } from '../types/wedding';

interface RoomAllotmentProps {
  guests: Guest[];
  settings: WeddingSettings;
  onUpdateGuestRooms: (guestId: string, roomsRequired: number, roomNumbers: string[]) => void;
}

export const RoomAllotment: React.FC<RoomAllotmentProps> = ({
  guests,
  settings,
  onUpdateGuestRooms,
}) => {
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editRoomNumbers, setEditRoomNumbers] = useState<string>('');

  const hotelGuests = guests.filter(
    (g) => g.status === 'confirmed' && g.hotelNeeded && g.roomsRequired > 0
  );

  const totalRoomsRequired = hotelGuests.reduce((sum, g) => sum + g.roomsRequired, 0);
  const totalStayingGuests = hotelGuests.reduce((sum, g) => sum + g.totalMembers, 0);
  const remainingRooms = Math.max(0, settings.totalRoomsBlocked - totalRoomsRequired);

  const allocatedRoomsCount = hotelGuests.reduce(
    (sum, g) => sum + (g.allocatedRoomNumbers ? g.allocatedRoomNumbers.length : 0),
    0
  );

  const handleStartEdit = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setEditRoomNumbers((guest.allocatedRoomNumbers || []).join(', '));
  };

  const handleSaveEdit = (guestId: string) => {
    const numbers = editRoomNumbers
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      onUpdateGuestRooms(guestId, guest.roomsRequired, numbers);
    }
    setEditingGuestId(null);
  };

  return (
    <div className="space-y-6">
      {/* Hotel Overview Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rooms Blocked */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Hotel Block
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <Hotel className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
              {settings.totalRoomsBlocked}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">rooms reserved</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 truncate">{settings.venueName}</p>
        </div>

        {/* Rooms Required */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Requested by Guests
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Key className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
              {totalRoomsRequired}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              rooms ({Math.round((totalRoomsRequired / settings.totalRoomsBlocked) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{
                width: `${Math.min(100, (totalRoomsRequired / settings.totalRoomsBlocked) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Buffer Available */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Buffer Remaining
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-serif">
              {remainingRooms}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">rooms unassigned</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">Available for late confirmations</p>
        </div>

        {/* Hotel Headcount */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              In-House Guests
            </span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-serif">
              {totalStayingGuests}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">in {hotelGuests.length} parties</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">Avg {((totalStayingGuests / totalRoomsRequired) || 0).toFixed(1)} guests/room</p>
        </div>
      </div>

      {/* Guest Room Allocation Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">
              Room Allotment &amp; Hospitality Manifest
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Assign room numbers and track special elder needs (ground floor, early check-in, cots)
            </p>
          </div>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full font-medium">
            {allocatedRoomsCount} of {totalRoomsRequired} rooms assigned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 uppercase font-semibold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-3 px-4">Guest Party</th>
                <th className="py-3 px-3">Side</th>
                <th className="py-3 px-3">Party Size</th>
                <th className="py-3 px-3">Rooms Req.</th>
                <th className="py-3 px-3">Check-In / Out</th>
                <th className="py-3 px-3">Assigned Room #</th>
                <th className="py-3 px-4">Special Requests / Ground Floor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {hotelGuests.map((guest) => {
                const isEditing = editingGuestId === guest.id;
                const hasAssigned = guest.allocatedRoomNumbers && guest.allocatedRoomNumbers.length > 0;

                return (
                  <tr key={guest.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <span>{guest.name}</span>
                        {guest.vipStatus && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500">{guest.relation}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          guest.familySide === 'Groom'
                            ? 'bg-rose-100 text-rose-900'
                            : guest.familySide === 'Bride'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-teal-100 text-teal-900'
                        }`}
                      >
                        {guest.familySide}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium text-stone-800">
                      {guest.totalMembers} ({guest.adults}A, {guest.children}K)
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        {guest.roomsRequired} Room{guest.roomsRequired > 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">
                      {guest.roomCheckIn || 'Dec 12'} &rarr; {guest.roomCheckOut || 'Dec 15'}
                    </td>

                    {/* Assigned Room Numbers */}
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editRoomNumbers}
                            onChange={(e) => setEditRoomNumbers(e.target.value)}
                            placeholder="e.g. 101, 102"
                            className="w-28 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(guest.id)}
                            className="bg-stone-900 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 flex-wrap">
                          {hasAssigned ? (
                            guest.allocatedRoomNumbers!.map((rm) => (
                              <span
                                key={rm}
                                className="bg-stone-900 text-amber-200 font-mono font-bold text-[11px] px-2 py-0.5 rounded"
                              >
                                {rm}
                              </span>
                            ))
                          ) : (
                            <span className="text-amber-700 bg-amber-50 border border-amber-200 text-[10px] px-2 py-0.5 rounded">
                              Unallocated
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Special requests */}
                    <td className="py-3 px-4 text-stone-600 max-w-[200px]">
                      {guest.notes ? (
                        <span className="text-stone-700">{guest.notes}</span>
                      ) : (
                        <span className="text-stone-400 italic">Standard room</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(guest)}
                          className="text-xs text-indigo-700 hover:text-indigo-900 hover:underline font-semibold cursor-pointer"
                        >
                          {hasAssigned ? 'Edit Rooms' : 'Assign #'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
