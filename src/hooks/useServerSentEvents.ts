"use client";

import { useEffect, useState, useCallback } from 'react';
import { WebSocketMessage } from '@/lib/types';

export function useServerSentEvents(url: string) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    setConnectionStatus('connecting');
    
    const eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      console.log('SSE connected');
      setConnectionStatus('connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setMessages(prev => [message, ...prev.slice(0, 49)]); // Keep last 50 messages
      } catch (error) {
        console.error('Invalid SSE message:', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setConnectionStatus('disconnected');
      eventSource.close();
      
      // Retry connection after 3 seconds
      setTimeout(() => {
        if (connectionStatus !== 'connected') {
          connect();
        }
      }, 3000);
    };

    return eventSource;
  }, [url, connectionStatus]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    const eventSource = connect();
    
    return () => {
      if (eventSource) {
        eventSource.close();
        setConnectionStatus('disconnected');
      }
    };
  }, [connect]);

  return {
    messages,
    connectionStatus,
    clearMessages
  };
}