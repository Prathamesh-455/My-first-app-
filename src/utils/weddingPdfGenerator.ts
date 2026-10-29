import { jsPDF } from 'jspdf';
import { WeddingSettings } from '../types/wedding';

export function createWeddingInvitationPDF(
  settings: WeddingSettings,
  guestName?: string
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper colors
  const maroon = [128, 0, 32] as const; // #800020
  const gold = [197, 148, 52] as const; // #C59434
  const darkGold = [148, 107, 30] as const;
  const darkText = [38, 28, 21] as const;

  // ---------------- PAGE 1: Royal Invitation Patrika ----------------
  // Outer Background & Borders
  doc.setFillColor(254, 252, 248); // Warm parchment cream
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Double gold & maroon ornamental borders
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(...maroon);
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Decorative corner accents
  const drawCorner = (x: number, y: number) => {
    doc.setFillColor(...gold);
    doc.circle(x, y, 2.5, 'F');
  };
  drawCorner(13, 13);
  drawCorner(pageWidth - 13, 13);
  drawCorner(13, pageHeight - 13);
  drawCorner(pageWidth - 13, pageHeight - 13);

  // Auspicious Invocation
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...maroon);
  doc.text('|| SHREE GANESHAY NAMAH ||', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...darkGold);
  doc.text('With the divine blessings of our elders and Almighty', pageWidth / 2, 35, { align: 'center' });

  // Family Announcement
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...darkText);
  doc.text('The Singhania & Mehra Families', pageWidth / 2, 48, { align: 'center' });
  doc.setFontSize(11);
  doc.text('cordially invite you and your family to celebrate the holy union of', pageWidth / 2, 55, { align: 'center' });

  // Couple Names Banner
  doc.setFillColor(...maroon);
  doc.roundedRect(25, 65, pageWidth - 50, 32, 4, 4, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(1);
  doc.roundedRect(27, 67, pageWidth - 54, 28, 3, 3, 'D');

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 230, 160); // Gold text
  doc.text(settings.coupleNames, pageWidth / 2, 82, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(245, 220, 180);
  doc.text('Auspicious Vivah Mahotsav', pageWidth / 2, 90, { align: 'center' });

  // Personalized Guest Callout (if provided)
  let nextY = 112;
  if (guestName) {
    doc.setFillColor(245, 235, 215);
    doc.roundedRect(35, 103, pageWidth - 70, 14, 3, 3, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...maroon);
    doc.text(`Specially Invited: ${guestName}`, pageWidth / 2, 111, { align: 'center' });
    nextY = 126;
  }

  // Date & Venue Details Card
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(40, nextY, pageWidth - 40, nextY);

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...maroon);
  doc.text('DATES & DESTINATION', pageWidth / 2, nextY + 8, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...darkText);
  doc.text(settings.weddingDates, pageWidth / 2, nextY + 16, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text(settings.venueName, pageWidth / 2, nextY + 24, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(90, 80, 70);
  doc.text(settings.venueCity, pageWidth / 2, nextY + 31, { align: 'center' });

  doc.setDrawColor(...gold);
  doc.line(40, nextY + 37, pageWidth - 40, nextY + 37);

  // RSVP / Hospitality Note
  const rsvpY = nextY + 52;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...maroon);
  doc.text('R.S.V.P & HOSPITALITY DESK', pageWidth / 2, rsvpY, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkText);
  doc.text('Please confirm your attendance, food preferences & hotel room requirements', pageWidth / 2, rsvpY + 7, { align: 'center' });
  doc.text('WhatsApp RSVP Bot: Connected in Software | Phone: +91 98201 44521', pageWidth / 2, rsvpY + 13, { align: 'center' });
  doc.text('Email: rsvp@vivahbandhan.wedding', pageWidth / 2, rsvpY + 19, { align: 'center' });

  // Footer Blessing
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(130, 110, 90);
  doc.text('Page 1 of 2 • Official Vivah Patrika • Turn over for Celebrations Itinerary', pageWidth / 2, pageHeight - 16, { align: 'center' });

  // ---------------- PAGE 2: Celebrations Itinerary & Logistics ----------------
  doc.addPage('a4', 'portrait');

  // Background & Borders for Page 2
  doc.setFillColor(254, 252, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(...maroon);
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Page 2 Header
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...maroon);
  doc.text('PROGRAMME & CELEBRATIONS ITINERARY', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...darkGold);
  doc.text('Three Days of Royal Festivities, Music, Rituals & Joy', pageWidth / 2, 32, { align: 'center' });

  // Itinerary Box layout
  const events = [
    {
      day: 'DAY 1 • DEC 12, 2026',
      title: 'MEHENDI & CHAAT MELA',
      time: '12:30 PM - 4:00 PM',
      venue: 'The Palace Gardens',
      dress: 'Festive Pastels / Floral Lehengas & Kurtas',
      desc: 'Live Henna Artists, Folk Dancers, Authentic Rajasthani Chaat',
    },
    {
      day: 'DAY 1 • DEC 12, 2026',
      title: 'SANGEET & COCKTAIL GALA',
      time: '7:30 PM Onwards',
      venue: 'Royal Durbar Ballroom',
      dress: 'Indo-Western Glamour / Glitz & Sequins',
      desc: 'Family Dance Performances, DJ Night, Global Fusion Buffet',
    },
    {
      day: 'DAY 2 • DEC 13, 2026',
      title: 'HALDI & PHOOLON KI HOLI',
      time: '10:00 AM - 1:30 PM',
      venue: 'Courtyard of Fountains',
      dress: 'Sunshine Yellow / White with Yellow Stole',
      desc: 'Auspicious Turmeric, Organic Rose Petals Holi & Sattvic Brunch',
    },
    {
      day: 'DAY 2 • DEC 13, 2026',
      title: 'BARAAT & VIVAH PHERAS',
      time: 'Baraat 5:30 PM • Pheras 7:00 PM',
      venue: 'Lakeside Mandap Pavilion',
      dress: 'Traditional Royal Ethnic / Sherwanis & Silk Sarees',
      desc: 'Royal Elephant Baraat, Holy Vedic Vows by Lake Pichola',
    },
    {
      day: 'DAY 3 • DEC 14, 2026',
      title: 'GRAND RECEPTION GALA',
      time: '7:30 PM Onwards',
      venue: 'The Udaivilas Lakeside Terrace',
      dress: 'Formal Evening / Tuxedos & Embroidered Gowns',
      desc: 'Meet the Newlyweds, Live Symphony Band, Multi-Cuisine Feast',
    },
  ];

  let startY = 42;
  events.forEach((ev) => {
    // Event box
    doc.setFillColor(250, 245, 235);
    doc.roundedRect(18, startY, pageWidth - 36, 26, 2, 2, 'F');
    doc.setDrawColor(220, 205, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(18, startY, pageWidth - 36, 26, 2, 2, 'D');

    // Day & Time Tag
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...maroon);
    doc.text(`${ev.day} • ${ev.time}`, 23, startY + 6);

    // Title
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkText);
    doc.text(ev.title, 23, startY + 12);

    // Venue & Dress Code
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 70, 60);
    doc.text(`Venue: ${ev.venue}  |  Attire: ${ev.dress}`, 23, startY + 18);

    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...darkGold);
    doc.text(ev.desc, 23, startY + 23);

    startY += 30;
  });

  // Hospitality & Travel Advisory Box
  const advY = startY + 4;
  doc.setFillColor(...maroon);
  doc.roundedRect(18, advY, pageWidth - 36, 32, 3, 3, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 230, 160);
  doc.text('HOSPITALITY, HOTEL ALLOTMENT & LOGISTICS ADVISORY', pageWidth / 2, advY + 7, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(245, 235, 220);
  doc.text('• Airport & Train Pickups: Coordinated luxury shuttles arranged from Udaipur Airport (UDR).', 23, advY + 14);
  doc.text('• Hotel Check-in: Standard palace check-in at 2:00 PM. Early check-in reserved for guests with elders.', 23, advY + 19);
  doc.text('• Pure Vegetarian & Dedicated Jain Kitchen counters maintained throughout all 3 days.', 23, advY + 24);
  doc.text('• Dedicated 24/7 Wedding Concierge: Singhania Helpdesk (+91 98201 44521).', 23, advY + 29);

  // Footer Page 2
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(130, 110, 90);
  doc.text('Page 2 of 2 • VivahBandhan Digital Guest Suite • Designed with love for Aarav & Diya', pageWidth / 2, pageHeight - 16, { align: 'center' });

  return doc;
}

export function downloadWeddingInvitationPdf(
  settings: WeddingSettings,
  guestName?: string,
  fileName = 'Vivah_Invitation_Aarav_Diya.pdf'
) {
  const doc = createWeddingInvitationPDF(settings, guestName);
  doc.save(fileName);
}

export function getWeddingInvitationPdfBlob(
  settings: WeddingSettings,
  guestName?: string
): Blob {
  const doc = createWeddingInvitationPDF(settings, guestName);
  return doc.output('blob');
}
