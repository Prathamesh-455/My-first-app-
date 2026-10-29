import { Guest } from '../types/wedding';

export function exportGuestsToCSV(guests: Guest[], weddingName: string = 'VivahBandhan') {
  const headers = [
    'Name',
    'Phone',
    'Side of Family',
    'Relation',
    'RSVP Status',
    'Total Members',
    'Adults',
    'Children',
    'Confirmed Events',
    'Dietary Preference',
    'Hotel Needed',
    'Rooms Required',
    'Room Numbers',
    'Check In',
    'Check Out',
    'Notes',
  ];

  const rows = guests.map((g) => [
    `"${g.name.replace(/"/g, '""')}"`,
    `"${g.phone}"`,
    `"${g.familySide}"`,
    `"${g.relation.replace(/"/g, '""')}"`,
    `"${g.status}"`,
    g.totalMembers,
    g.adults,
    g.children,
    `"${g.confirmedEvents.join(', ')}"`,
    `"${g.dietary}"`,
    g.hotelNeeded ? 'Yes' : 'No',
    g.roomsRequired,
    `"${(g.allocatedRoomNumbers || []).join(', ')}"`,
    `"${g.roomCheckIn || ''}"`,
    `"${g.roomCheckOut || ''}"`,
    `"${(g.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${weddingName.toLowerCase().replace(/\s+/g, '_')}_guest_list.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
