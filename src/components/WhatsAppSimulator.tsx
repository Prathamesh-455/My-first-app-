import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Utensils,
  Hotel,
  ShieldAlert,
  ArrowRight,
  Info,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  MailCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Guest,
  ChatMessage,
  ParsedRSVP,
  WeddingSettings,
  WeddingDocument,
  ChatAttachment
} from '../types/wedding';
import { SAMPLE_CHAT_TEMPLATES } from '../data/mockGuests';
import { SendMediaModal } from './SendMediaModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { downloadWeddingInvitationPdf } from '../utils/weddingPdfGenerator';

interface WhatsAppSimulatorProps {
  guests: Guest[];
  settings: WeddingSettings;
  documents: WeddingDocument[];
  onUpdateGuestFromRSVP: (guestId: string, parsed: ParsedRSVP, originalText: string) => void;
  onAddNewGuestFromRSVP: (parsed: ParsedRSVP, originalText: string, guestName?: string, phone?: string) => void;
  onMarkInvitationSent: (guestId: string) => void;
  onUploadCustomDocument: (doc: WeddingDocument) => void;
  initialPrompt?: string;
  selectedGuestId?: string;
  onSelectGuestId?: (id: string) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  guests,
  settings,
  documents,
  onUpdateGuestFromRSVP,
  onAddNewGuestFromRSVP,
  onMarkInvitationSent,
  onUploadCustomDocument,
  initialPrompt,
  selectedGuestId,
  onSelectGuestId,
}) => {
  const [activeGuestId, setActiveGuestId] = useState<string>(selectedGuestId || guests[0]?.id || 'new');
  const [inputText, setInputText] = useState<string>(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<ChatAttachment | null>(null);
  const [lastParsedResult, setLastParsedResult] = useState<{
    parsed: ParsedRSVP;
    engine: string;
    guestName: string;
  } | null>(null);

  // Sync when initialPrompt or selectedGuestId changes externally
  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (selectedGuestId) {
      setActiveGuestId(selectedGuestId);
    }
  }, [selectedGuestId]);

  const activeGuest = guests.find((g) => g.id === activeGuestId);

  // Chat message history per guest (in-memory state)
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    const initial: Record<string, ChatMessage[]> = {};
    guests.forEach((g) => {
      initial[g.id] = [
        {
          id: `init-bot-${g.id}`,
          sender: 'bot',
          text: `Namaste ${g.name} ji! 🙏✨\n\nWith elders' blessings, we cordially invite you and your family to Aarav & Diya's Wedding in Udaipur (${settings.weddingDates})!\n\nKindly confirm your RSVP, attending members (adults & children), food preference, and if you require hotel accommodation at Udaipur. 🪔`,
          timestamp: '10:30 AM',
          status: 'read',
          attachment: {
            id: 'invitation-pdf',
            title: 'Official Wedding Invitation & Itinerary (PDF)',
            fileName: 'Vivah_Invitation_Aarav_Diya.pdf',
            fileType: 'pdf',
            fileSize: '420 KB',
            pageCount: 2,
            caption: 'Official 2-Page Royal Vivah Patrika & 3-Day Celebrations Schedule',
          },
        },
      ];
      if (g.lastMessage) {
        initial[g.id].push({
          id: `prev-guest-${g.id}`,
          sender: 'guest',
          text: g.lastMessage,
          timestamp: '10:45 AM',
        });
      }
    });

    initial['new'] = [
      {
        id: 'init-bot-new',
        sender: 'bot',
        text: `Namaste! 🙏✨ Welcome to the VivahBandhan automated RSVP bot for Aarav & Diya's Wedding.\n\nPlease share your confirmation, number of guests attending (adults & kids), events you will attend, and hotel room requirements!`,
        timestamp: '10:30 AM',
        status: 'read',
        attachment: {
          id: 'invitation-pdf',
          title: 'Official Wedding Invitation & Itinerary (PDF)',
          fileName: 'Vivah_Invitation_Aarav_Diya.pdf',
          fileType: 'pdf',
          fileSize: '420 KB',
          pageCount: 2,
        },
      },
    ];

    return initial;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, activeGuestId, isProcessing]);

  // Handle sending a text message
  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isProcessing) return;

    setInputText('');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add guest message to chat
    const guestMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'guest',
      text: message,
      timestamp: currentTime,
    };

    setChatHistory((prev) => ({
      ...prev,
      [activeGuestId]: [...(prev[activeGuestId] || []), guestMsg],
    }));

    setIsProcessing(true);

    try {
      // 2. Call server API to parse RSVP using Gemini (with bulletproof server fallback)
      const res = await fetch('/api/parse-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          guestContext: activeGuest
            ? {
                name: activeGuest.name,
                phone: activeGuest.phone,
                invitedEvents: activeGuest.invitedEvents,
                relation: activeGuest.relation,
                familySide: activeGuest.familySide,
              }
            : { name: 'Wedding Guest' },
        }),
      });

      const json = await res.json();
      const parsed: ParsedRSVP = json.data;
      const engine = json.engine || 'AI Engine';

      setLastParsedResult({
        parsed,
        engine,
        guestName: activeGuest?.name || 'New Guest',
      });

      // 3. Trigger celebratory confetti if RSVP is confirmed!
      if (parsed.attending && parsed.totalMembers > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#10b981', '#6366f1'],
        });
      }

      // 4. Update the live host dashboard & guest store!
      if (activeGuest) {
        onUpdateGuestFromRSVP(activeGuest.id, parsed, message);
      } else {
        // Unknown guest simulator
        onAddNewGuestFromRSVP(parsed, message, 'Simulated Guest (WhatsApp)', '+91 99999 00000');
      }

      // 5. Bot reply after natural typing delay
      setTimeout(() => {
        const botReplyText =
          parsed.replySuggestion ||
          `Namaste! 🙏 We have noted your confirmation of ${parsed.totalMembers} guests for ${parsed.events.join(
            ', '
          )}. Looking forward to celebrating with you! ✨`;

        const botMsg: ChatMessage = {
          id: `bot-reply-${Date.now()}`,
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          parsedData: parsed,
        };

        setChatHistory((prev) => ({
          ...prev,
          [activeGuestId]: [...(prev[activeGuestId] || []), botMsg],
        }));

        setIsProcessing(false);
      }, 700);
    } catch (err) {
      console.error('Error processing RSVP:', err);
      setIsProcessing(false);
    }
  };

  // Handle sending an attachment (PDF or Image from Wedding Database)
  const handleSendAttachment = (attachment: ChatAttachment, caption: string) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const attachmentMsg: ChatMessage = {
      id: `att-msg-${Date.now()}`,
      sender: 'bot',
      text: caption,
      timestamp: currentTime,
      status: 'read',
      attachment,
    };

    setChatHistory((prev) => ({
      ...prev,
      [activeGuestId]: [...(prev[activeGuestId] || []), attachmentMsg],
    }));

    if (activeGuest) {
      onMarkInvitationSent(activeGuest.id);
    }
  };

  // Quick helper to download attachment directly
  const handleDownloadAttachment = (attachment: ChatAttachment) => {
    if (attachment.fileType === 'pdf') {
      downloadWeddingInvitationPdf(settings, activeGuest?.name, attachment.fileName);
    } else if (attachment.dataUrl) {
      const link = document.createElement('a');
      link.href = attachment.dataUrl;
      link.download = attachment.fileName;
      link.click();
    }
  };

  const currentMessages = chatHistory[activeGuestId] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Guest selector & Prompt presets (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Guest Selector Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-800 dark:text-rose-400" />
              <span>Select Guest to Simulate</span>
            </h3>
            <span className="text-[11px] text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full font-mono">
              {guests.length} in list
            </span>
          </div>

          <select
            value={activeGuestId}
            onChange={(e) => {
              setActiveGuestId(e.target.value);
              if (onSelectGuestId) onSelectGuestId(e.target.value);
            }}
            className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 cursor-pointer"
          >
            <option value="new">➕ Simulate New / Unlisted Guest</option>
            <optgroup label="Groom's Side (Ladkewale)">
              {guests
                .filter((g) => g.familySide === 'Groom')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.status.toUpperCase()}) {g.invitationSent ? '• ✉️ Sent' : ''}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Bride's Side (Ladkiwale)">
              {guests
                .filter((g) => g.familySide === 'Bride')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.status.toUpperCase()}) {g.invitationSent ? '• ✉️ Sent' : ''}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Mutual Friends">
              {guests
                .filter((g) => g.familySide === 'Mutual')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.status.toUpperCase()}) {g.invitationSent ? '• ✉️ Sent' : ''}
                  </option>
                ))}
            </optgroup>
          </select>

          {activeGuest && (
            <div className="mt-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Relation:</span>
                <strong className="text-stone-800 dark:text-stone-200">{activeGuest.relation}</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Invitation PDF:</span>
                {activeGuest.invitationSent ? (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <MailCheck className="w-3.5 h-3.5" /> Sent to Guest
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold">Not sent yet</span>
                )}
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Current Status:</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-medium ${
                    activeGuest.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeGuest.status === 'declined'
                      ? 'bg-stone-200 text-stone-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeGuest.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Dedicated "Send Official Invitation PDF" Quick Button */}
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="w-full mt-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Paperclip className="w-4 h-4 text-emerald-200" />
            <span>Send Invitation PDF / Media from Database</span>
          </button>
        </div>

        {/* Quick Sample Prompts to test AI parsing */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Test Prompts (Click to Send)</span>
            </h4>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            Click any message below to watch the AI parser extract data and update the live dashboard:
          </p>

          <div className="space-y-2">
            {SAMPLE_CHAT_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(tpl.message);
                  handleSendMessage(tpl.message);
                }}
                disabled={isProcessing}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-300 transition-all text-xs group cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between font-semibold text-stone-800 group-hover:text-emerald-900">
                  <span>{tpl.label}</span>
                  <span className="text-[10px] bg-stone-200 group-hover:bg-emerald-200 text-stone-700 group-hover:text-emerald-800 px-1.5 py-0.5 rounded">
                    {tpl.tag}
                  </span>
                </div>
                <p className="text-stone-600 mt-1 italic group-hover:text-emerald-800 line-clamp-2">
                  "{tpl.message}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* PDF Feature Highlight Card */}
        <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl p-4 border border-amber-200 text-xs space-y-2 text-stone-700">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <FileText className="w-4 h-4 text-rose-700" />
            <span>Digital PDF Invitations In Software</span>
          </div>
          <p>
            The software has pre-saved <strong>Vivah_Invitation_Aarav_Diya.pdf</strong> with full itinerary, shlokas &amp; dress codes. Click the paperclip icon (📎) or button above to send it in WhatsApp chat!
          </p>
        </div>
      </div>

      {/* Center Column: WhatsApp Simulated Phone Mockup (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-stone-300 overflow-hidden flex flex-col h-[670px]">
        {/* WhatsApp Top Header Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400/60 flex items-center justify-center text-white font-bold text-sm shadow">
                {activeGuest?.name ? activeGuest.name.slice(0, 2).toUpperCase() : 'WG'}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#075E54]"></span>
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight text-white">
                {activeGuest?.name || 'Wedding Guest (WhatsApp)'}
              </h4>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span>{activeGuest?.phone || '+91 98201 44521'}</span>
                <span>• online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-emerald-100">
            {/* Quick Send PDF button in header */}
            <button
              onClick={() => setIsMediaModalOpen(true)}
              title="Send Wedding Invitation PDF from Software"
              className="bg-emerald-700/80 hover:bg-emerald-600 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-200 flex items-center gap-1 border border-emerald-500/50 transition-all cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Send PDF</span>
            </button>
            <Video className="w-4 h-4 hover:text-white cursor-pointer" />
            <Phone className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Chat Message Wallpaper & Message Stream */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2] relative"
          style={{
            backgroundImage: `radial-gradient(#d5cdc4 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {/* Security / Encryption banner */}
          <div className="text-center my-2">
            <span className="bg-[#ffeecd] text-stone-700 text-[10px] px-3 py-1 rounded-md shadow-xs inline-block max-w-[90%]">
              🔒 Connected via VivahBandhan WhatsApp Assistant. Send PDF invites &amp; receive instant RSVPs.
            </span>
          </div>

          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'guest' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 shadow-sm text-sm relative ${
                  msg.sender === 'guest'
                    ? 'bg-[#d9fdd3] text-stone-900 rounded-tr-none'
                    : 'bg-white text-stone-900 rounded-tl-none border border-stone-200/50'
                }`}
              >
                {/* Sender badge if bot */}
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 mb-1.5">
                    <Bot className="w-3 h-3" />
                    <span>VivahBandhan Wedding Bot</span>
                  </div>
                )}

                {/* ATTACHMENT CARD (PDF or Image) */}
                {msg.attachment && (
                  <div className="mb-2 bg-stone-50 rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                    {msg.attachment.fileType === 'pdf' ? (
                      <div>
                        <div className="p-3 flex items-start gap-3 bg-gradient-to-r from-rose-50/70 to-amber-50/40 border-b border-stone-200/80">
                          <div className="w-10 h-10 rounded-lg bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-stone-900 truncate">
                              {msg.attachment.title}
                            </h5>
                            <p className="text-[11px] text-stone-500 font-mono">
                              {msg.attachment.fileName} • {msg.attachment.fileSize}
                              {msg.attachment.pageCount ? ` • ${msg.attachment.pageCount} Pages` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons inside the PDF card */}
                        <div className="bg-white p-2 flex items-center justify-between text-xs gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(msg.attachment!)}
                            className="flex-1 py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-600" />
                            <span>Preview Invite</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(msg.attachment!)}
                            className="flex-1 py-1 px-2.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-amber-200 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Image preview thumbnail */}
                        <div
                          onClick={() => setPreviewAttachment(msg.attachment!)}
                          className="max-h-48 overflow-hidden bg-stone-900 flex items-center justify-center cursor-pointer relative group"
                        >
                          <img
                            src={msg.attachment.dataUrl}
                            alt={msg.attachment.title}
                            className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>Click to Zoom &amp; View</span>
                          </div>
                        </div>

                        <div className="p-2 bg-white flex items-center justify-between text-xs border-t border-stone-200">
                          <span className="font-semibold text-stone-800 text-[11px] truncate max-w-[170px]">
                            {msg.attachment.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDownloadAttachment(msg.attachment!)}
                            className="text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save Image</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Message */}
                <p className="whitespace-pre-line leading-relaxed text-[13px]">{msg.text}</p>

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-stone-600">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                  )}
                  {msg.sender === 'guest' && (
                    <CheckCheck className="w-3.5 h-3.5 text-stone-500 inline" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isProcessing && (
            <div className="flex items-start">
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Wedding Bot is parsing RSVP details...</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Bottom Input Bar with Attachment Paperclip */}
        <div className="bg-[#f0f2f5] p-3 border-t border-stone-200 flex items-center gap-2">
          <Smile className="w-5 h-5 text-stone-500 hover:text-stone-700 cursor-pointer shrink-0" />

          {/* Attachment Paperclip Icon Button */}
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            title="Attach Wedding Invitation PDF or Card from Database"
            className="p-1 rounded-full text-emerald-700 hover:text-emerald-900 hover:bg-stone-200 transition-colors cursor-pointer shrink-0 relative"
          >
            <Paperclip className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a guest reply (e.g. 4 of us coming for reception)..."
            disabled={isProcessing}
            className="flex-1 bg-white border border-stone-300 rounded-full px-4 py-2 text-sm text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isProcessing}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() && !isProcessing
                ? 'bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md active:scale-95 cursor-pointer'
                : 'bg-stone-300 text-stone-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: AI Extraction Inspector & Live Sync Feedback (3 cols) */}
      <div className="lg:col-span-3 space-y-4">
        {/* Live Extracted Structured Data Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-800" />
              <span>AI Parsing Inspector</span>
            </h4>
            {lastParsedResult && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
                {lastParsedResult.engine}
              </span>
            )}
          </div>

          {lastParsedResult ? (
            <div className="space-y-3">
              {/* Confirmed / Declined Status */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  lastParsedResult.parsed.attending
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-stone-100 border-stone-300 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      lastParsedResult.parsed.attending ? 'text-emerald-600' : 'text-stone-500'
                    }`}
                  />
                  <span className="font-bold text-xs">
                    {lastParsedResult.parsed.attending ? 'ATTENDING CONFIRMED' : 'DECLINED / REGRETS'}
                  </span>
                </div>
                <span className="text-[11px] font-mono">
                  {Math.round((lastParsedResult.parsed.confidence || 0.95) * 100)}% match
                </span>
              </div>

              {/* Headcount breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-700 block uppercase font-medium">Total</span>
                  <span className="text-lg font-bold font-serif text-stone-900">
                    {lastParsedResult.parsed.totalMembers}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-700 block uppercase font-medium">Adults</span>
                  <span className="text-lg font-bold font-serif text-rose-900">
                    {lastParsedResult.parsed.adults}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-700 block uppercase font-medium">Children</span>
                  <span className="text-lg font-bold font-serif text-amber-700">
                    {lastParsedResult.parsed.children}
                  </span>
                </div>
              </div>

              {/* Events Detected */}
              <div>
                <span className="text-[11px] text-stone-700 font-semibold block mb-1">
                  Confirmed Events:
                </span>
                <div className="flex flex-wrap gap-1">
                  {lastParsedResult.parsed.events.length > 0 ? (
                    lastParsedResult.parsed.events.map((ev) => (
                      <span
                        key={ev}
                        className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {ev}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-600 text-xs italic">None (Declined)</span>
                  )}
                </div>
              </div>

              {/* Dietary & Hotel Room Requirement */}
              <div className="space-y-1.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-stone-700">
                    <Utensils className="w-3.5 h-3.5 text-rose-800" /> Food:
                  </span>
                  <strong className="text-stone-900">{lastParsedResult.parsed.dietaryPreference}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-stone-700">
                    <Hotel className="w-3.5 h-3.5 text-indigo-700" /> Hotel Rooms:
                  </span>
                  <strong className="text-stone-900">
                    {lastParsedResult.parsed.roomsRequired > 0
                      ? `${lastParsedResult.parsed.roomsRequired} Rooms`
                      : 'None'}
                  </strong>
                </div>
              </div>

              {/* Live Synchronized Confirmation Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>
                  <strong>Host Dashboard Updated!</strong> Confirmed guests, adults, kids, and catering counts are in sync.
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-600 space-y-2">
              <Bot className="w-8 h-8 mx-auto text-stone-400" />
              <p className="text-xs">
                No message parsed yet. Click any test prompt on the left to see the structured data output!
              </p>
            </div>
          )}
        </div>

        {/* Database Media Quick-Send Widget */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-amber-400" />
              Wedding Documents in Software
            </span>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full font-mono">
              {documents.length} files
            </span>
          </div>

          <div className="space-y-2">
            {documents.slice(0, 3).map((d) => (
              <div
                key={d.id}
                onClick={() => setIsMediaModalOpen(true)}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 transition-all cursor-pointer flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {d.fileType === 'pdf' ? (
                    <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                  <span className="truncate text-stone-200 group-hover:text-white font-medium text-[11px]">
                    {d.title}
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold shrink-0 ml-1">
                  Send &rarr;
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold py-1.5 px-3 rounded-xl text-xs transition-all cursor-pointer"
          >
            Open Media Database Modal
          </button>
        </div>
      </div>

      {/* Send Media Modal */}
      <SendMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        documents={documents}
        recipientName={activeGuest?.name || 'Wedding Guest'}
        settings={settings}
        onSendAttachment={handleSendAttachment}
        onUploadCustomDocument={onUploadCustomDocument}
      />

      {/* Full Screen Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        settings={settings}
        guestName={activeGuest?.name}
      />
    </div>
  );
};
