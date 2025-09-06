"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">BB</span>
        </div>
        <div>
          <div className="text-xl font-bold text-white">Blackbox AI</div>
          <div className="text-sm text-gray-400">Trading Analyzer</div>
        </div>
      </div>
      <div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2"
        >
          Login
        </Button>
      </div>
    </div>
  );
}