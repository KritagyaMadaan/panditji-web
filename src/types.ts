export type Role = "customer" | "pandit" | "admin";
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface User {
  id: number;
  uid: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: Role;
  isVerified: boolean;
  photoUrl: string | null;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  description: string | null;
  basePrice: string;
  durationMins: number;
  imageUrl: string | null;
}

export interface Booking {
  id: number;
  customerId: number;
  panditId: number;
  serviceId: number;
  status: BookingStatus;
  scheduledAt: string;
  address: string;
  totalAmount: string;
}

export interface Pandit {
  id: number;
  name: string;
  photoUrl: string | null;
  bio: string | null;
  experience: number;
  rating: string | null;
}
