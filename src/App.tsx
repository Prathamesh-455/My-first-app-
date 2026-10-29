import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { StatsOverview } from './components/StatsOverview';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { GuestList } from './components/GuestList';
import { CateringPlanner } from './components/CateringPlanner';
import { RoomAllotment } from './components/RoomAllotment';
import { InvitationLetter } from './components/InvitationLetter';
import { GuestModal } from './components/GuestModal';
import { SettingsModal } from './components/SettingsModal';
import { exportGuestsToCSV } from './utils/exportCsv';
import {
  Guest,
  WeddingSettings,
  ParsedRSVP,
  RSVPStatus,
  WeddingDocument,
  CurrentUser,
  AppTab
} from './types/wedding';
import { INITIAL_GUESTS, DEFAULT_SETTINGS } from './data/mockGuests';
import { INITIAL_WEDDING_DOCUMENTS } from './data/weddingMediaDatabase';

const GUESTS_STORAGE_KEY = 'vivah_bandhan_guests_v1';
const SETTINGS_STORAGE_KEY = 'vivah_bandhan_settings_v1';
const DOCUMENTS_STORAGE_KEY = 'vivah_bandhan_documents_v1';
const USER_STORAGE_KEY = 'vivah_bandhan_current_user_v1';

export default function App() {
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(GUESTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved guests:', e);
    }
    return INITIAL_GUESTS;
  });

  const [settings, setSettings] = useState<WeddingSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [documents, setDocuments] = useState<WeddingDocument[]>(() => {
    try {
      const saved = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved documents:', e);
    }
    return INITIAL_WEDDING_DOCUMENTS;
  });

  // Current authority role: 'host' or 'guest'.
  // Initialized to null so LoginPage is strictly the FIRST interface shown when opening the app!
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  // Modals
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // WhatsApp simulator specific trigger state
  const [simulatorSelectedGuestId, setSimulatorSelectedGuestId] = useState<string>(
    currentUser?.guestId || guests[0]?.id || 'new'
  );
  const [simulatorInitialPrompt, setSimulatorInitialPrompt] = useState<string>('');

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('shubhmangal_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      console.warn('Failed to parse theme:', e);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('shubhmangal_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Failed to apply theme:', e);
    }
  }, [theme]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [guests]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.warn('LocalStorage documents save failed:', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage user save failed:', e);
    }
  }, [currentUser]);

  // Handle Login Role Selection
  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);

    if (user.role === 'guest') {
      // For guest, immediately show the personalized royal Indian invitation letter
      setActiveTab('invitation');
      if (user.guestId) {
        setSimulatorSelectedGuestId(user.guestId);
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  // Handle Logout / Switch Role
  const handleSwitchRole = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // Handle live RSVP update from WhatsApp Simulator
  const handleUpdateGuestFromRSVP = (guestId: string, parsed: ParsedRSVP, originalText: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;

        const isAttending = parsed.attending;
        return {
          ...g,
          status: isAttending ? 'confirmed' : 'declined',
          totalMembers: isAttending ? parsed.totalMembers : 0,
          adults: isAttending ? parsed.adults : 0,
          children: isAttending ? parsed.children : 0,
          confirmedEvents: isAttending ? parsed.events : [],
          dietary: parsed.dietaryPreference || g.dietary,
          hotelNeeded: isAttending && parsed.roomsRequired > 0,
          roomsRequired: isAttending ? parsed.roomsRequired : 0,
          roomCheckIn: parsed.roomCheckIn || g.roomCheckIn,
          roomCheckOut: parsed.roomCheckOut || g.roomCheckOut,
          notes: parsed.notes ? `${g.notes ? g.notes + ' • ' : ''}${parsed.notes}` : g.notes,
          lastMessage: originalText,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Add new guest from simulated WhatsApp message
  const handleAddNewGuestFromRSVP = (
    parsed: ParsedRSVP,
    originalText: string,
    guestName = 'Simulated Guest (WhatsApp)',
    phone = '+91 99999 00000'
  ) => {
    const isAttending = parsed.attending;
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      name: parsed.detectedGuestName || guestName,
      phone,
      familySide: 'Mutual',
      relation: 'Invited Guest',
      vipStatus: false,
      status: isAttending ? 'confirmed' : 'declined',
      invitedEvents: ['Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception'],
      confirmedEvents: isAttending ? parsed.events : [],
      totalMembers: isAttending ? parsed.totalMembers : 0,
      adults: isAttending ? parsed.adults : 0,
      children: isAttending ? parsed.children : 0,
      dietary: parsed.dietaryPreference || 'Pure Veg',
      hotelNeeded: isAttending && parsed.roomsRequired > 0,
      roomsRequired: isAttending ? parsed.roomsRequired : 0,
      notes: parsed.notes || originalText,
      lastMessage: originalText,
      updatedAt: new Date().toISOString(),
    };

    setGuests((prev) => [newGuest, ...prev]);
  };

  // Mark invitation sent to a guest
  const handleMarkInvitationSent = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              invitationSent: true,
              invitationSentAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : g
      )
    );
  };

  // Upload custom document to database
  const handleUploadCustomDocument = (doc: WeddingDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  // Add or Edit guest from Modal
  const handleSaveGuestModal = (guestData: Partial<Guest>) => {
    if (editingGuest) {
      setGuests((prev) =>
        prev.map((g) => (g.id === editingGuest.id ? ({ ...g, ...guestData, updatedAt: new Date().toISOString() } as Guest) : g))
      );
    } else {
      const newGuest: Guest = {
        id: `guest-${Date.now()}`,
        name: guestData.name || 'New Guest',
        phone: guestData.phone || '',
        familySide: guestData.familySide || 'Groom',
        relation: guestData.relation || 'Guest',
        vipStatus: !!guestData.vipStatus,
        status: guestData.status || 'confirmed',
        invitedEvents: guestData.invitedEvents || ['Wedding', 'Reception'],
        confirmedEvents: guestData.confirmedEvents || ['Wedding', 'Reception'],
        totalMembers: guestData.totalMembers || 2,
        adults: guestData.adults || 2,
        children: guestData.children || 0,
        dietary: guestData.dietary || 'Pure Veg',
        hotelNeeded: !!guestData.hotelNeeded,
        roomsRequired: guestData.roomsRequired || 0,
        roomCheckIn: guestData.roomCheckIn,
        roomCheckOut: guestData.roomCheckOut,
        allocatedRoomNumbers: guestData.allocatedRoomNumbers || [],
        notes: guestData.notes,
        invitationSent: false,
        updatedAt: new Date().toISOString(),
      };
      setGuests((prev) => [newGuest, ...prev]);
    }
    setEditingGuest(null);
  };

  // Delete guest
  const handleDeleteGuest = (id: string) => {
    if (window.confirm('Are you sure you want to remove this guest from the wedding list?')) {
      setGuests((prev) => prev.filter((g) => g.id !== id));
    }
  };

  // Quick RSVP status toggle
  const handleUpdateStatus = (id: string, newStatus: RSVPStatus) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return {
          ...g,
          status: newStatus,
          totalMembers: newStatus === 'declined' ? 0 : g.totalMembers || 2,
          adults: newStatus === 'declined' ? 0 : g.adults || 2,
          children: newStatus === 'declined' ? 0 : g.children || 0,
          confirmedEvents: newStatus === 'confirmed' ? g.invitedEvents : [],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Switch to simulator with a specific guest and prompt
  const handleSimulateGuestChat = (guestId: string, prompt?: string) => {
    setSimulatorSelectedGuestId(guestId);
    if (prompt) {
      setSimulatorInitialPrompt(prompt);
    }
    setActiveTab('simulator');
  };

  // Update room allotment
  const handleUpdateGuestRooms = (guestId: string, roomsRequired: number, roomNumbers: string[]) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? {
              ...g,
              roomsRequired,
              allocatedRoomNumbers: roomNumbers,
              updatedAt: new Date().toISOString(),
            }
          : g
      )
    );
  };

  // Reset to initial sample data
  const handleResetData = () => {
    if (window.confirm('Reset guest list and settings back to original sample data?')) {
      setGuests(INITIAL_GUESTS);
      setSettings(DEFAULT_SETTINGS);
      setDocuments(INITIAL_WEDDING_DOCUMENTS);
      localStorage.removeItem(GUESTS_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
      handleSwitchRole();
    }
  };

  // REQUIREMENT: "add the login page as the first interface before opening the app"
  if (!currentUser) {
    return (
      <LoginPage
        settings={settings}
        guests={guests}
        onLogin={handleLogin}
      />
    );
  }

  // Confirmed counts
  const confirmedCount = guests.filter((g) => g.status === 'confirmed').length;
  const totalRoomsRequired = guests
    .filter((g) => g.status === 'confirmed')
    .reduce((sum, g) => sum + (g.roomsRequired || 0), 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-stone-950 text-stone-100' : 'bg-[#fcfbfa] text-stone-900'} font-sans flex flex-col selection:bg-amber-200 selection:text-amber-950 transition-colors duration-200`}>
      {/* Top Navbar with Navigation Menu Button */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        currentUser={currentUser}
        onOpenAddGuest={() => {
          setEditingGuest(null);
          setIsGuestModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExportCsv={() => exportGuestsToCSV(guests, settings.coupleNames)}
        onResetData={handleResetData}
        totalConfirmedGuests={confirmedCount}
        totalGuests={guests.length}
        totalRoomsRequired={totalRoomsRequired}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <StatsOverview
            guests={guests}
            settings={settings}
            onOpenAddGuest={() => {
              setEditingGuest(null);
              setIsGuestModalOpen(true);
            }}
            onExportCsv={() => exportGuestsToCSV(guests, settings.coupleNames)}
          />
        )}

        {activeTab === 'simulator' && (
          <WhatsAppSimulator
            guests={guests}
            settings={settings}
            documents={documents}
            onUpdateGuestFromRSVP={handleUpdateGuestFromRSVP}
            onAddNewGuestFromRSVP={handleAddNewGuestFromRSVP}
            onMarkInvitationSent={handleMarkInvitationSent}
            onUploadCustomDocument={handleUploadCustomDocument}
            initialPrompt={simulatorInitialPrompt}
            selectedGuestId={simulatorSelectedGuestId}
            onSelectGuestId={(id) => setSimulatorSelectedGuestId(id)}
          />
        )}

        {/* GUEST DIRECTORY: Host Only (For guests, replaced by Invitation Letter) */}
        {activeTab === 'guests' && (
          currentUser.role === 'host' ? (
            <GuestList
              guests={guests}
              settings={settings}
              onOpenAddGuest={() => {
                setEditingGuest(null);
                setIsGuestModalOpen(true);
              }}
              onEditGuest={(guest) => {
                setEditingGuest(guest);
                setIsGuestModalOpen(true);
              }}
              onDeleteGuest={handleDeleteGuest}
              onSimulateGuestChat={(id) => handleSimulateGuestChat(id)}
              onExportCsv={() => exportGuestsToCSV(guests, settings.coupleNames)}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <InvitationLetter
              settings={settings}
              currentUser={currentUser}
              onGoToSimulator={() => setActiveTab('simulator')}
            />
          )
        )}

        {/* INVITATION LETTER: Traditional Indian Style Wedding Patrika */}
        {activeTab === 'invitation' && (
          <InvitationLetter
            settings={settings}
            currentUser={currentUser}
            onGoToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {/* CATERING: userRole is passed so budget is ONLY for host, not for guest */}
        {activeTab === 'catering' && (
          <CateringPlanner
            guests={guests}
            settings={settings}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomAllotment
            guests={guests}
            settings={settings}
            onUpdateGuestRooms={handleUpdateGuestRooms}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-stone-800 dark:text-stone-200 font-serif">ShubhMangal</strong> • Indian Wedding Guest Management &amp; Automated WhatsApp RSVP
          </p>
          <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400">
            <span>
              Logged in as: <strong className="text-stone-800 dark:text-stone-200 capitalize">{currentUser.name}</strong> ({currentUser.role})
            </span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Guest Add/Edit Modal (Host Only) */}
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => {
          setIsGuestModalOpen(false);
          setEditingGuest(null);
        }}
        onSave={handleSaveGuestModal}
        initialGuest={editingGuest}
      />

      {/* Settings Modal (Profile, Wedding Details, Theme, Logout) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={(newTheme) => setTheme(newTheme)}
        onLogout={handleSwitchRole}
        onSwitchRole={handleSwitchRole}
      />
    </div>
  );
}
