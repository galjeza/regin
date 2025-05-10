import { Phone, LoadBalancingStrategy } from './types';
import axios from 'axios';

export class PhoneManager {
  private phones: Map<string, Phone> = new Map();
  private currentRoundRobinIndex: number = 0;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly OFFLINE_THRESHOLD = 60000; // 60 seconds

  constructor() {
    this.startHealthChecks();
  }

  registerPhone(phoneId: string, ip: string): void {
    this.phones.set(phoneId, {
      phoneId,
      ip,
      lastSeen: Date.now(),
      status: 'online',
      successCount: 0,
      failureCount: 0
    });
  }

  updatePhoneStatus(phoneId: string, status: Phone['status']): void {
    const phone = this.phones.get(phoneId);
    if (phone) {
      phone.status = status;
      phone.lastSeen = Date.now();
    }
  }

  getPhones(): Phone[] {
    return Array.from(this.phones.values());
  }

  getAvailablePhones(): Phone[] {
    return this.getPhones().filter(phone => phone.status === 'online');
  }

  private async checkPhoneHealth(phone: Phone): Promise<void> {
    try {
      await axios.get(`http://${phone.ip}:8080/health`, { timeout: 5000 });
      this.updatePhoneStatus(phone.phoneId, 'online');
    } catch (error) {
      if (Date.now() - phone.lastSeen > this.OFFLINE_THRESHOLD) {
        this.updatePhoneStatus(phone.phoneId, 'offline');
      }
    }
  }

  private startHealthChecks(): void {
    setInterval(() => {
      this.getPhones().forEach(phone => {
        this.checkPhoneHealth(phone);
      });
    }, this.HEALTH_CHECK_INTERVAL);
  }

  selectPhone(strategy: LoadBalancingStrategy): Phone | undefined {
    const availablePhones = this.getAvailablePhones();
    if (availablePhones.length === 0) return undefined;

    switch (strategy) {
      case 'round-robin':
        return this.roundRobin(availablePhones);
      case 'least-recently-used':
        return this.leastRecentlyUsed(availablePhones);
      case 'weighted':
        return this.weighted(availablePhones);
      default:
        return this.roundRobin(availablePhones);
    }
  }

  private roundRobin(phones: Phone[]): Phone {
    const phone = phones[this.currentRoundRobinIndex];
    this.currentRoundRobinIndex = (this.currentRoundRobinIndex + 1) % phones.length;
    return phone;
  }

  private leastRecentlyUsed(phones: Phone[]): Phone {
    return phones.reduce((prev, current) => 
      prev.lastSeen < current.lastSeen ? prev : current
    );
  }

  private weighted(phones: Phone[]): Phone {
    return phones.reduce((prev, current) => {
      const prevScore = prev.successCount / (prev.successCount + prev.failureCount || 1);
      const currentScore = current.successCount / (current.successCount + current.failureCount || 1);
      return prevScore > currentScore ? prev : current;
    });
  }

  recordSuccess(phoneId: string): void {
    const phone = this.phones.get(phoneId);
    if (phone) {
      phone.successCount++;
    }
  }

  recordFailure(phoneId: string): void {
    const phone = this.phones.get(phoneId);
    if (phone) {
      phone.failureCount++;
    }
  }
} 