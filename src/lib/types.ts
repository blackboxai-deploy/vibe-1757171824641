// Core types for the Deriv trading dashboard

export interface Strategy {
  name: string;
  desc: string;
  risk: 'Low' | 'Medium' | 'High';
}

export interface BestStrategy {
  name: string;
  confidence: number;
  notes: string;
}

export interface AppStatus {
  connected: boolean;
  balance: number;
  active_trades: number;
  best_strategy: BestStrategy;
  strategies: Record<string, boolean>;
}

export interface TokenRequest {
  token: string;
}

export interface StrategyToggleRequest {
  name: string;
  enabled: boolean;
}

export interface WebSocketMessage {
  event: string;
  data: any;
}

export interface MarketTick {
  type: 'tick';
  last_digit: number;
  timestamp?: number;
}

export interface BalanceUpdate {
  balance: number;
}

export interface TradeResult {
  id: number;
  profit: number;
  timestamp?: number;
}