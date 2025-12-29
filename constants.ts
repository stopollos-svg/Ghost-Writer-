
import { Tone, Brief, PhoneTheme } from './types';

export const THEMES: PhoneTheme[] = [
  {
    id: 'y2k',
    name: 'Y2K Pink',
    price: 0,
    colors: {
      primary: 'pink-500',
      secondary: 'fuchsia-400',
      accent: 'purple-500',
      bg: 'rose-50',
      panel: 'white',
      border: 'pink-200',
      text: 'pink-900',
      muted: 'pink-400'
    }
  },
  {
    id: 'nexus',
    name: 'Nexus Default',
    price: 500,
    colors: {
      primary: 'rose-600',
      secondary: 'rose-500',
      accent: 'blue-600',
      bg: 'slate-950',
      panel: 'slate-900',
      border: 'slate-900',
      text: 'white',
      muted: 'white/40'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    price: 1200,
    colors: {
      primary: 'yellow-400',
      secondary: 'cyan-400',
      accent: 'fuchsia-600',
      bg: 'zinc-950',
      panel: 'zinc-900',
      border: 'yellow-500',
      text: 'yellow-400',
      muted: 'yellow-400/40'
    }
  },
  {
    id: 'stealth',
    name: 'Dark Stealth',
    price: 2500,
    colors: {
      primary: 'zinc-100',
      secondary: 'zinc-400',
      accent: 'zinc-600',
      bg: 'black',
      panel: 'zinc-950',
      border: 'zinc-800',
      text: 'zinc-100',
      muted: 'zinc-600'
    }
  }
];

export const LEVELS: Brief[] = [
  {
    id: 'lvl1_tiffany',
    eventTag: 'SOFT LAUNCH SCANDAL',
    client: {
      id: 'c1',
      name: 'Tiffany',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
      followerCount: 5200
    },
    scenario: "I posted a photo of a guy's hand to 'soft launch' my boyfriend. It's actually my ex's hand. My followers are calling me out!",
    recipient: "The Followers",
    context: "Play it off as a joke or manifestation to stay relatable."
  },
  {
    id: 'valentine_fail',
    eventTag: 'VALENTINE\'S DAY MASSACRE',
    client: {
      id: 'c4',
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      followerCount: 1500
    },
    scenario: "I accidentally sent 'I love you ❤️' to my boss instead of my partner. I need to fix this NOW before it's awkward!",
    recipient: "The Boss",
    context: "The boss is professional and confused. We need an acronym or a pivot."
  },
  {
    id: 'halloween_ghost',
    eventTag: 'GHOSTING SEASON',
    client: {
      id: 'c5',
      name: 'Exorcist Tim',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      followerCount: 2200
    },
    scenario: "My toxic ex keeps 'haunting' my DMs with 'U up?' texts. I need an 'Exorcism Text' so weird they never reply again.",
    recipient: "Toxic Ex",
    context: "Make it so confusing they question their existence."
  }
];

export const LEVEL_FRAGMENTS: Record<string, { openers: any[], meat: any[], closers: any[] }> = {
  lvl1_tiffany: {
    openers: [
      { id: 't1_o1', text: "Um, hands look the same?", tone: Tone.GASLIGHT },
      { id: 't1_o2', text: "Guys, I'm just manifesting...", tone: Tone.SINCERE },
      { id: 't1_o4', text: "Omg it's not even him,", tone: Tone.CHAOTIC }
    ],
    meat: [
      { id: 't1_m1', text: "You guys are literally obsessed with my past.", tone: Tone.GASLIGHT },
      { id: 't1_m2', text: "A hand like that... let a girl dream!", tone: Tone.SINCERE },
      { id: 't1_m3', text: "It's actually his twin brother's hand.", tone: Tone.CHAOTIC }
    ],
    closers: [
      { id: 't1_c1', text: "Anyway, use code TIFF20 for 20% off! 💅", tone: Tone.CHAOTIC },
      { id: 't1_c2', text: "Manifestation is a mood. ✨", tone: Tone.SINCERE },
      { id: 't1_c3', text: "Let's focus on the vibes, okay?", tone: Tone.PETTY }
    ]
  },
  valentine_fail: {
    openers: [
      { id: 'v_o1', text: "Wait! That was meant for the I.L.O.V.E.U. project!", tone: Tone.CORPORATE },
      { id: 'v_o2', text: "Omg so sorry, I love everyone today!", tone: Tone.SINCERE },
      { id: 'v_o3', text: "I said what I said, you're the best.", tone: Tone.CHAOTIC },
      { id: 'v_o4', text: "Did I send that? My phone is glitching.", tone: Tone.GASLIGHT }
    ],
    meat: [
      { id: 'v_m1', text: "Integrated Logistics Of Various Enterprise Units is finally ready.", tone: Tone.CORPORATE },
      { id: 'v_m2', text: "Just feeling the festive Valentine's spirit in the office!", tone: Tone.SINCERE },
      { id: 'v_m3', text: "You're basically like a father figure to me anyway.", tone: Tone.PETTY },
      { id: 'v_m4', text: "I was actually typing 'I loathe you' but autocorrect??", tone: Tone.CHAOTIC }
    ],
    closers: [
      { id: 'v_c1', text: "I'll send the full report on the units by EOD.", tone: Tone.CORPORATE },
      { id: 'v_c2', text: "Anyway, let's just get back to work! 😅", tone: Tone.SINCERE },
      { id: 'v_c3', text: "No more coffee for me today! LOL", tone: Tone.PETTY },
      { id: 'v_c4', text: "Let's never speak of this again. Deal?", tone: Tone.GASLIGHT }
    ]
  },
  halloween_ghost: {
    openers: [
      { id: 'h_o1', text: "BEGONE SPIRIT! The ritual has begun.", tone: Tone.CHAOTIC },
      { id: 'h_o2', text: "Who is this? My phone is currently being debugged.", tone: Tone.GASLIGHT },
      { id: 'h_o3', text: "I am currently a potato. Please leave a message.", tone: Tone.CHAOTIC },
      { id: 'h_o4', text: "Regarding your previous communication,", tone: Tone.CORPORATE }
    ],
    meat: [
      { id: 'h_m1', text: "The seven seals have been broken and the beans are spilled.", tone: Tone.CHAOTIC },
      { id: 'h_m2', text: "I never actually dated you. You were a mass hallucination.", tone: Tone.GASLIGHT },
      { id: 'h_m3', text: "I've sold your number to a telemarketing firm in Mars.", tone: Tone.PETTY },
      { id: 'h_m4', text: "I'm sorry, I only speak in binary now. 01101000 01101001", tone: Tone.CHAOTIC }
    ],
    closers: [
      { id: 'h_c1', text: "Do not reply or the curse will be permanent.", tone: Tone.CHAOTIC },
      { id: 'h_c2', text: "Anyway, hope you find a new ghost soon! 👻", tone: Tone.SINCERE },
      { id: 'h_c3', text: "Please unsubscribe from this existence.", tone: Tone.PETTY },
      { id: 'h_c4', text: "Unsubscribe.", tone: Tone.CORPORATE }
    ]
  }
};

export const TONE_COLORS: Record<Tone, string> = {
  [Tone.SINCERE]: 'bg-emerald-500',
  [Tone.GASLIGHT]: 'bg-purple-500',
  [Tone.PETTY]: 'bg-rose-500',
  [Tone.CORPORATE]: 'bg-sky-500',
  [Tone.CHAOTIC]: 'bg-orange-500',
  [Tone.SAVAGE]: 'bg-yellow-500'
};
