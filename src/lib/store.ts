import { BestStrategy } from './types';
import { DEFAULT_STRATEGIES } from './strategies';

// Application store for managing global state
class AppStore {
  public deriv_token: string = "";
  public strategies: Record<string, boolean> = { ...DEFAULT_STRATEGIES };
  public balance: number = 1000.0;
  public active_trades: any[] = [];
  public best_strategy: BestStrategy = {
    name: "EvenOdd",
    confidence: 90,
    notes: "NY Peak"
  };
  
  // WebSocket clients management
  public clients: Set<any> = new Set();
  
  // Update methods
  setToken(token: string) {
    this.deriv_token = token;
  }
  
  toggleStrategy(name: string, enabled: boolean) {
    if (name in this.strategies) {
      this.strategies[name] = enabled;
    }
  }
  
  updateBalance(balance: number) {
    this.balance = balance;
  }
  
  getStatus() {
    return {
      connected: !!this.deriv_token,
      balance: Math.round(this.balance * 100) / 100,
      active_trades: this.active_trades.length,
      best_strategy: this.best_strategy,
      strategies: { ...this.strategies }
    };
  }
  
  // Broadcast to WebSocket clients
  async broadcast(message: any) {
    const toRemove: any[] = [];
    
    for (const client of this.clients) {
      try {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify(message));
        } else {
          toRemove.push(client);
        }
      } catch (error) {
        toRemove.push(client);
      }
    }
    
    // Clean up closed connections
    toRemove.forEach(client => this.clients.delete(client));
  }
}

// Global store instance
export const store = new AppStore();