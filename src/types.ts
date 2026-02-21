export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user' | 'creator';
  tier: number;
  balance: number;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  tier: number;
  icon: string;
  status: 'active' | 'locked' | 'coming_soon';
}

export interface Lead {
  name: string;
  interest: string;
  source: string;
}
