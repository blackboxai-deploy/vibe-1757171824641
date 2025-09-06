"use client";

import { WebSocketMessage } from './types';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (message: WebSocketMessage) => void;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;

  constructor(url: string, onMessage: (message: WebSocketMessage) => void) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    try {
      // Create WebSocket URL - handle both development and production
      const wsUrl = this.url.startsWith('ws') 
        ? this.url 
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${this.url}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.onMessage(message);
        } catch (error) {
          console.error('Invalid WebSocket message:', event.data);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export function createWebSocketClient(onMessage: (message: WebSocketMessage) => void): WebSocketClient {
  return new WebSocketClient('/api/ws', onMessage);
}