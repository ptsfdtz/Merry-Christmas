export interface Wish {
  id: string;
  name: string;
  message: string;
  color: string;
  rotation: number;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum ActivityType {
  GIFT = 'GIFT',
  MUSIC = 'MUSIC',
  DINNER = 'DINNER',
  GAME = 'GAME'
}