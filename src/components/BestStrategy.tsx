"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BestStrategy as BestStrategyType } from '@/lib/types';

interface BestStrategyProps {
  strategy?: BestStrategyType;
}

export default function BestStrategy({ strategy }: BestStrategyProps) {
  const best = strategy || { name: "EvenOdd", confidence: 90, notes: "NY Peak" };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-600/50 border-l-4 border-l-emerald-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-bold text-white">BEST STRATEGY RIGHT NOW</h2>
            </div>
            <p className="text-sm text-gray-400">Optimal conditions detected</p>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${getConfidenceColor(best.confidence)}`}>
              {best.confidence}%
            </div>
            <p className="text-sm text-gray-400">Success Rate (est.)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold text-white mb-2">{best.name}</h3>
            <p className="text-sm text-gray-400">{best.notes}</p>
            <Badge className="mt-2 bg-emerald-600 text-white">
              Recommended
            </Badge>
          </div>
          
          <div className="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Optimal Setup</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <div>Pair: <span className="text-white font-medium">V75</span></div>
              <div>Strategy: <span className="text-white font-medium">{best.name}</span></div>
              <div>Market: <span className="text-white font-medium">Active</span></div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-900/20 rounded-lg border border-emerald-600/30">
          <p className="text-sm text-emerald-300">
            ⚡ Current conditions favor this strategy. Consider increasing position size for optimal returns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}