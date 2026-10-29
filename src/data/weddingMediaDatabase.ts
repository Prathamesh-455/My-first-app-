import { WeddingDocument } from '../types/wedding';

// High-fidelity SVG royal wedding card as data URL
const ROYAL_WEDDING_CARD_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a0404" />
      <stop offset="40%" stop-color="#73091c" />
      <stop offset="100%" stop-color="#2d0208" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082" />
      <stop offset="50%" stop-color="#FFD54F" />
      <stop offset="100%" stop-color="#FFA000" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1100" fill="url(#bg)" />

  <!-- Outer Borders -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="url(#gold)" stroke-width="4" rx="16" />
  <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#FFE082" stroke-width="1.5" stroke-dasharray="6,4" rx="12" />

  <!-- Corner Mandalas -->
  <circle cx="50" cy="50" r="16" fill="url(#gold)" opacity="0.8" />
  <circle cx="750" cy="50" r="16" fill="url(#gold)" opacity="0.8" />
  <circle cx="50" cy="1050" r="16" fill="url(#gold)" opacity="0.8" />
  <circle cx="750" cy="1050" r="16" fill="url(#gold)" opacity="0.8" />

  <!-- Auspicious Header -->
  <text x="400" y="120" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="url(#gold)">
    || श्री गणेशाय नमः ||
  </text>
  <text x="400" y="160" text-anchor="middle" font-family="serif" font-size="18" fill="#FFF8E1" letter-spacing="2">
    SHREE GANESHAY NAMAH
  </text>

  <!-- Golden Diya Motif -->
  <path d="M370,200 Q400,240 430,200 Q400,215 370,200 Z" fill="url(#gold)" />
  <circle cx="400" cy="190" r="6" fill="#FFF176" />

  <!-- Invocation -->
  <text x="400" y="260" text-anchor="middle" font-family="serif" font-size="20" fill="#FFE082" font-style="italic">
    With the blessings of our elders &amp; ancestors
  </text>
  <text x="400" y="300" text-anchor="middle" font-family="serif" font-size="24" fill="#FFFFFF" font-weight="600">
    Singhania &amp; Mehra Families
  </text>
  <text x="400" y="340" text-anchor="middle" font-family="serif" font-size="19" fill="#FFF8E1">
    cordially invite you to celebrate the auspicious marriage of
  </text>

  <!-- Couple Names Box -->
  <rect x="120" y="390" width="560" height="160" rx="16" fill="#1f0206" stroke="url(#gold)" stroke-width="2.5" />
  <text x="400" y="465" text-anchor="middle" font-family="serif" font-size="46" font-weight="bold" fill="url(#gold)">
    Aarav &amp; Diya
  </text>
  <text x="400" y="515" text-anchor="middle" font-family="serif" font-size="20" fill="#FFE082" letter-spacing="4">
    ROYAL WEDDING UTSAV
  </text>

  <!-- Dates & Venue -->
  <text x="400" y="620" text-anchor="middle" font-family="serif" font-size="22" font-weight="bold" fill="url(#gold)">
    DECEMBER 12 - 14, 2026
  </text>
  <text x="400" y="660" text-anchor="middle" font-family="serif" font-size="24" fill="#FFFFFF">
    The Oberoi Udaivilas &amp; Lake Palace
  </text>
  <text x="400" y="700" text-anchor="middle" font-family="serif" font-size="20" fill="#FFECB3" font-style="italic">
    Udaipur, Rajasthan, India
  </text>

  <!-- Divider -->
  <line x1="200" y1="740" x2="600" y2="740" stroke="url(#gold)" stroke-width="1.5" />

  <!-- Programme Highlights -->
  <text x="400" y="785" text-anchor="middle" font-family="serif" font-size="19" fill="#FFFFFF">
    • Dec 12: Mehendi Utsav (12:30 PM) &amp; Royal Sangeet (7:30 PM) •
  </text>
  <text x="400" y="825" text-anchor="middle" font-family="serif" font-size="19" fill="#FFFFFF">
    • Dec 13: Haldi Ceremony (10:00 AM) &amp; Auspicious Pheras (6:30 PM) •
  </text>
  <text x="400" y="865" text-anchor="middle" font-family="serif" font-size="19" fill="#FFFFFF">
    • Dec 14: Grand Reception Gala (7:30 PM) •
  </text>

  <!-- Footer RSVP -->
  <rect x="180" y="930" width="440" height="70" rx="12" fill="#5c0612" stroke="#FFD54F" stroke-width="1" />
  <text x="400" y="960" text-anchor="middle" font-family="serif" font-size="16" font-weight="bold" fill="url(#gold)">
    RSVP VIA VIVAHBANDHAN WHATSAPP ASSISTANT
  </text>
  <text x="400" y="985" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#FFF8E1">
    Hotel &amp; Transport Helpdesk: +91 98201 44521
  </text>
</svg>
`)}`;

// Sangeet & Cocktail Pass SVG
const SANGEET_PASS_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="purpleGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e0038" />
      <stop offset="50%" stop-color="#3b0764" />
      <stop offset="100%" stop-color="#18002e" />
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
  </defs>

  <rect width="800" height="450" fill="url(#purpleGold)" />
  <rect x="20" y="20" width="760" height="410" fill="none" stroke="url(#goldText)" stroke-width="3" rx="16" />

  <text x="400" y="70" text-anchor="middle" font-family="serif" font-size="16" letter-spacing="4" fill="#FDE047">
    AARAV &amp; DIYA'S WEDDING FESTIVITIES
  </text>
  <text x="400" y="125" text-anchor="middle" font-family="serif" font-size="34" font-weight="bold" fill="#FFFFFF">
    ROYAL SANGEET &amp; COCKTAIL NIGHT
  </text>
  <text x="400" y="165" text-anchor="middle" font-family="serif" font-size="20" fill="#E9D5FF" font-style="italic">
    An evening of music, dance, celebration &amp; joy
  </text>

  <rect x="80" y="200" width="640" height="130" rx="12" fill="#2e0550" stroke="#CA8A04" stroke-width="1.5" />
  <text x="120" y="245" font-family="sans-serif" font-size="16" fill="#FDE047" font-weight="bold">📅 DATE &amp; TIME:</text>
  <text x="270" y="245" font-family="sans-serif" font-size="16" fill="#FFFFFF">Friday, Dec 12, 2026 • 7:30 PM Onwards</text>

  <text x="120" y="280" font-family="sans-serif" font-size="16" fill="#FDE047" font-weight="bold">📍 VENUE:</text>
  <text x="270" y="280" font-family="sans-serif" font-size="16" fill="#FFFFFF">Royal Durbar Ballroom, Udaivilas</text>

  <text x="120" y="312" font-family="sans-serif" font-size="16" fill="#FDE047" font-weight="bold">👔 DRESS CODE:</text>
  <text x="270" y="312" font-family="sans-serif" font-size="16" fill="#FFFFFF">Indo-Western Glamour / Glitz &amp; Sequins</text>

  <text x="400" y="380" text-anchor="middle" font-family="serif" font-size="14" fill="#CA8A04">
    VIP GUEST ACCESS PASS • PRESENT AT BANQUET ENTRY
  </text>
</svg>
`)}`;

export const INITIAL_WEDDING_DOCUMENTS: WeddingDocument[] = [
  {
    id: 'invitation-pdf',
    title: 'Official Wedding Invitation & Itinerary (PDF)',
    fileName: 'Vivah_Invitation_Aarav_Diya.pdf',
    fileType: 'pdf',
    fileSize: '420 KB',
    pageCount: 2,
    category: 'invitation',
    description: 'Complete 2-page royal wedding invitation card with Ganeshay Namah shloka, 3-day events schedule, dress codes & hospitality desk',
  },
  {
    id: 'royal-patrika-img',
    title: 'Royal Vivah Patrika (Digital E-Card)',
    fileName: 'Royal_Vivah_Patrika.png',
    fileType: 'image',
    fileSize: '680 KB',
    category: 'invitation',
    dataUrl: ROYAL_WEDDING_CARD_SVG,
    description: 'High-resolution traditional wedding card with royal maroon & gold borders, kalash & diya motifs',
  },
  {
    id: 'sangeet-pass-img',
    title: 'Sangeet & Cocktail Night Pass (E-Pass)',
    fileName: 'Sangeet_Cocktail_Night_Pass.png',
    fileType: 'image',
    fileSize: '490 KB',
    category: 'pass',
    dataUrl: SANGEET_PASS_SVG,
    description: 'Day 1 evening Sangeet pass with ballroom venue, timing & Indo-Western glamour dress code',
  },
  {
    id: 'itinerary-pdf',
    title: 'Udaipur Travel & Hotel Logistics Guide (PDF)',
    fileName: 'Udaipur_Travel_Hotel_Guide.pdf',
    fileType: 'pdf',
    fileSize: '280 KB',
    pageCount: 1,
    category: 'itinerary',
    description: 'Airport luxury shuttle schedule, palace check-in details, and Udaipur weather guide',
  },
];
