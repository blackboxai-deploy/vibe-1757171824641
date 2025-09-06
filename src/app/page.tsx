"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ApiTokenCard from '@/components/ApiTokenCard';
import StrategyList from '@/components/StrategyList';
import BestStrategy from '@/components/BestStrategy';
import AccountDashboard from '@/components/AccountDashboard';
import LiveFeed from '@/components/LiveFeed';
import { useServerSentEvents } from '@/hooks/useServerSentEvents';
import { AppStatus } from '@/lib/types';

export default function DashboardPage() {
  const [status, setStatus] = useState<AppStatus | null>(null);
  const { messages, connectionStatus } = useServerSentEvents('/api/events');

  // Load initial status
  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Update status when receiving messages
  useEffect(() => {
    messages.forEach(message => {
      if (message.event === 'balance') {
        setStatus(prev => prev ? { ...prev, balance: message.data.balance } : null);
      } else if (message.event === 'status') {
        setStatus(message.data);
      } else if (message.event === 'strategies') {
        setStatus(prev => prev ? { ...prev, strategies: message.data } : null);
      } else if (message.event === 'best_strategy') {
        setStatus(prev => prev ? { ...prev, best_strategy: message.data } : null);
      }
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <Header />

        {/* API Connection */}
        <div className="mb-6">
          <ApiTokenCard onStatusChange={loadStatus} />
        </div>

        {/* Best Strategy Highlight */}
        <div className="mb-6">
          <BestStrategy strategy={status?.best_strategy} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Strategy Management */}
          <div className="lg:col-span-2">
            <StrategyList onStrategyChange={loadStatus} />
          </div>

          {/* Right Column - Account & Live Feed */}
          <div className="space-y-6">
            <AccountDashboard status={status || undefined} />
            <LiveFeed messages={messages} connectionStatus={connectionStatus} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              <span>Deriv Trading Dashboard</span>
              <span className="mx-2">•</span>
              <span>Powered by Blackbox AI</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Status: {connectionStatus}</span>
              <span>•</span>
              <span>{messages.length} events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}