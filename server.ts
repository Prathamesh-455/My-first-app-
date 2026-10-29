import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Heuristic fallback NLP parser for resilient parsing (e.g. offline, rate limits, or missing key)
function parseRSVPHeuristically(text: string, guestContext?: any) {
  const lower = text.toLowerCase();

  // Check decline
  const declineKeywords = [
    'won\'t be able',
    'cannot attend',
    'can\'t make it',
    'sorry we won\'t',
    'unable to attend',
    'cannot make it',
    'won\'t attend',
    'will not be able',
    'nahi aa payenge',
    'wont make it',
    'cannot come',
    'won\'t come',
    'regret',
  ];
  const isDeclined = declineKeywords.some((kw) => lower.includes(kw));

  if (isDeclined) {
    return {
      attending: false,
      totalMembers: 0,
      adults: 0,
      children: 0,
      events: [],
      dietaryPreference: 'Not Specified',
      roomsRequired: 0,
      notes: 'Declined with blessings/regrets',
      confidence: 0.95,
      replySuggestion:
        'Thank you so much for letting us know and for sending your heartfelt blessings to Aarav & Diya! You will be deeply missed. 🙏 Warm regards from the family! 🌸',
    };
  }

  // Parse total members
  let totalMembers = 0;
  let adults = 0;
  let children = 0;

  // Check children explicitly
  const childMatch = lower.match(/(\d+)\s*(?:kids?|children|child|bacche?|bache?)/i);
  if (childMatch) {
    children = parseInt(childMatch[1], 10);
  }

  // Check adults explicitly
  const adultMatch = lower.match(/(\d+)\s*(?:adults?|grown\s*ups?|bade)/i);
  if (adultMatch) {
    adults = parseInt(adultMatch[1], 10);
  }

  // Check general count: "4 of us", "we are 5", "3 people", "hum 3 log", "party of 4"
  const generalMatch =
    lower.match(/(\d+)\s*(?:of us|people|members|guests?|log|persons?)/i) ||
    lower.match(/(?:we are|we're|party of)\s*(\d+)/i) ||
    lower.match(/all\s*(\d+)\s*of us/i);

  if (generalMatch) {
    totalMembers = parseInt(generalMatch[1], 10);
  }

  // Common phrases
  if (
    lower.includes('me and my wife') ||
    lower.includes('my husband and i') ||
    lower.includes('me and my partner') ||
    lower.includes('both of us') ||
    lower.includes('husband and wife')
  ) {
    if (totalMembers === 0) totalMembers = 2;
    if (adults === 0) adults = 2;
  } else if (
    lower.includes('solo') ||
    lower.includes('just me') ||
    lower.includes('only me') ||
    lower.includes('myself')
  ) {
    if (totalMembers === 0) totalMembers = 1;
    if (adults === 0) adults = 1;
  }

  // Reconcile counts
  if (totalMembers > 0 && adults === 0 && children === 0) {
    adults = totalMembers;
  } else if (totalMembers > 0 && adults === 0 && children > 0) {
    adults = Math.max(1, totalMembers - children);
  } else if (totalMembers === 0 && (adults > 0 || children > 0)) {
    totalMembers = adults + children;
  } else if (totalMembers === 0) {
    // default assumed attending couple or 1
    totalMembers = 2;
    adults = 2;
    children = 0;
  }

  // Parse events
  const events: string[] = [];
  const allEventsMentioned =
    lower.includes('all function') ||
    lower.includes('all event') ||
    lower.includes('all 3 days') ||
    lower.includes('whole wedding') ||
    lower.includes('saare function');

  if (allEventsMentioned) {
    events.push('Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception');
  } else {
    if (lower.includes('mehendi') || lower.includes('mehndi')) events.push('Mehendi');
    if (lower.includes('sangeet') || lower.includes('cocktail')) events.push('Sangeet');
    if (lower.includes('haldi')) events.push('Haldi');
    if (
      lower.includes('wedding') ||
      lower.includes('phere') ||
      lower.includes('pheras') ||
      lower.includes('shaadi') ||
      lower.includes('vivah')
    ) {
      events.push('Wedding');
    }
    if (lower.includes('reception')) events.push('Reception');
  }

  // If no specific event detected but confirming, assign Wedding & Reception by default
  if (events.length === 0) {
    events.push('Wedding', 'Reception');
  }

  // Parse dietary
  let dietaryPreference: 'Pure Veg' | 'Jain' | 'Non-Veg' | 'Vegan' | 'Not Specified' = 'Not Specified';
  if (lower.includes('jain')) {
    dietaryPreference = 'Jain';
  } else if (lower.includes('non-veg') || lower.includes('nonveg') || lower.includes('chicken') || lower.includes('mutton')) {
    dietaryPreference = 'Non-Veg';
  } else if (lower.includes('vegan')) {
    dietaryPreference = 'Vegan';
  } else if (lower.includes('veg') || lower.includes('pure veg') || lower.includes('shakahari')) {
    dietaryPreference = 'Pure Veg';
  } else {
    // Default to Pure Veg in an Indian wedding context
    dietaryPreference = 'Pure Veg';
  }

  // Parse rooms
  let roomsRequired = 0;
  const roomMatch = lower.match(/(\d+)\s*(?:rooms?|kamre?)/i);
  if (roomMatch) {
    roomsRequired = parseInt(roomMatch[1], 10);
  } else if (
    lower.includes('need room') ||
    lower.includes('need hotel') ||
    lower.includes('require room') ||
    lower.includes('need accommodation') ||
    lower.includes('stay arranged')
  ) {
    roomsRequired = Math.max(1, Math.ceil(adults / 2));
  }

  // Generate warm reply
  const guestName = guestContext?.name || 'Aap sabhi';
  const eventListStr = events.join(', ');
  const replySuggestion = `Namaste! 🙏 Wonderful! We have confirmed ${totalMembers} guest${
    totalMembers > 1 ? 's' : ''
  } (${adults} adults${children > 0 ? `, ${children} kids` : ''}) for ${eventListStr}. ${
    (dietaryPreference as string) !== 'Not Specified' ? `Food preference noted: ${dietaryPreference}. ` : ''
  }${roomsRequired > 0 ? `We have also requested ${roomsRequired} hotel room${roomsRequired > 1 ? 's' : ''}. ` : ''}Can't wait to celebrate with you at Udaipur! 🪔✨`;

  return {
    attending: true,
    totalMembers,
    adults,
    children,
    events,
    dietaryPreference,
    roomsRequired,
    notes: text,
    confidence: 0.9,
    replySuggestion,
  };
}

// API endpoint to parse RSVP messages using Gemini 3.8 Flash
app.post('/api/parse-rsvp', async (req: Request, res: Response) => {
  try {
    const { message, guestContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Try Gemini API if client is available
    if (ai) {
      try {
        const systemPrompt = `You are the AI RSVP Intelligence Assistant for an Indian wedding ("VivahBandhan").
Your job is to analyze incoming guest WhatsApp messages (which may be written in English, Hindi, or Hinglish) and extract structured RSVP data.

Wedding details:
- Couple: Aarav Singhania & Diya Mehra
- Possible Events: ["Mehendi", "Sangeet", "Haldi", "Wedding", "Reception"]
- Available Dietary options: "Pure Veg", "Jain", "Non-Veg", "Vegan", "Not Specified"

Rules:
1. "attending": true if guest intends to come to at least one event. False if they decline, apologize that they cannot make it, are out of town/country, or send regrets.
2. "totalMembers": total count of attendees. If phrase says "4 of us", total is 4. If "me and my wife", total is 2. If solo, total is 1. If declined, 0.
3. "adults": number of adults (default totalMembers - children).
4. "children": number of kids / children / infants mentioned.
5. "events": array of events explicitly or implicitly mentioned. If "all functions" / "all events", include all 5 events. If specific events like "reception" or "sangeet and wedding" are mentioned, include only those. If confirming without specifying, default to ["Wedding", "Reception"].
6. "dietaryPreference": detect "Jain" (no onion/garlic), "Non-Veg", "Pure Veg", "Vegan", or "Not Specified". Default to "Pure Veg" if not specified in an Indian context.
7. "roomsRequired": integer number of hotel rooms needed. If they ask for rooms or mention staying at hotel, estimate 1 room per 2 adults if exact count not stated. If they say staying on their own, 0.
8. "replySuggestion": generate a warm, polite, culturally authentic Indian wedding host WhatsApp reply in English with touch of Hindi warmth and celebratory emojis (🙏, 🪔, 🎉, ✨). Acknowledge their headcount, confirmed events, and hospitality details.`;

        let responseText: string | undefined;
        let usedModel = 'gemini-3.1-flash-lite';

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out')), 8000)
        );

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: `Guest message: "${message}"\nGuest Context: ${JSON.stringify(guestContext || {})}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                attending: { type: Type.BOOLEAN, description: 'Whether the guest is attending' },
                totalMembers: { type: Type.INTEGER, description: 'Total number of family/party members' },
                adults: { type: Type.INTEGER, description: 'Number of adults' },
                children: { type: Type.INTEGER, description: 'Number of children/kids' },
                events: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of events attending: Mehendi, Sangeet, Haldi, Wedding, Reception',
                },
                dietaryPreference: {
                  type: Type.STRING,
                  description: 'Dietary preference: Pure Veg, Jain, Non-Veg, Vegan, Not Specified',
                },
                roomsRequired: { type: Type.INTEGER, description: 'Number of hotel rooms needed' },
                roomCheckIn: { type: Type.STRING, description: 'Optional check in date' },
                roomCheckOut: { type: Type.STRING, description: 'Optional check out date' },
                notes: { type: Type.STRING, description: 'Key nuances or special requests noted' },
                confidence: { type: Type.NUMBER, description: 'Confidence score from 0 to 1' },
                replySuggestion: { type: Type.STRING, description: 'Warm WhatsApp reply to send back' },
              },
              required: ['attending', 'totalMembers', 'adults', 'children', 'events', 'dietaryPreference', 'roomsRequired', 'replySuggestion'],
            },
          },
        });

        const geminiRes = await Promise.race([geminiCall, timeoutPromise]);
        responseText = geminiRes.text;

        const parsed = JSON.parse(responseText || '{}');

        // Sanitize events to valid set
        const validEvents = ['Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception'];
        if (Array.isArray(parsed.events)) {
          parsed.events = parsed.events.filter((e: string) => validEvents.includes(e));
          if (parsed.events.length === 0 && parsed.attending) {
            parsed.events = ['Wedding', 'Reception'];
          }
        } else {
          parsed.events = parsed.attending ? ['Wedding', 'Reception'] : [];
        }

        return res.json({
          success: true,
          data: parsed,
          engine: usedModel,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, falling back to heuristic NLP parser:', geminiError?.message || geminiError);
        const fallback = parseRSVPHeuristically(message, guestContext);
        return res.json({
          success: true,
          data: fallback,
          engine: 'heuristic-fallback',
        });
      }
    }

    // Heuristic parser if Gemini key is not configured
    const result = parseRSVPHeuristically(message, guestContext);
    return res.json({
      success: true,
      data: result,
      engine: 'heuristic-nlp',
    });
  } catch (error: any) {
    console.error('RSVP parsing error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Endpoint to generate custom WhatsApp invitation message or reminder
app.post('/api/generate-invite', async (req: Request, res: Response) => {
  try {
    const { guest, coupleNames, venue, dates } = req.body;
    const name = guest?.name || 'Respected Guest';

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: `Create a warm, elegant WhatsApp wedding invitation message for:
Guest: ${name}
Relation: ${guest?.relation || 'Family'}
Side: ${guest?.familySide || 'Family'}
Couple: ${coupleNames || 'Aarav & Diya'}
Dates: ${dates || 'Dec 12 - 14, 2026'}
Venue: ${venue || 'The Oberoi Udaivilas, Udaipur'}
Events: ${(guest?.invitedEvents || ['Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception']).join(', ')}

Keep it concise for WhatsApp, with celebratory emojis, traditional warmth (Namaste/Pranam), and a gentle prompt to reply with RSVP and room requirements.`,
        });

        return res.json({ inviteText: response.text?.trim() });
      } catch (e) {
        console.warn('Gemini invite generation fallback:', e);
      }
    }

    // Fallback template
    const defaultInvite = `Namaste ${name} ji! 🙏✨\n\nWith the blessings of our elders, we cordially invite you and your family to celebrate the auspicious wedding of ${
      coupleNames || 'Aarav & Diya'
    }.\n\n📅 Date: ${dates || 'Dec 12 - 14, 2026'}\n📍 Venue: ${
      venue || 'The Oberoi Udaivilas, Udaipur'
    }\n\nEvents: ${(guest?.invitedEvents || ['Sangeet', 'Wedding', 'Reception']).join(', ')}\n\nKindly reply to this message with your confirmation, number of attending guests, and room requirements so we can arrange royal hospitality for you! 🪔🌸`;

    return res.json({ inviteText: defaultInvite });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving static files from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
