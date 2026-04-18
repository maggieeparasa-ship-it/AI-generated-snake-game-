export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export type Point = {
  x: number;
  y: number;
};
