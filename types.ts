
export interface PlayerEntry {
  name: string;
  appearances: number;
  addedBy: 1 | 2;
  timestamp: number;
  sourceUrl?: string;
}

export enum GameStatus {
  SELECTING_CLUB = 'SELECTING_CLUB',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Club {
  id: string;
  name: string;
  league: string;
}

export interface ValidationResult {
  isValid: boolean;
  appearances: number;
  error?: string;
  sourceUrl?: string;
}
