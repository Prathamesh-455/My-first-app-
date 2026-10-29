export type WeddingEvent = 'Mehendi' | 'Sangeet' | 'Haldi' | 'Wedding' | 'Reception';

export type FamilySide = 'Groom' | 'Bride' | 'Mutual';

export type RSVPStatus = 'confirmed' | 'declined' | 'pending' | 'tentative';

export type UserRole = 'host' | 'guest';

export type AppTab = 'dashboard' | 'guests' | 'simulator' | 'catering' | 'rooms' | 'invitation';

export interface CurrentUser {
  role: UserRole;
  name: string;
  email: string;
  guestId?: string;
  guestName?: string;
}

export type DietaryPreference = 'Pure Veg' | 'Jain' | 'Non-Veg' | 'Vegan' | 'Not Specified';

export interface WeddingDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  description: string;
  dataUrl?: string;
  pageCount?: number;
  category?: 'invitation' | 'itinerary' | 'pass' | 'menu';
  isCustomUpload?: boolean;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  familySide: FamilySide;
  relation: string;
  vipStatus?: boolean;
  status: RSVPStatus;
  invitedEvents: WeddingEvent[];
  confirmedEvents: WeddingEvent[];
  totalMembers: number;
  adults: number;
  children: number;
  dietary: DietaryPreference;
  hotelNeeded: boolean;
  roomsRequired: number;
  roomCheckIn?: string;
  roomCheckOut?: string;
  allocatedRoomNumbers?: string[];
  notes?: string;
  lastMessage?: string;
  invitationSent?: boolean;
  invitationSentAt?: string;
  updatedAt: string;
}

export interface ParsedRSVP {
  attending: boolean;
  totalMembers: number;
  adults: number;
  children: number;
  events: WeddingEvent[];
  dietaryPreference: DietaryPreference;
  roomsRequired: number;
  roomCheckIn?: string;
  roomCheckOut?: string;
  notes?: string;
  confidence: number;
  detectedGuestName?: string;
  replySuggestion?: string;
}

export interface ChatAttachment {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  dataUrl?: string;
  pageCount?: number;
  caption?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'bot' | 'host';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  parsedData?: ParsedRSVP;
  attachment?: ChatAttachment;
  isQuickPrompt?: boolean;
}

export interface WeddingSettings {
  coupleNames: string;
  groomName: string;
  brideName: string;
  weddingDates: string;
  venueName: string;
  venueCity: string;
  totalRoomsBlocked: number;
  cateringPerPlateBudget: number;
}
