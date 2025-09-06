"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppStatus } from '@/lib/types';

interface AccountDashboardProps {
  status?: AppStatus;
}

export default function AccountDashboard({ status }: AccountDashboardProps) {
  if (!status) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  const getBalanceColor = (balance: number) => {
    if (balance >= 1000) return 'text-emerald-400';
    if (balance >= 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Section */}
        <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Account Balance</div>
          <div className={`text-2xl font-bold ${getBalanceColor(status.balance)}`}>
            {formatBalance(status.balance)}
          </div>
        </div>

        {/* Trading Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Connection Status</span>
            <span className={`text-sm font-medium ${
              status.connected ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {status.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active Trades</span>
            <span className="text-sm font-medium text-white">
              {status.active_trades}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active Strategies</span>
            <span className="text-sm font-medium text-white">
              {Object.values(status.strategies).filter(Boolean).length} / {Object.keys(status.strategies).length}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-3">Quick Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900/40 p-2 rounded border border-gray-700 text-center">
              <div className="text-gray-400">Today P&L</div>
              <div className="text-white font-medium">+$23.45</div>
            </div>
            <div className="bg-gray-900/40 p-2 rounded border border-gray-700 text-center">
              <div className="text-gray-400">Win Rate</div>
              <div className="text-emerald-400 font-medium">68%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}