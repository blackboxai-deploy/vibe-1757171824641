import { NextResponse } from 'next/server';
import { STRATEGIES } from '@/lib/strategies';

export async function GET() {
  try {
    return NextResponse.json(STRATEGIES);
  } catch (error) {
    console.error('Strategies API error:', error);
    return NextResponse.json(
      { error: 'Failed to get strategies' },
      { status: 500 }
    );
  }
}