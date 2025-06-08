import { io, Socket } from "socket.io-client";
import { PerformanceMetric, CampaignAnalytics } from "@/types/analytics";

export interface RealTimeData {
  metrics: PerformanceMetric[];
  campaigns: CampaignAnalytics[];
  alerts: AlertData[];
  timestamp: string;
}

export interface AlertData {
  id: string;
  type: "performance" | "budget" | "error" | "warning";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  campaignId?: string;
  audienceId?: string;
  timestamp: string;
  isRead: boolean;
}

class RealTimeAnalyticsService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.connect();
  }

  private connect() {
    // In production, this would connect to your WebSocket server
    // For demo purposes, we'll simulate with mock data
    this.simulateConnection();
  }

  private simulateConnection() {
    this.isConnected = true;
    this.emit("connected", true);

    // Simulate real-time data updates every 5 seconds
    setInterval(() => {
      this.generateMockRealTimeData();
    }, 5000);

    // Simulate alerts occasionally
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.generateMockAlert();
      }
    }, 15000);
  }

  private generateMockRealTimeData() {
    const metrics: PerformanceMetric[] = [
      {
        id: "1",
        name: "Total Reach",
        value: Math.floor(Math.random() * 100000) + 2400000,
        previousValue: 2450000,
        change: (Math.random() - 0.5) * 20,
        changeType: Math.random() > 0.5 ? "increase" : "decrease",
        unit: "number",
        period: "day",
      },
      {
        id: "2",
        name: "Conversion Rate",
        value: parseFloat((Math.random() * 2 + 2.5).toFixed(2)),
        previousValue: 3.2,
        change: (Math.random() - 0.5) * 30,
        changeType: Math.random() > 0.5 ? "increase" : "decrease",
        unit: "percentage",
        period: "day",
      },
      {
        id: "3",
        name: "Cost Per Acquisition",
        value: parseFloat((Math.random() * 20 + 35).toFixed(2)),
        previousValue: 45.2,
        change: (Math.random() - 0.5) * 25,
        changeType: Math.random() > 0.5 ? "decrease" : "increase",
        unit: "currency",
        period: "day",
      },
      {
        id: "4",
        name: "Return on Ad Spend",
        value: parseFloat((Math.random() * 2 + 3.5).toFixed(2)),
        previousValue: 4.8,
        change: (Math.random() - 0.5) * 20,
        changeType: Math.random() > 0.5 ? "increase" : "decrease",
        unit: "number",
        period: "day",
      },
    ];

    const data: RealTimeData = {
      metrics,
      campaigns: [],
      alerts: [],
      timestamp: new Date().toISOString(),
    };

    this.emit("data", data);
  }

  private generateMockAlert() {
    const alertTypes = ["performance", "budget", "error", "warning"] as const;
    const severities = ["low", "medium", "high", "critical"] as const;

    const alerts = [
      {
        title: "High CPA Alert",
        message: 'Campaign "Summer Sale 2024" has exceeded target CPA by 25%',
        type: "performance" as const,
      },
      {
        title: "Budget Alert",
        message: 'Daily budget for "Mobile App Install" campaign is 90% spent',
        type: "budget" as const,
      },
      {
        title: "Low CTR Warning",
        message:
          'Click-through rate dropped below 1% for "Retargeting Campaign"',
        type: "warning" as const,
      },
      {
        title: "Integration Error",
        message: "Facebook Ads API sync failed. Data may be delayed.",
        type: "error" as const,
      },
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];

    const alert: AlertData = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: randomAlert.type,
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: randomAlert.title,
      message: randomAlert.message,
      campaignId: `campaign_${Math.floor(Math.random() * 5) + 1}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    this.emit("alert", alert);
  }

  public subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isConnected = false;
    this.emit("connected", false);
  }

  public reconnect() {
    this.disconnect();
    this.connect();
  }
}

export const realTimeAnalytics = new RealTimeAnalyticsService();
