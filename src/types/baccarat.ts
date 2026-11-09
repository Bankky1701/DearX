export type CardResult = 'b' | 'p' | 't' | 'B' | 'P' | 'T';

export interface User {
  id: number;
  user: string;
  pass: string;
  email: string;
  credit: number;
  rank: 'admin' | 'member';
  online: number;
  lobby?: number;
}

export interface Formula {
  id: number;
  fm: string; // 5 characters e.g. "BBBPB"
  an: 'B' | 'P' | 'T';
  idea: number; // formula set ID
}

export interface FormulaList {
  id: number;
  time: number;
}

export interface RedeemCode {
  id: number;
  code: string;
  credit: number;
  create_by: string;
  create_date: number;
  code_use: number;
  use_by: string;
}

export interface Statistic {
  id: number;
  user: string;
  room: number;
  date: string;
  fm: string;
  an: string;
  result: 'win' | 'lose' | 'wait' | 'cancel';
  lap?: number;
}

export interface RoomData {
  id: number;
  name: string;
  status: 'Dealing' | 'Waiting' | 'Player' | 'Banker' | 'Tie' | 'Shuffle';
  percent: number;
  data: string[]; // array of 'b' | 'p' | 't'
}
