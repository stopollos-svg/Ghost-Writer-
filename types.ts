
export enum Tone {
  SINCERE = 'SINCERE',
  GASLIGHT = 'GASLIGHT',
  PETTY = 'PETTY',
  CORPORATE = 'CORPORATE',
  CHAOTIC = 'CHAOTIC',
  SAVAGE = 'SAVAGE'
}

export type ThemeID = 'nexus' | 'y2k' | 'cyberpunk' | 'stealth';

export interface PhoneTheme {
  id: ThemeID;
  name: string;
  price: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    panel: string;
    border: string;
    text: string;
    muted: string;
  };
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  followerCount: number;
}

export interface Brief {
  id: string;
  client: Client;
  scenario: string;
  recipient: string;
  context: string;
  isDaily?: boolean;
  eventTag?: string;
}

export interface Fragment {
  id: string;
  text: string;
  tone: Tone;
}

export interface GameState {
  money: number;
  reputation: number;
  energy: number; 
  dramaLevel: number;
  currentLevelIndex: number;
  unlockedSpicy: boolean;
  activeEvent: string | null;
  currentTheme: ThemeID;
  unlockedThemes: ThemeID[];
}

export interface ReactionResponse {
  reactionText: string;
  stressImpact: number;
  reputationImpact: number;
  dramaImpact: number;
  isViral: boolean;
  leakedCommentary: string;
  ratingTitle: string;
  outcomeCategory: 'Success' | 'Funny Fail' | 'Total Disaster';
}
