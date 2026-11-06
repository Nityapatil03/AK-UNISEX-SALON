export type ServiceCategory =
  | 'Hair Care'
  | 'Hair Coloring'
  | 'Hair Spa'
  | 'Facial'
  | 'Skin Care'
  | 'Bridal Makeup'
  | 'Beard Grooming'
  | 'Nail Art'
  | 'Manicure & Pedicure';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  gender: 'unisex' | 'women' | 'men';
  image: string;
  popular?: boolean;
  active: boolean;
  features?: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: ServiceCategory[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  phone: string;
  email: string;
  workingHours: {
    start: string; // "10:00"
    end: string;   // "20:00"
    daysOff: string[]; // ["Monday"]
  };
  attendanceStatus: 'present' | 'absent' | 'on_leave';
  commissionRate: number; // e.g. 15 (%)
  bio: string;
  active: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';

export interface Appointment {
  id: string;
  bookingRef: string; // e.g. "AK-2026-8942"
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMinutes: number;
  staffId: string; // or 'any'
  staffName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "11:00 AM"
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'Cash' | 'UPI' | 'Card' | 'Online';
  notes?: string;
  source: 'online' | 'walk-in';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Female' | 'Male' | 'Other';
  address?: string;
  birthDate?: string;
  loyaltyPoints: number;
  totalSpend: number;
  totalVisits: number;
  lastVisit?: string;
  notes?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  validUntil: string;
  usageCount: number;
  usageLimit?: number;
  categoryTag: string;
  bannerImage: string;
  active: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  status: 'approved' | 'pending' | 'featured';
  staffReply?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Hair' | 'Bridal' | 'Skin' | 'Nail Art' | 'Men';
  imageBefore?: string;
  imageAfter: string;
  isBeforeAfter: boolean;
  description: string;
  likes: number;
}

export interface InvoiceItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  appointmentId?: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  gstPercent: number; // 5% or 18%
  gstAmount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Split';
  paymentStatus: PaymentStatus;
  paidAmount: number;
  date: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Hair Care' | 'Skin Care' | 'Color & Chemical' | 'Tools & Equip' | 'Disposables';
  brand: string;
  quantity: number;
  minAlertThreshold: number;
  unitPrice: number;
  supplier: string;
  supplierPhone: string;
  lastRestocked: string;
}

export interface BusinessSettings {
  salonName: string;
  tagline: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  gstin: string;
  openTime: string;
  closeTime: string;
  workingDays: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  adminPassword?: string;
  ownerEmail?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalCustomers: number;
  activeServices: number;
  totalStaff: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  recentBookings: Appointment[];
  upcomingAppointments: Appointment[];
  popularServices: { name: string; count: number; revenue: number }[];
  revenueTrends: { day: string; revenue: number; bookings: number }[];
  categoryBreakdown: { category: string; count: number }[];
}
