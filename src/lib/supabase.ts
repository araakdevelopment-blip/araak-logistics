import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type QuoteRequest = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service_type: 'B2B' | 'B2C' | 'B2G' | 'B2Service';
  origin: string;
  destination: string;
  weight?: number;
  dimensions?: string;
  description?: string;
  status?: string;
  created_at?: string;
};

export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
};

export type ShipmentTracking = {
  id?: string;
  tracking_number: string;
  status: string;
  shipper_name?: string;
  origin: string;
  destination: string;
  current_location?: string;
  estimated_delivery?: string;
  service_type?: string;
  events?: TrackingEvent[];
  created_at?: string;
  updated_at?: string;
};

export type TrackingEvent = {
  timestamp: string;
  status: string;
  location: string;
  icon: string;
};
