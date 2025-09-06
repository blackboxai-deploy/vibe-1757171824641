"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebSocketMessage } from '@/lib/types';

interface LiveFeedProps {
  messages: WebSocketMessage[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export default function LiveFeed({ messages, connectionStatus }: LiveFeedProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-emerald-600 text-white';
      case 'connecting':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Disconnected';
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'tick':
        return '📈';
      case 'balance':
        return '💰';
      case 'trade_result':
        return '🎯';
      case 'strategies':
        return '⚙️';
      case 'best_strategy':
        return '🏆';
      case 'status':
        return '📊';
      default:
        return '📡';
    }
  };

  const formatEventData = (event: string, data: any) => {
    switch (event) {
      case 'tick':
        return `Last Digit: ${data.last_digit}`;
      case 'balance':
        return `Balance: $${data.balance?.toFixed(2) || 'N/A'}`;
      case 'trade_result':
        return `Trade #${data.id}: ${data.profit > 0 ? '+' : ''}$${data.profit?.toFixed(2)}`;
      case 'best_strategy':
        return `${data.name} (${data.confidence}%)`;
      case 'strategies':
        const active = Object.entries(data).filter(([_, enabled]) => enabled).length;
        return `${active} strategies active`;
      default:
        return JSON.stringify(data).substring(0, 50) + '...';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Live Feed</CardTitle>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <div className="mb-2">📡</div>
              <div>Waiting for market data...</div>
              <div className="text-xs mt-1">
                {connectionStatus === 'disconnected' && 'Not connected to live feed'}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div 
                  key={`${message.event}-${index}`}
                  className="p-3 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">
                        {getEventIcon(message.event)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {message.event}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(message.data?.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-white truncate">
                          {formatEventData(message.event, message.data)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Feed Controls */}
        <div className="p-3 bg-gray-900/40 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{messages.length} events</span>
            <span>Updates every 500ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}