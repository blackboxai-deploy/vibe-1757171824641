import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { StrategyToggleRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: StrategyToggleRequest = await request.json();
    
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Strategy name is required' },
        { status: 400 }
      );
    }

    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Enabled must be a boolean' },
        { status: 400 }
      );
    }

    // Check if strategy exists
    if (!(body.name in store.strategies)) {
      return NextResponse.json(
        { error: 'Unknown strategy' },
        { status: 404 }
      );
    }

    // Toggle the strategy
    store.toggleStrategy(body.name, body.enabled);
    
    // Broadcast strategy update to all clients
    await store.broadcast({
      event: "strategies",
      data: store.strategies
    });

    const response = {
      ok: true,
      strategies: store.strategies
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Strategy toggle API error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle strategy' },
      { status: 500 }
    );
  }
}