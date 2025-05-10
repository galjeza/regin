export interface Phone {
  phoneId: string;
  ip: string;
  lastSeen: number;
  status: 'online' | 'offline' | 'idle';
  successCount: number;
  failureCount: number;
}

export interface RegisterRequest {
  phoneId: string;
  ip: string;
}

export interface SendSmsRequest {
  to: string;
  msg: string;
}

export type LoadBalancingStrategy = 'round-robin' | 'least-recently-used' | 'weighted'; 