import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Heart,
  MessageSquareCode,
  UserCheck,
  Utensils,
  Share2,
  PhoneCall,
  Crown
} from 'lucide-react';
import { WeddingSettings, CurrentUser } from '../types/wedding';
import { downloadWeddingInvitationPdf } from '../utils/weddingPdfGenerator';

interface InvitationLetterProps {
  settings: WeddingSettings;
  currentUser: CurrentUser;
  onGoToSimulator?: () => void;
}

export const InvitationLetter: React.FC<InvitationLetterProps> = ({
  settings,
  currentUser,
  onGoToSimulator,
}) => {
  const [recipientName, setRecipientName] = useState<string>(
    currentUser.guestName || currentUser.name || 'Respected Atithi & Family'
  );
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [copied, setCopied] = useState(false);

  const itinerary = [
    {
      day: 'Day 1 • Friday, Dec 12, 2026',
      title: 'गणेश पूजन एवं मेहँदी की शाम',
      englishTitle: 'Ganesh Sthapana & Mehendi Mela',
      time: '12:30 PM - 04:30 PM',
      venue: 'The Palace Zenana Gardens',
      attire: 'Festive Pastels / Floral Lehengas & Kurtas',
      description: 'Divine blessings of Lord Ganesha followed by live organic Rajasthani henna artists, sufi folk music & street chaat counters.',
      tag: 'Auspicious Start',
    },
    {
      day: 'Day 1 • Friday, Dec 12, 2026',
      title: 'सुर-ताल: संगीत संध्या एवं कॉकटेल',
      englishTitle: 'Royal Sangeet & Cocktail Gala',
      time: '07:30 PM Onwards',
      venue: 'Royal Durbar Ballroom',
      attire: 'Indo-Western Glamour / Glitz, Sequins & Silk',
      description: 'Choreographed family dance face-off (Singhanias vs Mehras), celebrity DJ, and a global gourmet dinner feast.',
      tag: 'Celebration & Dance',
    },
    {
      day: 'Day 2 • Saturday, Dec 13, 2026',
      title: 'मंगल स्नान एवं हल्दी की रस्म',
      englishTitle: 'Mangal Snan & Phoolon Ki Holi',
      time: '10:00 AM - 01:30 PM',
      venue: 'Courtyard of Fountains & Poolside',
      attire: 'Sunshine Yellow / White with Turmeric Stoles',
      description: 'Auspicious fresh turmeric paste, fragrant Vrindavan rose petals holi, traditional folk dholak & satvik royal brunch.',
      tag: 'Sacred Ritual',
    },
    {
      day: 'Day 2 • Saturday, Dec 13, 2026',
      title: 'शुभ विवाह, बारात एवं सात फेरे',
      englishTitle: 'Royal Baraat & Sacred Vedic Phere',
      time: 'Baraat: 05:30 PM • Godhuli Muhurat: 07:15 PM',
      venue: 'Lakeside Mandap Pavilion (Lake Pichola)',
      attire: 'Traditional Royal Ethnic / Embroidered Sherwanis & Kanjivaram Silk',
      description: 'Royal procession with elephants & shehnai maestros, sacred Saat Phere around holy Agni under the Udaipur starry sky.',
      tag: 'Main Vivah Sanskar',
    },
    {
      day: 'Day 3 • Sunday, Dec 14, 2026',
      title: 'वर-वधू आशीर्वाद एवं विदाई समारोह',
      englishTitle: 'Grand Reception & Ashirwad Samaroh',
      time: '07:30 PM Onwards',
      venue: 'The Udaivilas Lakeside Grand Promenade',
      attire: 'Formal Evening Elegance / Bandhgalas & Heavy Sarees',
      description: 'Blessing ceremony for the newlyweds Aarav & Diya, live classical symphony orchestra, followed by an elaborate 108-course Royal Feast.',
      tag: 'Blessing & Banquet',
    },
  ];

  const handleCopyText = () => {
    const textToCopy = `॥ ॐ श्री गणेशाय नमः ॥
॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥

Smt. Sunita & Shri Vikramaditya Singhania
cordially invite you with family to grace the auspicious wedding ceremony of their beloved son

❤️ Chi. AARAV
(Grandson of Late Smt. Kamala Devi & Shri Om Prakash Singhania)
      WEDS
❤️ Sau. DIYA
(Daughter of Smt. Kavita & Shri Rajesh Mehra)

📅 Dates: ${settings.weddingDates}
📍 Venue: ${settings.venueName}, ${settings.venueCity}

Specially Invited: ${recipientName}

KARYAKRAM (Ceremony Schedule):
1. Ganesh Pujan & Mehendi: Dec 12, 12:30 PM (Zenana Gardens)
2. Royal Sangeet & Cocktails: Dec 12, 7:30 PM (Royal Durbar Ballroom)
3. Haldi & Phoolon Ki Holi: Dec 13, 10:00 AM (Courtyard of Fountains)
4. Shubh Vivah & Vedic Phere: Dec 13, Baraat 5:30 PM, Phere 7:15 PM (Lakeside Mandap)
5. Reception & Ashirwad: Dec 14, 7:30 PM (Lakeside Promenade)

Darshanabhilashi: All elders of Singhania & Mehra Parivar
Bal Manuhar: "Chacha-Chachi, Mama-Mami aana zaroor, humare Bhaiya & Didi ki shadi mein dhoom machana zaroor!" - Reyansh & Ananya
Bhojan Prasad: Pure Vegetarian royal feast with dedicated Jain cuisine.

Please confirm your attendance via WhatsApp RSVP in the ShubhMangal software!`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Action & Control Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-sm backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500 text-rose-950 rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4 fill-rose-950" />
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
              Shubh Vivah Nimantran Patra (Invitation Letter)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1">
            Traditional Indian wedding invitation with Vedic invocations, auspicious muhurats, and family genealogy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => downloadWeddingInvitationPdf(settings, recipientName)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-rose-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            title="Download authentic 2-page PDF invitation letter"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download PDF Invite</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Copy invitation message to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Wording</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition-all cursor-pointer border border-stone-300/60 dark:border-stone-700"
            title="Print invitation"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          {onGoToSimulator && (
            <button
              onClick={onGoToSimulator}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              title="Confirm attendance via WhatsApp"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>RSVP on WhatsApp</span>
            </button>
          )}
        </div>
      </div>

      {/* Recipient Personalization Banner */}
      <div className="bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-200/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded-lg">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-stone-900 dark:text-stone-200">
              Personalized Greeting on Card:
            </span>
            <p className="text-stone-600 dark:text-stone-400 text-[11px]">
              This invitation is honored in your name. You can customize the family address below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isEditingRecipient ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Respected Sharma Family"
                className="px-3 py-1.5 bg-white dark:bg-stone-800 border border-amber-400 rounded-lg text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-64 font-serif"
                autoFocus
              />
              <button
                onClick={() => setIsEditingRecipient(false)}
                className="px-2.5 py-1.5 bg-amber-500 text-rose-950 font-bold rounded-lg text-[11px] cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-800">
                {recipientName}
              </span>
              <button
                onClick={() => setIsEditingRecipient(true)}
                className="text-amber-700 dark:text-amber-400 hover:underline text-[11px] font-semibold cursor-pointer"
              >
                Edit Name
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- THE ROYAL INDIAN WEDDING INVITATION PATRIKA ---------------- */}
      <div className="relative bg-[#fdfbf7] dark:bg-[#1b1517] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-double border-amber-600/70 dark:border-amber-500/50 p-6 sm:p-10 md:p-14">
        {/* Ornate Background Watermark Motif */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] flex items-center justify-center">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M50 5 L55 35 L85 35 L60 50 L70 80 L50 65 L30 80 L40 50 L15 35 L45 35 Z" />
          </svg>
        </div>

        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-600/80 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-600/80 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-600/80 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-600/80 rounded-br-lg pointer-events-none" />

        {/* Center Top: Auspicious Ganesha & Vedic Invocations */}
        <div className="text-center relative z-10 space-y-3">
          {/* Ganesha Motif Badge */}
          <div className="inline-flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-rose-700 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#fdfbf7] dark:bg-[#251b1f] flex flex-col items-center justify-center text-amber-700 dark:text-amber-300">
                <span className="text-2xl sm:text-3xl font-serif">ॐ</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-rose-800 dark:text-rose-300">श्री गणेश</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-2xl font-black text-rose-950 dark:text-amber-200 tracking-wider">
              ॥ श्री गणेशाय नमः ॥
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-amber-800 dark:text-amber-400 max-w-lg mx-auto">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
            <p className="text-[11px] font-serif text-stone-500 dark:text-stone-400 tracking-widest uppercase">
              ॥ ॐ श्री कुलदेवतायै नमः ॥
            </p>
          </div>

          {/* Thin Gold Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="h-[1px] w-16 sm:w-32 bg-gradient-to-r from-transparent to-amber-500" />
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500/40" />
            <span className="h-[1px] w-16 sm:w-32 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
        </div>

        {/* Guest Respect Callout (Atithi Devo Bhava) */}
        <div className="my-6 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-500/15 via-rose-500/20 to-amber-500/15 border border-amber-500/40 rounded-2xl px-6 py-2.5 shadow-xs">
            <span className="text-[11px] uppercase tracking-widest text-amber-800 dark:text-amber-300 font-bold block">
              अतिथि देवो भव • Heartiest Welcome
            </span>
            <span className="font-serif font-extrabold text-base sm:text-lg text-rose-900 dark:text-amber-100">
              {recipientName}
            </span>
          </div>
        </div>

        {/* Family Formal Invitation Announcement */}
        <div className="text-center space-y-4 max-w-2xl mx-auto my-6">
          <p className="font-serif text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            With the divine grace of Almighty God, the loving blessings of our ancestors, and the joy of togetherness,
          </p>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-900/70 border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
            <p className="font-serif font-bold text-base sm:text-lg text-rose-950 dark:text-amber-200">
              Smt. Sunita Devi &amp; Shri Vikramaditya Singhania
            </p>
            <p className="text-xs text-amber-900 dark:text-amber-400 font-serif italic mt-0.5">
              cordially invite you and your family to celebrate the auspicious wedding ceremony of their beloved son
            </p>
          </div>
        </div>

        {/* ---------------- COUPLE ROYAL BADGE ---------------- */}
        <div className="my-8 relative">
          <div className="bg-gradient-to-r from-rose-950 via-[#4e0917] to-amber-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-xl text-center relative overflow-hidden">
            {/* Background filigree accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-300 uppercase tracking-widest mb-3">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>शुभ विवाह महोत्सव • Auspicious Union</span>
              <Crown className="w-4 h-4 text-amber-300" />
            </div>

            {/* Groom and Bride Names */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-8 my-2">
              {/* Groom */}
              <div className="space-y-1">
                <span className="text-xs text-amber-300 font-serif block">चि. (Chi.)</span>
                <h4 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 tracking-wide drop-shadow-md">
                  {settings.groomName}
                </h4>
                <p className="text-[11px] text-amber-200/80 font-serif max-w-[220px] mx-auto">
                  Grandson of Late Smt. Kamala Devi &amp; Shri Om Prakash Singhania
                </p>
              </div>

              {/* Royal Weds Emblem */}
              <div className="flex flex-col items-center justify-center my-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-rose-950 font-serif font-black shadow-md border-2 border-amber-200">
                  <Heart className="w-6 h-6 fill-rose-950 text-rose-950" />
                </div>
                <span className="text-xs text-amber-200 font-serif font-bold uppercase tracking-widest mt-1">
                  संग (Weds)
                </span>
              </div>

              {/* Bride */}
              <div className="space-y-1">
                <span className="text-xs text-amber-300 font-serif block">सौ. कां. (Sau. Kan.)</span>
                <h4 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 tracking-wide drop-shadow-md">
                  {settings.brideName}
                </h4>
                <p className="text-[11px] text-amber-200/80 font-serif max-w-[220px] mx-auto">
                  Beloved Daughter of Smt. Kavita &amp; Shri Rajesh Mehra
                </p>
              </div>
            </div>

            {/* Vedic Shloka on Holy Knot */}
            <div className="mt-4 pt-3 border-t border-amber-500/30 max-w-xl mx-auto">
              <p className="text-xs text-amber-200/90 font-serif italic">
                ॥ माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना। कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम्॥
              </p>
              <p className="text-[10px] text-amber-300/70 mt-0.5">
                May this sacred bond of seven vows bring endless prosperity, harmony and eternal love.
              </p>
            </div>
          </div>
        </div>

        {/* Wedding Venue & Destination Banner */}
        <div className="my-8 text-center bg-amber-50/80 dark:bg-stone-900/60 border border-amber-300 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-900 dark:text-amber-400 mb-1">
            <MapPin className="w-4 h-4 text-rose-700 dark:text-rose-400" />
            <span>Destination &amp; Royal Venue</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            {settings.venueName}
          </h4>
          <p className="text-sm font-serif text-stone-600 dark:text-stone-300 mt-0.5">
            Haridas Ji Ki Magri, Lake Pichola, {settings.venueCity}, Rajasthan 313001
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-amber-200/60 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 rounded-full font-serif font-bold text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>{settings.weddingDates}</span>
          </div>
        </div>

        {/* ---------------- AUSPICIOUS KARYAKRAM (CEREMONY SCHEDULE) ---------------- */}
        <div className="my-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 block font-serif">
              मांगलिक कार्यक्रम विवरण
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950 dark:text-amber-200">
              Ceremonial Programme &amp; Itinerary
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-serif mt-1">
              Three Days of Grand Celebrations, Royal Banquets &amp; Vedic Traditions
            </p>
          </div>

          <div className="space-y-4">
            {itinerary.map((event, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900/90 border border-amber-200/90 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-400 dark:hover:border-amber-700 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3 mb-3">
                  <div>
                    <span className="text-[11px] font-serif font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                      {event.day}
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-rose-950 dark:text-amber-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {event.title} <span className="font-sans text-xs text-stone-500 dark:text-stone-400 font-normal">({event.englishTitle})</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-900">
                      {event.tag}
                    </span>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Muhurat / Time</span>
                      <strong className="font-semibold">{event.time}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Venue</span>
                      <strong className="font-semibold">{event.venue}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Dress Code</span>
                      <span className="font-semibold">{event.attire}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-stone-600 dark:text-stone-400 italic bg-amber-50/50 dark:bg-stone-950/40 p-2.5 rounded-xl border border-amber-100 dark:border-stone-800">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- TRADITIONAL INDIAN FAMILY SIGN-OFFS ---------------- */}
        <div className="my-8 pt-6 border-t-2 border-dashed border-amber-300 dark:border-amber-900/60 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Darshanabhilashi */}
          <div className="bg-amber-50/70 dark:bg-stone-900/60 p-4 rounded-2xl border border-amber-200 dark:border-stone-800 text-center space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-widest font-black text-rose-900 dark:text-amber-400 block">
              दर्शनाभिलाषी (Darshanabhilashi)
            </span>
            <p className="font-serif font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              Smt. Radha Devi Singhania
            </p>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-serif">
              Late Shri Om Prakash Singhania
            </p>
            <p className="text-[10px] text-amber-800 dark:text-amber-500 font-serif italic">
              And all loving grandparents &amp; elders
            </p>
          </div>

          {/* Bal Manuhar */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-center space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-widest font-black text-rose-800 dark:text-rose-300 block">
              बाल मनुहार (Bal Manuhar)
            </span>
            <p className="font-serif text-xs text-rose-950 dark:text-rose-200 italic leading-snug">
              &ldquo;भेजी है मीठी निमंत्रण पत्रिका, भूल न जाना आना जरूर!<br />
              हमारे प्यारे भैया और दीदी की शादी में धूम मचाना जरूर!&rdquo;
            </p>
            <p className="font-serif font-bold text-[11px] text-rose-900 dark:text-rose-300 mt-1">
              — Reyansh, Ananya &amp; Yuvaan
            </p>
          </div>

          {/* Kripakankshi */}
          <div className="bg-amber-50/70 dark:bg-stone-900/60 p-4 rounded-2xl border border-amber-200 dark:border-stone-800 text-center space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-widest font-black text-rose-900 dark:text-amber-400 block">
              कृपाकांक्षी (Kripakankshi)
            </span>
            <p className="font-serif font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              Samast Singhania &amp; Mehra Parivar
            </p>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-serif">
              Chacha-Chachi, Mama-Mami, Bua-Phupha
            </p>
            <p className="text-[10px] text-amber-800 dark:text-amber-500 font-serif italic">
              Eagerly awaiting your auspicious arrival
            </p>
          </div>
        </div>

        {/* ---------------- FOOD & HOSPITALITY NOTICE ---------------- */}
        <div className="bg-gradient-to-r from-amber-600/10 via-amber-500/15 to-amber-600/10 border border-amber-400/40 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-serif font-bold text-sm">
            <Utensils className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>भोजन प्रसाद एवं विशेष सत्कार (Catering &amp; Hospitality Notice)</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300">
            • <strong>100% Pure Vegetarian Feast:</strong> Prepared with traditional shudh desi ghee, royal Rajasthani Dal Baati Churma, Gujarati delicacies, and global live kitchens.
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            • <strong>Dedicated Jain Kitchen:</strong> Strict Jain counters without onion, garlic, or root vegetables maintained across all three days.
          </p>
          <p className="text-stone-700 dark:text-stone-300">
            • <strong>Hospitality &amp; Airport Desk:</strong> Complimentary luxury shuttle transfers arranged from Maharana Pratap Airport (UDR) and Udaipur City Railway Station.
          </p>
        </div>

        {/* ---------------- RSVP CONTACT FOOTER ---------------- */}
        <div className="mt-8 pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-900 dark:text-amber-400">
              R.S.V.P &amp; HOSPITALITY DESK
            </span>
            <p className="font-serif font-semibold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              Singhania Wedding Coordination Desk: +91 98201 44521 / +91 97654 32109
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Email: rsvp@vivahbandhan.wedding • Udaipur, Rajasthan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-amber-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </button>
            <button
              onClick={() => downloadWeddingInvitationPdf(settings, recipientName)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
