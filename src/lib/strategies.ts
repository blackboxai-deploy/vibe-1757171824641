import { Strategy } from './types';

export const STRATEGIES: Strategy[] = [
  {
    name: "EvenOdd",
    desc: "Even/Odd digit analysis",
    risk: "Low"
  },
  {
    name: "MatchesDiffers", 
    desc: "Matches/Differs analysis",
    risk: "Medium"
  },
  {
    name: "MDigit",
    desc: "M Digit frequency strategy", 
    risk: "Medium"
  },
  {
    name: "Pro/Martingale",
    desc: "Accumulator + Martingale",
    risk: "High"
  }
];

export const DEFAULT_STRATEGIES = {
  "EvenOdd": false,
  "MatchesDiffers": false,
  "MDigit": false,
  "Pro/Martingale": false
};