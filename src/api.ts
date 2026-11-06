import {
  Service,
  Staff,
  Appointment,
  Customer,
  Offer,
  Review,
  GalleryItem,
  Invoice,
  InventoryItem,
  BusinessSettings,
  DashboardStats,
} from './types';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Settings
  getSettings: () => fetch(`${BASE_URL}/settings`).then(r => handleResponse<BusinessSettings>(r)),
  updateSettings: (settings: Partial<BusinessSettings>) =>
    fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).then(r => handleResponse<BusinessSettings>(r)),

  // Owner Authentication
  loginAdmin: (password: string, email?: string) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email }),
    }).then(r => handleResponse<{ success: boolean; token: string; user: any; message: string }>(r)),

  changeAdminPassword: (currentPassword: string, newPassword: string) =>
    fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    }).then(r => handleResponse<{ success: boolean; message: string }>(r)),

  // Services
  getServices: (params?: { category?: string; gender?: string; activeOnly?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.gender) q.append('gender', params.gender);
    if (params?.activeOnly) q.append('activeOnly', 'true');
    return fetch(`${BASE_URL}/services?${q.toString()}`).then(r => handleResponse<Service[]>(r));
  },
  createService: (service: Partial<Service>) =>
    fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    }).then(r => handleResponse<Service>(r)),
  updateService: (id: string, service: Partial<Service>) =>
    fetch(`${BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    }).then(r => handleResponse<Service>(r)),
  deleteService: (id: string) =>
    fetch(`${BASE_URL}/services/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Staff
  getStaff: (activeOnly?: boolean) => {
    const url = activeOnly ? `${BASE_URL}/staff?activeOnly=true` : `${BASE_URL}/staff`;
    return fetch(url).then(r => handleResponse<Staff[]>(r));
  },
  createStaff: (staff: Partial<Staff>) =>
    fetch(`${BASE_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    }).then(r => handleResponse<Staff>(r)),
  updateStaff: (id: string, staff: Partial<Staff>) =>
    fetch(`${BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff),
    }).then(r => handleResponse<Staff>(r)),
  deleteStaff: (id: string) =>
    fetch(`${BASE_URL}/staff/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Offers
  getOffers: (activeOnly?: boolean) => {
    const url = activeOnly ? `${BASE_URL}/offers?activeOnly=true` : `${BASE_URL}/offers`;
    return fetch(url).then(r => handleResponse<Offer[]>(r));
  },
  createOffer: (offer: Partial<Offer>) =>
    fetch(`${BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    }).then(r => handleResponse<Offer>(r)),
  updateOffer: (id: string, offer: Partial<Offer>) =>
    fetch(`${BASE_URL}/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    }).then(r => handleResponse<Offer>(r)),
  deleteOffer: (id: string) =>
    fetch(`${BASE_URL}/offers/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Reviews
  getReviews: () => fetch(`${BASE_URL}/reviews`).then(r => handleResponse<Review[]>(r)),
  createReview: (review: Partial<Review>) =>
    fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    }).then(r => handleResponse<Review>(r)),
  updateReview: (id: string, review: Partial<Review>) =>
    fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    }).then(r => handleResponse<Review>(r)),
  deleteReview: (id: string) =>
    fetch(`${BASE_URL}/reviews/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Gallery
  getGallery: (category?: string) => {
    const url = category && category !== 'All' ? `${BASE_URL}/gallery?category=${category}` : `${BASE_URL}/gallery`;
    return fetch(url).then(r => handleResponse<GalleryItem[]>(r));
  },
  createGalleryItem: (item: Partial<GalleryItem>) =>
    fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).then(r => handleResponse<GalleryItem>(r)),
  deleteGalleryItem: (id: string) =>
    fetch(`${BASE_URL}/gallery/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Slots & Double-Booking Check
  getAvailableSlots: (date: string, staffId?: string) => {
    const q = new URLSearchParams({ date });
    if (staffId) q.append('staffId', staffId);
    return fetch(`${BASE_URL}/appointments/slots?${q.toString()}`).then(r =>
      handleResponse<{ slot: string; available: boolean; bookedCount: number; reason?: string }[]>(r)
    );
  },

  // Appointments
  getAppointments: (params?: { date?: string; status?: string; staffId?: string }) => {
    const q = new URLSearchParams();
    if (params?.date) q.append('date', params.date);
    if (params?.status) q.append('status', params.status);
    if (params?.staffId) q.append('staffId', params.staffId);
    return fetch(`${BASE_URL}/appointments?${q.toString()}`).then(r => handleResponse<Appointment[]>(r));
  },
  createAppointment: (appointment: Partial<Appointment>) =>
    fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).then(r => handleResponse<Appointment>(r)),
  updateAppointment: (id: string, appointment: Partial<Appointment>) =>
    fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).then(r => handleResponse<Appointment>(r)),
  deleteAppointment: (id: string) =>
    fetch(`${BASE_URL}/appointments/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Customers
  getCustomers: (search?: string) => {
    const url = search ? `${BASE_URL}/customers?search=${encodeURIComponent(search)}` : `${BASE_URL}/customers`;
    return fetch(url).then(r => handleResponse<Customer[]>(r));
  },
  createCustomer: (customer: Partial<Customer>) =>
    fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }).then(r => handleResponse<Customer>(r)),
  updateCustomer: (id: string, customer: Partial<Customer>) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }).then(r => handleResponse<Customer>(r)),
  deleteCustomer: (id: string) =>
    fetch(`${BASE_URL}/customers/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Invoices
  getInvoices: () => fetch(`${BASE_URL}/invoices`).then(r => handleResponse<Invoice[]>(r)),
  createInvoice: (invoice: Partial<Invoice>) =>
    fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }).then(r => handleResponse<Invoice>(r)),
  updateInvoice: (id: string, invoice: Partial<Invoice>) =>
    fetch(`${BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }).then(r => handleResponse<Invoice>(r)),

  // Inventory
  getInventory: () => fetch(`${BASE_URL}/inventory`).then(r => handleResponse<InventoryItem[]>(r)),
  createInventoryItem: (item: Partial<InventoryItem>) =>
    fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).then(r => handleResponse<InventoryItem>(r)),
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) =>
    fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).then(r => handleResponse<InventoryItem>(r)),
  deleteInventoryItem: (id: string) =>
    fetch(`${BASE_URL}/inventory/${id}`, { method: 'DELETE' }).then(r => handleResponse<{ success: boolean }>(r)),

  // Dashboard stats
  getDashboardStats: () => fetch(`${BASE_URL}/dashboard/stats`).then(r => handleResponse<DashboardStats>(r)),

  // Reset database
  resetDatabase: () =>
    fetch(`${BASE_URL}/reset-data`, { method: 'POST' }).then(r => handleResponse<{ message: string }>(r)),
};
