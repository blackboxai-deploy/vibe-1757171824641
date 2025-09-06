import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { TokenRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: TokenRequest = await request.json();
    
    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { error: 'Valid token is required' },
        { status: 400 }
      );
    }

    // Set the token in store
    store.setToken(body.token);
    
    // In a real app, this would validate the token with Deriv API
    // For demo purposes, we just save it
    
    const response = {
      ok: true,
      connected: !!store.deriv_token
    };

    // Broadcast connection status update
    await store.broadcast({
      event: "status",
      data: store.getStatus()
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { error: 'Failed to set token' },
      { status: 500 }
    );
  }
}