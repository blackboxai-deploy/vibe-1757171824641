import { store } from './store';

// Market data simulator - generates realistic trading data
class MarketSimulator {
  private isRunning: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Generate ticks every 500ms
    this.intervalId = setInterval(async () => {
      await this.generateTick();
    }, 500);
    
    console.log('Market simulator started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Market simulator stopped');
  }

  private async generateTick() {
    // Generate random last digit (0-9)
    const last_digit = Math.floor(Math.random() * 10);
    
    const tick = {
      type: "tick" as const,
      last_digit,
      timestamp: Date.now()
    };

    // Broadcast tick to all connected clients
    await store.broadcast({
      event: "tick",
      data: tick
    });

    // Occasionally update balance (5% chance)
    if (Math.random() < 0.05) {
      const balanceChange = (Math.random() - 0.5) * 4.0; // -2 to +2
      store.updateBalance(store.balance + balanceChange);
      
      await store.broadcast({
        event: "balance", 
        data: { balance: Math.round(store.balance * 100) / 100 }
      });
    }

    // Occasionally generate trade result (2% chance)
    if (Math.random() < 0.02) {
      const trade = {
        id: Math.floor(Math.random() * 9000) + 1000,
        profit: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2.5 + 0.5),
        timestamp: Date.now()
      };

      await store.broadcast({
        event: "trade_result",
        data: trade
      });
    }

    // Occasionally update best strategy (1% chance)
    if (Math.random() < 0.01) {
      const strategies = ["EvenOdd", "MatchesDiffers", "MDigit", "Pro/Martingale"];
      const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
      const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%
      
      store.best_strategy = {
        name: randomStrategy,
        confidence,
        notes: "Live Analysis"
      };

      await store.broadcast({
        event: "best_strategy",
        data: store.best_strategy
      });
    }
  }

  getStatus() {
    return {
      running: this.isRunning,
      uptime: this.isRunning ? Date.now() : 0
    };
  }
}

// Global simulator instance
export const simulator = new MarketSimulator();

// Auto-start simulator when module loads
if (typeof window === 'undefined') {
  // Only run on server side
  simulator.start();
}