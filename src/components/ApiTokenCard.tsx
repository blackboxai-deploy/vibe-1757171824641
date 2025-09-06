"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ApiTokenCardProps {
  onStatusChange?: () => void;
}

export default function ApiTokenCard({ onStatusChange }: ApiTokenCardProps) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState({ connected: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const handleConnect = async () => {
    if (!token.trim()) {
      alert('Please enter a valid API token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      
      if (data.ok) {
        setStatus({ connected: data.connected });
        alert('Token saved successfully! (Demo mode - real implementation would validate with Deriv API)');
        if (onStatusChange) onStatusChange();
      } else {
        alert('Failed to save token: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-white">Deriv API Connection</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-400">Status:</span>
              <Badge variant={status.connected ? "default" : "secondary"} className={
                status.connected 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gray-600 text-gray-300"
              }>
                {status.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Input
              type="password"
              placeholder="Enter API Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-80 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            />
            <Button 
              onClick={handleConnect}
              disabled={loading || !token.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}