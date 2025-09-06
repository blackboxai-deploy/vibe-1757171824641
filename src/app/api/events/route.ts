import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

// Server-Sent Events endpoint for real-time updates
export async function GET(request: NextRequest) {
  // Check if client accepts server-sent events
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial status
      const statusMessage = `data: ${JSON.stringify({
        event: 'status',
        data: store.getStatus()
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(statusMessage));

      // Set up interval for market data simulation
      const interval = setInterval(() => {
        try {
          // Generate random tick
          const tick = {
            type: "tick",
            last_digit: Math.floor(Math.random() * 10),
            timestamp: Date.now()
          };

          const tickMessage = `data: ${JSON.stringify({
            event: 'tick',
            data: tick
          })}\n\n`;
          
          controller.enqueue(new TextEncoder().encode(tickMessage));

          // Occasionally send balance update
          if (Math.random() < 0.05) {
            const balanceChange = (Math.random() - 0.5) * 4.0;
            store.updateBalance(store.balance + balanceChange);
            
            const balanceMessage = `data: ${JSON.stringify({
              event: 'balance',
              data: { balance: Math.round(store.balance * 100) / 100 }
            })}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(balanceMessage));
          }

          // Occasionally send trade result
          if (Math.random() < 0.02) {
            const trade = {
              id: Math.floor(Math.random() * 9000) + 1000,
              profit: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2.5 + 0.5),
              timestamp: Date.now()
            };

            const tradeMessage = `data: ${JSON.stringify({
              event: 'trade_result',
              data: trade
            })}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(tradeMessage));
          }
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, 500);

      // Cleanup on close
      request.signal?.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, { headers });
}