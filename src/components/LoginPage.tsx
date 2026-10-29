import React, { useState } from 'react';
import {
  Crown,
  Heart,
  Mail,
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  RefreshCw,
  Send,
  AlertCircle
} from 'lucide-react';
import { Guest, WeddingSettings, CurrentUser } from '../types/wedding';

interface LoginPageProps {
  settings: WeddingSettings;
  guests: Guest[];
  onLogin: (user: CurrentUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ settings, guests, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'host' | 'guest'>('host');

  // Host Form State
  const [hostName, setHostName] = useState<string>('Aarav Singhania');
  const [hostEmail, setHostEmail] = useState<string>('host@singhaniawedding.in');
  const [hostOtp, setHostOtp] = useState<string>('');
  const [generatedHostOtp, setGeneratedHostOtp] = useState<string>('');
  const [isHostOtpSent, setIsHostOtpSent] = useState<boolean>(false);
  const [hostError, setHostError] = useState<string>('');

  // Guest Form State
  const [guestName, setGuestName] = useState<string>(guests[0]?.name || 'Rajesh & Sunita Chacha');
  const [guestEmail, setGuestEmail] = useState<string>('rajesh.chacha@gmail.com');
  const [selectedGuestId, setSelectedGuestId] = useState<string>(guests[0]?.id || '');
  const [guestOtp, setGuestOtp] = useState<string>('');
  const [generatedGuestOtp, setGeneratedGuestOtp] = useState<string>('');
  const [isGuestOtpSent, setIsGuestOtpSent] = useState<boolean>(false);
  const [guestError, setGuestError] = useState<string>('');

  // Handle Host OTP generation
  const handleSendHostOtp = () => {
    if (!hostName.trim()) {
      setHostError('Please enter your Host Name');
      return;
    }
    if (!hostEmail.trim() || !hostEmail.includes('@')) {
      setHostError('Please enter a valid Email address');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedHostOtp(code);
    setHostOtp(code); // Pre-fill for frictionless testing
    setIsHostOtpSent(true);
    setHostError('');
  };

  // Handle Host Login submit
  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setHostError('Please enter your name');
      return;
    }
    if (!hostEmail.trim() || !hostEmail.includes('@')) {
      setHostError('Please enter a valid email address');
      return;
    }
    if (!isHostOtpSent) {
      setHostError('Please click "Send OTP" to receive your verification code');
      return;
    }
    if (hostOtp.trim() !== generatedHostOtp) {
      setHostError('Invalid OTP code. Please enter the generated code.');
      return;
    }

    onLogin({
      role: 'host',
      name: hostName.trim(),
      email: hostEmail.trim(),
      guestName: hostName.trim(),
    });
  };

  // Handle Guest OTP generation
  const handleSendGuestOtp = () => {
    if (!guestName.trim()) {
      setGuestError('Please select or enter your Guest Name');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setGuestError('Please enter a valid Email address');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedGuestOtp(code);
    setGuestOtp(code); // Pre-fill for frictionless testing
    setIsGuestOtpSent(true);
    setGuestError('');
  };

  // Handle Guest Login submit
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setGuestError('Please enter your name');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setGuestError('Please enter a valid email address');
      return;
    }
    if (!isGuestOtpSent) {
      setGuestError('Please click "Send OTP" to receive your verification code');
      return;
    }
    if (guestOtp.trim() !== generatedGuestOtp) {
      setGuestError('Invalid OTP code. Please enter the generated code.');
      return;
    }

    const matched = guests.find((g) => g.id === selectedGuestId || g.name === guestName);
    onLogin({
      role: 'guest',
      name: guestName.trim(),
      email: guestEmail.trim(),
      guestId: matched?.id,
      guestName: guestName.trim(),
    });
  };

  // Quick 1-click Demo Fillers
  const fillHostDemo = () => {
    setHostName('Aarav Singhania (Groom)');
    setHostEmail('aarav.singhania@wedding.in');
    const code = '7429';
    setGeneratedHostOtp(code);
    setHostOtp(code);
    setIsHostOtpSent(true);
    setHostError('');
  };

  const fillGuestDemo = () => {
    const guest = guests[0] || { name: 'Rajesh & Sunita Chacha', id: 'guest-1' };
    setSelectedGuestId(guest.id);
    setGuestName(guest.name);
    setGuestEmail('rajesh.chacha@gmail.com');
    const code = '5831';
    setGeneratedGuestOtp(code);
    setGuestOtp(code);
    setIsGuestOtpSent(true);
    setGuestError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0208] via-[#4a0712] to-[#1a0105] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-300 selection:text-rose-950">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-serif tracking-widest uppercase mb-3 shadow-inner">
          <span>|| श्री गणेशाय नमः ||</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 tracking-wide drop-shadow-md">
          {settings.coupleNames}
        </h1>
        <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mt-1">
          ShubhMangal • Secure Verification &amp; RSVP Portal
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-rose-300/80 font-sans mt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {settings.weddingDates}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {settings.venueCity}
          </span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl mx-auto w-full my-6 bg-white/95 text-stone-900 rounded-3xl shadow-2xl border border-amber-400/50 backdrop-blur-md overflow-hidden">
        {/* Authority Selection Tabs */}
        <div className="grid grid-cols-2 p-2 bg-stone-100 border-b border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab('host')}
            className={`py-3 px-4 rounded-2xl font-serif text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'host'
                ? 'bg-gradient-to-r from-rose-950 to-amber-950 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Host Authority</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guest')}
            className={`py-3 px-4 rounded-2xl font-serif text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guest'
                ? 'bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-200 shadow-md ring-1 ring-emerald-400/40'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Wedding Guest</span>
          </button>
        </div>

        {/* HOST LOGIN FORM */}
        {activeTab === 'host' && (
          <form onSubmit={handleHostSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <span>Host &amp; Organizer Login</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    Full Admin &amp; Budget Access
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={fillHostDemo}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
                >
                  ⚡ Quick Demo Fill
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage guest directory, hotel room blocks, and view the protected catering budget.
              </p>
            </div>

            {hostError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{hostError}</span>
              </div>
            )}

            {/* Name Section */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Host / Family Head Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Aarav Singhania"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Email Section */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Host Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={hostEmail}
                  onChange={(e) => setHostEmail(e.target.value)}
                  placeholder="e.g. host@singhaniawedding.in"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* OTP Section */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>One-Time Password (OTP) Verification</span>
                </label>
                <button
                  type="button"
                  onClick={handleSendHostOtp}
                  className="bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{isHostOtpSent ? 'Resend OTP' : 'Send OTP'}</span>
                </button>
              </div>

              {isHostOtpSent && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
                  <span>
                    Simulated OTP sent: <strong className="font-mono text-sm tracking-widest">{generatedHostOtp}</strong>
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.5 rounded">
                    Auto-Filled
                  </span>
                </div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={hostOtp}
                  onChange={(e) => setHostOtp(e.target.value)}
                  placeholder="Enter 4-digit OTP code"
                  className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-base tracking-widest text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-200 font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer mt-2"
            >
              <span>Verify OTP &amp; Enter Host Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* GUEST LOGIN FORM */}
        {activeTab === 'guest' && (
          <form onSubmit={handleGuestSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <span>Wedding Guest Login</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    Guest Portal
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={fillGuestDemo}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                >
                  ⚡ Quick Demo Fill
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Download your official wedding invitation PDF, view 3-day events, and manage your RSVP.
              </p>
            </div>

            {guestError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{guestError}</span>
              </div>
            )}

            {/* Quick Guest Selector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Select Your Invited Family / Name:
              </label>
              <select
                value={selectedGuestId}
                onChange={(e) => {
                  setSelectedGuestId(e.target.value);
                  const g = guests.find((x) => x.id === e.target.value);
                  if (g) {
                    setGuestName(g.name);
                    setGuestEmail(`${g.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`);
                  }
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <optgroup label="Groom's Side (Ladkewale)">
                  {guests
                    .filter((g) => g.familySide === 'Groom')
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.relation})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Bride's Side (Ladkiwale)">
                  {guests
                    .filter((g) => g.familySide === 'Bride')
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.relation})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Mutual Friends">
                  {guests
                    .filter((g) => g.familySide === 'Mutual')
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.relation})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Name Section */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Guest Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rajesh & Sunita Chacha"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email Section */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Guest Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. guest@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* OTP Section */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                  <span>One-Time Password (OTP) Verification</span>
                </label>
                <button
                  type="button"
                  onClick={handleSendGuestOtp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{isGuestOtpSent ? 'Resend OTP' : 'Send OTP'}</span>
                </button>
              </div>

              {isGuestOtpSent && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
                  <span>
                    Simulated OTP sent: <strong className="font-mono text-sm tracking-widest">{generatedGuestOtp}</strong>
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.5 rounded">
                    Auto-Filled
                  </span>
                </div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={guestOtp}
                  onChange={(e) => setGuestOtp(e.target.value)}
                  placeholder="Enter 4-digit OTP code"
                  className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-base tracking-widest text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Note on budget protection */}
            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-600 text-[11px] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Catering budget and financial calculations are protected and viewable by Host only.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer mt-2"
            >
              <span>Verify OTP &amp; Enter Guest Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs text-rose-300/60">
        <p>
          ShubhMangal • Secure Email &amp; OTP Authentication • Host vs. Wedding Guest Authority System
        </p>
      </div>
    </div>
  );
};
