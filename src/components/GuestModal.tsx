import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Users, Hotel, Utensils, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { Guest, FamilySide, RSVPStatus, DietaryPreference, WeddingEvent } from '../types/wedding';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guestData: Partial<Guest>) => void;
  initialGuest?: Guest | null;
}

const ALL_EVENTS: WeddingEvent[] = ['Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception'];

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGuest,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [familySide, setFamilySide] = useState<FamilySide>('Groom');
  const [relation, setRelation] = useState('');
  const [vipStatus, setVipStatus] = useState(false);
  const [status, setStatus] = useState<RSVPStatus>('confirmed');
  const [totalMembers, setTotalMembers] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [invitedEvents, setInvitedEvents] = useState<WeddingEvent[]>([...ALL_EVENTS]);
  const [confirmedEvents, setConfirmedEvents] = useState<WeddingEvent[]>(['Wedding', 'Reception']);
  const [dietary, setDietary] = useState<DietaryPreference>('Pure Veg');
  const [hotelNeeded, setHotelNeeded] = useState(true);
  const [roomsRequired, setRoomsRequired] = useState(1);
  const [roomCheckIn, setRoomCheckIn] = useState('2026-12-12');
  const [roomCheckOut, setRoomCheckOut] = useState('2026-12-15');
  const [allocatedRoomNumbers, setAllocatedRoomNumbers] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialGuest) {
      setName(initialGuest.name);
      setPhone(initialGuest.phone);
      setFamilySide(initialGuest.familySide);
      setRelation(initialGuest.relation);
      setVipStatus(!!initialGuest.vipStatus);
      setStatus(initialGuest.status);
      setTotalMembers(initialGuest.totalMembers);
      setAdults(initialGuest.adults);
      setChildren(initialGuest.children);
      setInvitedEvents(initialGuest.invitedEvents || [...ALL_EVENTS]);
      setConfirmedEvents(initialGuest.confirmedEvents || []);
      setDietary(initialGuest.dietary || 'Pure Veg');
      setHotelNeeded(!!initialGuest.hotelNeeded);
      setRoomsRequired(initialGuest.roomsRequired || 0);
      setRoomCheckIn(initialGuest.roomCheckIn || '2026-12-12');
      setRoomCheckOut(initialGuest.roomCheckOut || '2026-12-15');
      setAllocatedRoomNumbers((initialGuest.allocatedRoomNumbers || []).join(', '));
      setNotes(initialGuest.notes || '');
    } else {
      // Defaults for new guest
      setName('');
      setPhone('+91 ');
      setFamilySide('Groom');
      setRelation('Family Friend');
      setVipStatus(false);
      setStatus('confirmed');
      setTotalMembers(2);
      setAdults(2);
      setChildren(0);
      setInvitedEvents([...ALL_EVENTS]);
      setConfirmedEvents(['Wedding', 'Reception']);
      setDietary('Pure Veg');
      setHotelNeeded(true);
      setRoomsRequired(1);
      setRoomCheckIn('2026-12-12');
      setRoomCheckOut('2026-12-15');
      setAllocatedRoomNumbers('');
      setNotes('');
    }
  }, [initialGuest, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedRooms = allocatedRoomNumbers
      ? allocatedRoomNumbers.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      familySide,
      relation: relation.trim() || 'Guest',
      vipStatus,
      status,
      totalMembers: Number(totalMembers),
      adults: Number(adults),
      children: Number(children),
      invitedEvents,
      confirmedEvents: status === 'confirmed' ? confirmedEvents : [],
      dietary,
      hotelNeeded,
      roomsRequired: hotelNeeded ? Number(roomsRequired) : 0,
      roomCheckIn,
      roomCheckOut,
      allocatedRoomNumbers: parsedRooms,
      notes: notes.trim(),
    });

    onClose();
  };

  const toggleInvitedEvent = (ev: WeddingEvent) => {
    setInvitedEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  };

  const toggleConfirmedEvent = (ev: WeddingEvent) => {
    setConfirmedEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-lg text-amber-200">
              {initialGuest ? 'Edit Wedding Guest' : 'Add New Wedding Guest'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-rose-200 hover:text-white hover:bg-rose-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Guest Name / Family Head <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh & Sunita Chacha"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                WhatsApp / Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 44521"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Family Side & Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Side of Family</label>
              <select
                value={familySide}
                onChange={(e) => setFamilySide(e.target.value as FamilySide)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
              >
                <option value="Groom">Groom (Ladkewale)</option>
                <option value="Bride">Bride (Ladkiwale)</option>
                <option value="Mutual">Mutual / Friends</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Relationship / Tag</label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Uncle (Chacha), College Friend, etc."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">RSVP Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RSVPStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
              >
                <option value="confirmed">Confirmed (Attending)</option>
                <option value="pending">Pending Reply</option>
                <option value="tentative">Tentative</option>
                <option value="declined">Declined (Regrets)</option>
              </select>
            </div>
          </div>

          {/* VIP Checkbox */}
          <div className="flex items-center gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
            <input
              type="checkbox"
              id="vipStatus"
              checked={vipStatus}
              onChange={(e) => setVipStatus(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="vipStatus" className="font-semibold text-amber-950 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Mark as Senior Elder / VIP Guest (Special Hospitality & Priority Room)</span>
            </label>
          </div>

          {/* Row 3: Headcount (Adults, Children, Total) */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-800" />
                <span>Guest Headcount</span>
              </span>
              <span className="text-stone-500 font-mono">
                Total: <strong>{Number(adults) + Number(children)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Number of Adults</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={adults}
                  onChange={(e) => {
                    const a = parseInt(e.target.value, 10) || 0;
                    setAdults(a);
                    setTotalMembers(a + Number(children));
                  }}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Number of Children</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={children}
                  onChange={(e) => {
                    const c = parseInt(e.target.value, 10) || 0;
                    setChildren(c);
                    setTotalMembers(Number(adults) + c);
                  }}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Confirmed Events */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1.5">
              Events Attending (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map((ev) => {
                const isSelected = confirmedEvents.includes(ev);
                return (
                  <button
                    type="button"
                    key={ev}
                    onClick={() => toggleConfirmedEvent(ev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-900 text-amber-200 border-rose-950 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {ev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Dietary Preference */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Dietary Preference</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Pure Veg', 'Jain', 'Non-Veg', 'Vegan'] as DietaryPreference[]).map((pref) => (
                <button
                  type="button"
                  key={pref}
                  onClick={() => setDietary(pref)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    dietary === pref
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Row 6: Hotel Accommodation */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hotelNeeded}
                  onChange={(e) => setHotelNeeded(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-indigo-700" />
                  <span>Hotel Accommodation Required</span>
                </span>
              </label>
            </div>

            {hotelNeeded && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Rooms Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={roomsRequired}
                    onChange={(e) => setRoomsRequired(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-sm text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={roomCheckIn}
                    onChange={(e) => setRoomCheckIn(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={roomCheckOut}
                    onChange={(e) => setRoomCheckOut(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Special Notes / Ground Floor / Logistics
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ground floor room needed for grandmother, airport pickup requested at 2 PM..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-900 to-amber-900 hover:from-rose-800 hover:to-amber-800 text-amber-200 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{initialGuest ? 'Save Changes' : 'Add Guest to Wedding'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
