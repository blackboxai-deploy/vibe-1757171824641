"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Strategy } from '@/lib/types';

interface StrategyListProps {
  onStrategyChange?: () => void;
}

export default function StrategyList({ onStrategyChange }: StrategyListProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStrategies();
    loadStatus();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await fetch('/api/strategies');
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setEnabled(data.strategies || {});
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleToggle = async (name: string, checked: boolean) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      const response = await fetch('/api/strategies/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, enabled: checked })
      });

      const data = await response.json();
      
      if (data.ok) {
        setEnabled(data.strategies);
        if (onStrategyChange) onStrategyChange();
      } else {
        alert('Failed to toggle strategy: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to toggle strategy. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-emerald-600 text-white';
      case 'Medium':
        return 'bg-yellow-600 text-white';
      case 'High':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-gray-300';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Trading Strategies</CardTitle>
          <span className="text-sm text-gray-400">Toggle to activate</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {strategies.map((strategy) => (
          <div 
            key={strategy.name} 
            className="flex items-center justify-between p-4 rounded-lg bg-gray-900/30 border border-gray-700"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white">{strategy.name}</h3>
                <Badge className={getRiskColor(strategy.risk)}>
                  {strategy.risk} Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{strategy.desc}</p>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm font-medium text-gray-300">
                {enabled[strategy.name] ? 'Active' : 'Inactive'}
              </span>
              <Switch
                checked={!!enabled[strategy.name]}
                onCheckedChange={(checked) => handleToggle(strategy.name, checked)}
                disabled={loading[strategy.name]}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}