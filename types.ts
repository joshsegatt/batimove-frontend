export enum QuoteStep {
  TYPE = 0,
  DETAILS = 1,
  LOGISTICS = 2,
  CONTACT = 3
}

export type ServiceId = 'priv' | 'pro' | 'clean' | 'storage' | 'lift' | 'inter' | 'general';

export interface QuoteData {
  serviceId: ServiceId;
  // Common
  date: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  // Moving Specific
  fromZip?: string;
  toZip?: string;
  volume?: number; // m3
  rooms?: number;
  housingType?: 'appartement' | 'maison' | 'bureau';
  // Cleaning Specific
  surface?: number; // m2
  // Storage Specific
  duration?: 'court' | 'moyen' | 'long' | 'indetermine';
  // Lift Specific
  floor?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  iconName: string;
}