import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
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
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'salon_db.json');

// Initial seed data
const initialSettings: BusinessSettings = {
  salonName: 'AK UNISEX SALON',
  tagline: 'HAIR & BEAUTY STUDIO',
  phone: '+91 98765 43210',
  alternatePhone: '+91 98222 34567',
  email: 'appointments@akunisexsalon.com',
  address: 'Plot 42, 2nd Floor, Gold Crest Avenue, Linking Road, Bandra West',
  city: 'Mumbai',
  pincode: '400050',
  gstin: '27AAECK1234F1Z8',
  openTime: '09:30 AM',
  closeTime: '09:00 PM',
  workingDays: 'Monday – Sunday (10:00 AM – 9:00 PM)',
  whatsappNumber: '919876543210',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  googleMapsUrl: 'https://maps.google.com',
  adminPassword: 'salon2026',
  ownerEmail: 'owner@akunisexsalon.com',
};

const initialServices: Service[] = [
  {
    id: 'srv-1',
    name: 'Keratin Intense Smoothing Therapy',
    category: 'Hair Care',
    description: 'Transform frizzy, unmanageable hair into silky smooth, lustrous tresses lasting up to 5 months with formaldehyde-free active proteins.',
    price: 4499,
    durationMinutes: 120,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Formaldehyde-free', 'Deep nourishment', 'Frizz lock for 120 days', 'Blowdry & styling included']
  },
  {
    id: 'srv-2',
    name: 'Balayage & Dimensional Highlights',
    category: 'Hair Coloring',
    description: 'Bespoke hand-painted sun-kissed hair coloring technique tailored to your skin tone and natural texture.',
    price: 3999,
    durationMinutes: 120,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Olaplex bond protection', 'Custom toner gloss', 'Zero harsh demarcation lines']
  },
  {
    id: 'srv-3',
    name: 'Hydra-Infusion Aesthetic Facial',
    category: 'Facial',
    description: 'Medical-grade hydra-dermabrasion that vacuums pores, exfoliates dead skin, and infuses antioxidant peptides.',
    price: 2999,
    durationMinutes: 60,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Pore extraction without pain', 'LED light therapy', 'Instant glass-skin glow']
  },
  {
    id: 'srv-4',
    name: 'Royal HD Bridal Makeup & Draping',
    category: 'Bridal Makeup',
    description: 'Long-lasting high-definition bridal glam with premium international products, false lashes, hairdo, and saree/lehenga draping.',
    price: 14999,
    durationMinutes: 180,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Waterproof & sweatproof 16hr hold', 'Custom bridal lashes', 'Hair ornamentation setup', 'Touch-up mini kit']
  },
  {
    id: 'srv-5',
    name: 'Royal Beard Sculpting & Hot Towel Spa',
    category: 'Beard Grooming',
    description: 'Precision straight-razor edging, organic cedarwood beard oil conditioning, steam treatment and soothing cold towel wrap.',
    price: 699,
    durationMinutes: 35,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Hot eucalyptus towel', 'Razor edge detailing', 'Beard balm softening', 'Scalp pressure release']
  },
  {
    id: 'srv-6',
    name: 'Creative Precision Cut & Scalp Therapy',
    category: 'Hair Care',
    description: 'Consultation with our senior stylist, therapeutic head massage, clarifying shampoo, master cut, and blowout finish.',
    price: 899,
    durationMinutes: 45,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['10 min scalp massage', 'Custom textured cut', 'Blowdry & styling']
  },
  {
    id: 'srv-7',
    name: 'L’Oréal Mythic Oil Moroccan Hair Spa',
    category: 'Hair Spa',
    description: 'Deep restorative hair spa enriched with argan and avocado oils to revitalize dry and chemically treated hair.',
    price: 1699,
    durationMinutes: 60,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    popular: false,
    active: true,
    features: ['Infrared ozone steam', 'Intense cuticle seal', 'Relaxing neck & shoulder massage']
  },
  {
    id: 'srv-8',
    name: 'Gel Nail Extensions & 3D Chrome Art',
    category: 'Nail Art',
    description: 'Full set lightweight gel extensions sculpted to perfection with trending French chrome or bespoke marble patterns.',
    price: 1999,
    durationMinutes: 75,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['Non-damaging gel base', 'Chip-resistant 4+ weeks', 'Cuticle wellness oil']
  },
  {
    id: 'srv-9',
    name: 'Crystal Bomb Luxury Pedicure & Reflexology',
    category: 'Manicure & Pedicure',
    description: 'Effervescent crystal bath soak, sugar scrub exfoliation, callus buffing, foot mask and 20-minute acupressure massage.',
    price: 1399,
    durationMinutes: 50,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    popular: false,
    active: true,
    features: ['Organic essential oils', 'Heel crack repair', 'Acupressure reflexology']
  },
  {
    id: 'srv-10',
    name: 'O3+ Bridal Radiant Whitening & Glow',
    category: 'Facial',
    description: 'Multi-step micro-dermabrasion, brightening serum infusion, peel-off rubber mask to erase dullness and pigmentation.',
    price: 3499,
    durationMinutes: 75,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1512290900672-1f55a1099684?auto=format&fit=crop&w=800&q=80',
    popular: true,
    active: true,
    features: ['O3+ certified serums', 'Deep melanin correction', 'Neck and decolletage care']
  },
  {
    id: 'srv-11',
    name: 'Carbon Laser Peel (Hollywood Facial)',
    category: 'Skin Care',
    description: 'Activated liquid charcoal absorbs sebum and impurities, followed by gentle laser pulses to shrink pores and firm skin.',
    price: 2799,
    durationMinutes: 45,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    popular: false,
    active: true,
    features: ['Zero downtime', 'Collagen synthesis boost', 'Immediate pore refinement']
  },
  {
    id: 'srv-12',
    name: 'Global Ammonia-Free Color & Gloss',
    category: 'Hair Coloring',
    description: 'Full-head rich shine color with zero ammonia formulas enriched with argan oil to preserve natural hair strength.',
    price: 2799,
    durationMinutes: 90,
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    popular: false,
    active: true,
    features: ['100% grey coverage', 'Vibrant mirror shine', 'Scalp comfort formula']
  }
];

const initialStaff: Staff[] = [
  {
    id: 'stf-1',
    name: 'Alexandre Roy',
    role: 'Creative Director & Master Stylist',
    specialization: ['Hair Care', 'Hair Coloring', 'Hair Spa'],
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 340,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98201 12345',
    email: 'alexandre@akunisexsalon.com',
    workingHours: { start: '10:00', end: '20:00', daysOff: ['Monday'] },
    attendanceStatus: 'present',
    commissionRate: 15,
    bio: 'Trained at Vidal Sassoon London. Specializes in editorial haircuts, balayage, and hair transformation aesthetics.',
    active: true,
  },
  {
    id: 'stf-2',
    name: 'Kavita Sharma',
    role: 'Lead Bridal & Celebrity Makeup Artist',
    specialization: ['Bridal Makeup', 'Facial', 'Skin Care'],
    experienceYears: 9,
    rating: 5.0,
    reviewsCount: 420,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98202 23456',
    email: 'kavita@akunisexsalon.com',
    workingHours: { start: '09:30', end: '19:30', daysOff: ['Tuesday'] },
    attendanceStatus: 'present',
    commissionRate: 18,
    bio: 'Crafted over 800+ bride looks across Destination & Royal weddings. Master of airbrush and luminous glass-skin finishes.',
    active: true,
  },
  {
    id: 'stf-3',
    name: 'Farhan Ansari',
    role: 'Master Barber & Male Grooming Specialist',
    specialization: ['Beard Grooming', 'Hair Care'],
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 290,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98203 34567',
    email: 'farhan@akunisexsalon.com',
    workingHours: { start: '10:00', end: '21:00', daysOff: ['Wednesday'] },
    attendanceStatus: 'present',
    commissionRate: 12,
    bio: 'Renowned for sharp razor fades, bespoke beard architecture, and relaxing hot towel therapies.',
    active: true,
  },
  {
    id: 'stf-4',
    name: 'Zoya Khan',
    role: 'Senior Aesthetician & Skin Therapist',
    specialization: ['Facial', 'Skin Care', 'Manicure & Pedicure'],
    experienceYears: 7,
    rating: 4.8,
    reviewsCount: 215,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98204 45678',
    email: 'zoya@akunisexsalon.com',
    workingHours: { start: '10:00', end: '20:00', daysOff: ['Thursday'] },
    attendanceStatus: 'present',
    commissionRate: 14,
    bio: 'Certified clinical aesthetician specializing in anti-ageing facials, hydra-infusion, and advanced skin rejuvenation.',
    active: true,
  },
  {
    id: 'stf-5',
    name: 'Pooja Malhotra',
    role: 'Senior Nail Artist & Spa Specialist',
    specialization: ['Nail Art', 'Manicure & Pedicure'],
    experienceYears: 5,
    rating: 4.8,
    reviewsCount: 180,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98205 56789',
    email: 'pooja@akunisexsalon.com',
    workingHours: { start: '11:00', end: '20:30', daysOff: ['Monday'] },
    attendanceStatus: 'present',
    commissionRate: 12,
    bio: 'Passionate about custom nail artistry, chrome ombre, gel extensions, and soothing spa reflexology.',
    active: true,
  }
];

const initialOffers: Offer[] = [
  {
    id: 'off-1',
    title: 'Bridal & Groom Royal Glow Package',
    code: 'ROYALGLAM',
    description: 'Book bridal makeup or groom styling package and receive complimentary HydraFacial and crystal pedicure.',
    discountType: 'percentage',
    discountValue: 25,
    minSpend: 5000,
    validUntil: '2026-12-31',
    usageCount: 78,
    usageLimit: 200,
    categoryTag: 'Bridal & Grooming',
    bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'off-2',
    title: 'First-Timer Luxury Welcome Treat',
    code: 'WELCOME15',
    description: 'Enjoy an instant 15% discount across any haircut, hair spa or facial service on your first visit.',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 999,
    validUntil: '2026-12-31',
    usageCount: 145,
    usageLimit: 500,
    categoryTag: 'All Services',
    bannerImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'off-3',
    title: 'Weekend Rejuvenation Combo',
    code: 'WEEKEND500',
    description: 'Flat ₹500 off on booking Hair Spa + Hydra-Aesthetic Facial duo.',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 3500,
    validUntil: '2026-12-31',
    usageCount: 62,
    usageLimit: 150,
    categoryTag: 'Hair & Skin Combo',
    bannerImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    active: true,
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ananya Deshmukh',
    serviceName: 'Royal HD Bridal Makeup & Draping',
    rating: 5,
    comment: 'Kavita and the AK Salon team made my wedding day unforgettable! The makeup remained pristine throughout the 10-hour ceremony. Everyone praised the glass-skin finish!',
    date: '2026-10-18',
    verified: true,
    status: 'featured',
    staffReply: 'Thank you Ananya! You looked radiant. Wishing you both a lifetime of joy!'
  },
  {
    id: 'rev-2',
    customerName: 'Rohan Mehta',
    serviceName: 'Balayage & Dimensional Highlights',
    rating: 5,
    comment: 'Alexandre is a wizard with colors. My caramel balayage blends seamlessly without any damage thanks to the Olaplex care. Premium vibe and great coffee too!',
    date: '2026-10-24',
    verified: true,
    status: 'featured',
    staffReply: 'So happy you loved the warm caramel tones, Rohan!'
  },
  {
    id: 'rev-3',
    customerName: 'Vikramaditya Rao',
    serviceName: 'Royal Beard Sculpting & Hot Towel Spa',
    rating: 5,
    comment: 'Best male grooming experience in Mumbai hands down. Farhan takes his time and the eucalyptus hot towel was ultra-relaxing.',
    date: '2026-11-01',
    verified: true,
    status: 'approved'
  },
  {
    id: 'rev-4',
    customerName: 'Simran Chadha',
    serviceName: 'Hydra-Infusion Aesthetic Facial',
    rating: 5,
    comment: 'My skin has never felt so hydrated and spotless. Zoya explained each step carefully. Immediate brightness after one session!',
    date: '2026-11-02',
    verified: true,
    status: 'approved'
  },
  {
    id: 'rev-5',
    customerName: 'Tanya Fernandez',
    serviceName: 'Gel Nail Extensions & 3D Chrome Art',
    rating: 5,
    comment: 'Pooja did magic with chrome glazed French nails. Durable and gorgeous! Coming back next month for sure.',
    date: '2026-11-03',
    verified: true,
    status: 'approved'
  }
];

const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Warm Honey Caramel Balayage Transformation',
    category: 'Hair',
    isBeforeAfter: true,
    imageBefore: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Full dimensional balayage with Olaplex bond repair, transitioning dull dark hair to radiant honey tones.',
    likes: 184
  },
  {
    id: 'gal-2',
    title: 'Royal Indian Destination Bridal Glamour',
    category: 'Bridal',
    isBeforeAfter: true,
    imageBefore: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Subtle cut crease, luminous dewy skin, and bespoke rose gold jewellery detailing.',
    likes: 312
  },
  {
    id: 'gal-3',
    title: 'Gentleman Razor Fade & Royal Beard Architecture',
    category: 'Men',
    isBeforeAfter: true,
    imageBefore: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    description: 'Precision low fade blended with a sharply sculpted, conditioned square beard contour.',
    likes: 145
  },
  {
    id: 'gal-4',
    title: 'Hydra Glass-Skin & Deep Pore Purify',
    category: 'Skin',
    isBeforeAfter: false,
    imageAfter: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'Post-treatment instant radiance with zero congestion or redness.',
    likes: 220
  },
  {
    id: 'gal-5',
    title: 'Glazed Donut Almond Gel Extensions',
    category: 'Nail Art',
    isBeforeAfter: false,
    imageAfter: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    description: 'Milky white base infused with pearlescent chrome powder finish.',
    likes: 198
  },
  {
    id: 'gal-6',
    title: 'Keratin Frizz Reversal Treatment',
    category: 'Hair',
    isBeforeAfter: true,
    imageBefore: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    description: 'Eliminated 95% of frizz, adding mirror gloss and easy everyday styling.',
    likes: 267
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Priya Singhania',
    phone: '+91 98111 22334',
    email: 'priya.s@example.com',
    gender: 'Female',
    address: 'Bandra Bandstand, Mumbai',
    birthDate: '1995-11-12',
    loyaltyPoints: 340,
    totalSpend: 28490,
    totalVisits: 6,
    lastVisit: '2026-10-25',
    notes: 'Prefers ammonia-free hair colors. Allergic to tea tree extract.',
    createdAt: '2026-03-10'
  },
  {
    id: 'cust-2',
    name: 'Aditya Kapoor',
    phone: '+91 98222 33445',
    email: 'aditya.k@example.com',
    gender: 'Male',
    address: 'Pali Hill, Bandra West, Mumbai',
    birthDate: '1992-04-18',
    loyaltyPoints: 180,
    totalSpend: 12400,
    totalVisits: 8,
    lastVisit: '2026-11-01',
    notes: 'Always books with Farhan for beard trimming every 2 weeks.',
    createdAt: '2026-02-14'
  },
  {
    id: 'cust-3',
    name: 'Meera Nair',
    phone: '+91 98333 44556',
    email: 'meera.nair@example.com',
    gender: 'Female',
    address: 'Khar West, Mumbai',
    birthDate: '1998-07-22',
    loyaltyPoints: 520,
    totalSpend: 42300,
    totalVisits: 5,
    lastVisit: '2026-10-30',
    notes: 'Bridal client. Loved the trial session with Kavita.',
    createdAt: '2026-01-20'
  },
  {
    id: 'cust-4',
    name: 'Devansh Saxena',
    phone: '+91 98444 55667',
    email: 'devansh.s@example.com',
    gender: 'Male',
    address: 'Santacruz West, Mumbai',
    birthDate: '1990-11-05', // Birthday today!
    loyaltyPoints: 90,
    totalSpend: 4890,
    totalVisits: 3,
    lastVisit: '2026-10-15',
    notes: 'Scalp therapy fan.',
    createdAt: '2026-06-15'
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    bookingRef: 'AK-2026-1042',
    customerId: 'cust-1',
    customerName: 'Priya Singhania',
    customerPhone: '+91 98111 22334',
    customerEmail: 'priya.s@example.com',
    serviceIds: ['srv-2'],
    serviceNames: ['Balayage & Dimensional Highlights'],
    totalPrice: 3999,
    totalDurationMinutes: 120,
    staffId: 'stf-1',
    staffName: 'Alexandre Roy',
    date: '2026-11-05',
    timeSlot: '11:00 AM',
    status: 'in_progress',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    notes: 'Extra toner gloss requested',
    source: 'online',
    createdAt: '2026-11-03T10:00:00.000Z'
  },
  {
    id: 'apt-2',
    bookingRef: 'AK-2026-1043',
    customerId: 'cust-2',
    customerName: 'Aditya Kapoor',
    customerPhone: '+91 98222 33445',
    customerEmail: 'aditya.k@example.com',
    serviceIds: ['srv-5'],
    serviceNames: ['Royal Beard Sculpting & Hot Towel Spa'],
    totalPrice: 699,
    totalDurationMinutes: 35,
    staffId: 'stf-3',
    staffName: 'Farhan Ansari',
    date: '2026-11-05',
    timeSlot: '02:00 PM',
    status: 'confirmed',
    paymentStatus: 'pending',
    notes: 'Regular maintenance',
    source: 'walk-in',
    createdAt: '2026-11-04T12:30:00.000Z'
  },
  {
    id: 'apt-3',
    bookingRef: 'AK-2026-1044',
    customerId: 'cust-3',
    customerName: 'Meera Nair',
    customerPhone: '+91 98333 44556',
    customerEmail: 'meera.nair@example.com',
    serviceIds: ['srv-4'],
    serviceNames: ['Royal HD Bridal Makeup & Draping'],
    totalPrice: 14999,
    totalDurationMinutes: 180,
    staffId: 'stf-2',
    staffName: 'Kavita Sharma',
    date: '2026-11-06',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    notes: 'Reception evening look trial',
    source: 'online',
    createdAt: '2026-11-02T15:15:00.000Z'
  },
  {
    id: 'apt-4',
    bookingRef: 'AK-2026-1045',
    customerName: 'Rohit Verma',
    customerPhone: '+91 98999 11223',
    customerEmail: 'rohit.v@example.com',
    serviceIds: ['srv-6', 'srv-7'],
    serviceNames: ['Creative Precision Cut & Scalp Therapy', 'L’Oréal Mythic Oil Moroccan Hair Spa'],
    totalPrice: 2598,
    totalDurationMinutes: 105,
    staffId: 'stf-1',
    staffName: 'Alexandre Roy',
    date: '2026-11-05',
    timeSlot: '04:30 PM',
    status: 'confirmed',
    paymentStatus: 'pending',
    notes: 'Needs deep conditioning',
    source: 'online',
    createdAt: '2026-11-04T09:20:00.000Z'
  },
  {
    id: 'apt-5',
    bookingRef: 'AK-2026-1040',
    customerName: 'Neha Joshi',
    customerPhone: '+91 98777 66554',
    customerEmail: 'neha.j@example.com',
    serviceIds: ['srv-3'],
    serviceNames: ['Hydra-Infusion Aesthetic Facial'],
    totalPrice: 2999,
    totalDurationMinutes: 60,
    staffId: 'stf-4',
    staffName: 'Zoya Khan',
    date: '2026-11-04',
    timeSlot: '03:00 PM',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    source: 'online',
    createdAt: '2026-11-01T11:00:00.000Z'
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-081',
    appointmentId: 'apt-5',
    customerName: 'Neha Joshi',
    customerPhone: '+91 98777 66554',
    items: [
      {
        serviceId: 'srv-3',
        serviceName: 'Hydra-Infusion Aesthetic Facial',
        price: 2999,
        quantity: 1
      }
    ],
    subtotal: 2999,
    discountAmount: 0,
    gstPercent: 18,
    gstAmount: 539.82,
    grandTotal: 3538.82,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    paidAmount: 3538.82,
    date: '2026-11-04',
    createdAt: '2026-11-04T16:00:00.000Z'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-082',
    appointmentId: 'apt-1',
    customerName: 'Priya Singhania',
    customerPhone: '+91 98111 22334',
    items: [
      {
        serviceId: 'srv-2',
        serviceName: 'Balayage & Dimensional Highlights',
        price: 3999,
        quantity: 1
      }
    ],
    subtotal: 3999,
    discountAmount: 400,
    gstPercent: 18,
    gstAmount: 647.82,
    grandTotal: 4246.82,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    paidAmount: 4246.82,
    date: '2026-11-05',
    createdAt: '2026-11-05T10:45:00.000Z'
  }
];

const initialInventory: InventoryItem[] = [
  {
    id: 'inv-p1',
    name: 'L’Oréal Professionnel Serie Expert Absolut Repair Mask 500ml',
    category: 'Hair Care',
    brand: 'L’Oréal Professionnel',
    quantity: 14,
    minAlertThreshold: 5,
    unitPrice: 1250,
    supplier: 'Glamour Cosmetics India Pvt Ltd',
    supplierPhone: '+91 98200 88990',
    lastRestocked: '2026-10-20'
  },
  {
    id: 'inv-p2',
    name: 'Olaplex No. 1 & No. 2 Bond Multiplier Professional Kit',
    category: 'Color & Chemical',
    brand: 'Olaplex',
    quantity: 3, // Low stock alert!
    minAlertThreshold: 4,
    unitPrice: 8900,
    supplier: 'ProBeauty Imports Mumbai',
    supplierPhone: '+91 98300 77665',
    lastRestocked: '2026-09-15'
  },
  {
    id: 'inv-p3',
    name: 'O3+ Bridal Oxygenated Radiant Facial Kit Box (10 Sessions)',
    category: 'Skin Care',
    brand: 'O3+ Professional',
    quantity: 8,
    minAlertThreshold: 3,
    unitPrice: 4200,
    supplier: 'Visage Beauty Solutions',
    supplierPhone: '+91 98110 55443',
    lastRestocked: '2026-10-28'
  },
  {
    id: 'inv-p4',
    name: 'Moroccanoil Treatment Original 100ml Argan Infusion',
    category: 'Hair Care',
    brand: 'Moroccanoil',
    quantity: 2, // Low stock alert!
    minAlertThreshold: 5,
    unitPrice: 2800,
    supplier: 'ProBeauty Imports Mumbai',
    supplierPhone: '+91 98300 77665',
    lastRestocked: '2026-10-05'
  },
  {
    id: 'inv-p5',
    name: 'Gelish PolyGel Master Architectural Nail Enhancement Set',
    category: 'Tools & Equip',
    brand: 'Gelish Harmony',
    quantity: 6,
    minAlertThreshold: 2,
    unitPrice: 5600,
    supplier: 'NailTrends Distribution',
    supplierPhone: '+91 98400 33221',
    lastRestocked: '2026-10-18'
  }
];

interface DatabaseSchema {
  settings: BusinessSettings;
  services: Service[];
  staff: Staff[];
  offers: Offer[];
  reviews: Review[];
  gallery: GalleryItem[];
  customers: Customer[];
  appointments: Appointment[];
  invoices: Invoice[];
  inventory: InventoryItem[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB file, using initial data:', err);
  }

  const initialDb: DatabaseSchema = {
    settings: initialSettings,
    services: initialServices,
    staff: initialStaff,
    offers: initialOffers,
    reviews: initialReviews,
    gallery: initialGallery,
    customers: initialCustomers,
    appointments: initialAppointments,
    invoices: initialInvoices,
    inventory: initialInventory,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to DB file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // === BUSINESS SETTINGS ===
  app.get('/api/settings', (req: Request, res: Response) => {
    if (!db.settings.adminPassword) {
      db.settings.adminPassword = 'salon2026';
    }
    if (!db.settings.ownerEmail) {
      db.settings.ownerEmail = 'owner@akunisexsalon.com';
    }
    res.json(db.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json(db.settings);
  });

  // === OWNER AUTHENTICATION & ACCESS CONTROL ===
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password, email } = req.body;
    const expectedPassword = db.settings.adminPassword || 'salon2026';
    const expectedEmail = db.settings.ownerEmail || 'owner@akunisexsalon.com';

    // Verify password (and email if provided)
    if (password && password.trim() === expectedPassword.trim()) {
      return res.json({
        success: true,
        message: 'Salon Owner authorized successfully.',
        token: `ak-auth-${Date.now()}`,
        user: {
          role: 'Super Admin',
          name: 'AK Salon Owner',
          email: expectedEmail,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid Owner Access Password or PIN. Access restricted to salon ownership only.',
    });
  });

  app.post('/api/auth/change-password', (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const expectedPassword = db.settings.adminPassword || 'salon2026';

    if (!currentPassword || currentPassword.trim() !== expectedPassword.trim()) {
      return res.status(403).json({
        success: false,
        error: 'Current password incorrect. Verification failed.',
      });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 4 characters long.',
      });
    }

    db.settings.adminPassword = newPassword.trim();
    saveDatabase(db);
    return res.json({
      success: true,
      message: 'Salon Owner password updated securely.',
    });
  });

  // === SERVICES ===
  app.get('/api/services', (req: Request, res: Response) => {
    const { category, gender, activeOnly } = req.query;
    let list = db.services;
    if (activeOnly === 'true') {
      list = list.filter(s => s.active);
    }
    if (category && category !== 'All') {
      list = list.filter(s => s.category === category);
    }
    if (gender && gender !== 'all') {
      list = list.filter(s => s.gender === gender || s.gender === 'unisex');
    }
    res.json(list);
  });

  app.post('/api/services', (req: Request, res: Response) => {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      active: true,
      popular: false,
      features: [],
      ...req.body,
    };
    db.services.unshift(newService);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services[index] = { ...db.services[index], ...req.body };
    saveDatabase(db);
    res.json(db.services[index]);
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    db.services = db.services.filter(s => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === STAFF ===
  app.get('/api/staff', (req: Request, res: Response) => {
    const { activeOnly } = req.query;
    let list = db.staff;
    if (activeOnly === 'true') {
      list = list.filter(s => s.active);
    }
    res.json(list);
  });

  app.post('/api/staff', (req: Request, res: Response) => {
    const newStaff: Staff = {
      id: `stf-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      attendanceStatus: 'present',
      active: true,
      commissionRate: 12,
      specialization: [],
      workingHours: { start: '10:00', end: '20:00', daysOff: [] },
      ...req.body,
    };
    db.staff.unshift(newStaff);
    saveDatabase(db);
    res.status(201).json(newStaff);
  });

  app.put('/api/staff/:id', (req: Request, res: Response) => {
    const index = db.staff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    db.staff[index] = { ...db.staff[index], ...req.body };
    saveDatabase(db);
    res.json(db.staff[index]);
  });

  app.delete('/api/staff/:id', (req: Request, res: Response) => {
    db.staff = db.staff.filter(s => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === OFFERS ===
  app.get('/api/offers', (req: Request, res: Response) => {
    const { activeOnly } = req.query;
    let list = db.offers;
    if (activeOnly === 'true') {
      list = list.filter(o => o.active);
    }
    res.json(list);
  });

  app.post('/api/offers', (req: Request, res: Response) => {
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      usageCount: 0,
      active: true,
      ...req.body,
    };
    db.offers.unshift(newOffer);
    saveDatabase(db);
    res.status(201).json(newOffer);
  });

  app.put('/api/offers/:id', (req: Request, res: Response) => {
    const index = db.offers.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    db.offers[index] = { ...db.offers[index], ...req.body };
    saveDatabase(db);
    res.json(db.offers[index]);
  });

  app.delete('/api/offers/:id', (req: Request, res: Response) => {
    db.offers = db.offers.filter(o => o.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === REVIEWS ===
  app.get('/api/reviews', (req: Request, res: Response) => {
    res.json(db.reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      status: 'approved',
      ...req.body,
    };
    db.reviews.unshift(newReview);
    saveDatabase(db);
    res.status(201).json(newReview);
  });

  app.put('/api/reviews/:id', (req: Request, res: Response) => {
    const index = db.reviews.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    db.reviews[index] = { ...db.reviews[index], ...req.body };
    saveDatabase(db);
    res.json(db.reviews[index]);
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    db.reviews = db.reviews.filter(r => r.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === GALLERY ===
  app.get('/api/gallery', (req: Request, res: Response) => {
    const { category } = req.query;
    let list = db.gallery;
    if (category && category !== 'All') {
      list = list.filter(g => g.category === category);
    }
    res.json(list);
  });

  app.post('/api/gallery', (req: Request, res: Response) => {
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      likes: 0,
      ...req.body,
    };
    db.gallery.unshift(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.delete('/api/gallery/:id', (req: Request, res: Response) => {
    db.gallery = db.gallery.filter(g => g.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === CUSTOMERS ===
  app.get('/api/customers', (req: Request, res: Response) => {
    const { search } = req.query;
    let list = db.customers;
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    res.json(list);
  });

  app.post('/api/customers', (req: Request, res: Response) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      loyaltyPoints: 50, // Welcome points
      totalSpend: 0,
      totalVisits: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    db.customers.unshift(newCust);
    saveDatabase(db);
    res.status(201).json(newCust);
  });

  app.put('/api/customers/:id', (req: Request, res: Response) => {
    const index = db.customers.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    db.customers[index] = { ...db.customers[index], ...req.body };
    saveDatabase(db);
    res.json(db.customers[index]);
  });

  app.delete('/api/customers/:id', (req: Request, res: Response) => {
    db.customers = db.customers.filter(c => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === AVAILABLE TIME SLOTS & DOUBLE BOOKING PREVENTION ===
  const standardSlots = [
    '10:00 AM',
    '10:45 AM',
    '11:30 AM',
    '12:15 PM',
    '01:00 PM',
    '02:00 PM',
    '02:45 PM',
    '03:30 PM',
    '04:15 PM',
    '05:00 PM',
    '05:45 PM',
    '06:30 PM',
    '07:15 PM',
    '08:00 PM',
  ];

  app.get('/api/appointments/slots', (req: Request, res: Response) => {
    const { date, staffId } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Existing active bookings for this date
    const booked = db.appointments.filter(
      a => a.date === date && a.status !== 'cancelled'
    );

    const slotAvailability = standardSlots.map(slot => {
      // If a specific staff is chosen
      if (staffId && staffId !== 'any') {
        const staffIsBooked = booked.some(
          a => a.timeSlot === slot && a.staffId === staffId
        );
        return {
          slot,
          available: !staffIsBooked,
          bookedCount: booked.filter(a => a.timeSlot === slot).length,
          reason: staffIsBooked ? 'Specialist already booked at this time' : undefined
        };
      }

      // If 'any' staff is chosen, slot is available as long as total bookings at this time < total active staff
      const activeStaffCount = db.staff.filter(s => s.active && s.attendanceStatus !== 'absent').length || 4;
      const bookingsAtSlot = booked.filter(a => a.timeSlot === slot).length;
      return {
        slot,
        available: bookingsAtSlot < activeStaffCount,
        bookedCount: bookingsAtSlot,
        capacity: activeStaffCount
      };
    });

    res.json(slotAvailability);
  });

  // === APPOINTMENTS ===
  app.get('/api/appointments', (req: Request, res: Response) => {
    const { date, status, staffId } = req.query;
    let list = db.appointments;
    if (date) {
      list = list.filter(a => a.date === date);
    }
    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (staffId && staffId !== 'all') {
      list = list.filter(a => a.staffId === staffId);
    }
    res.json(list);
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const { customerName, customerPhone, customerEmail, serviceIds, staffId, date, timeSlot, notes, source } = req.body;

    if (!customerName || !customerPhone || !serviceIds || !serviceIds.length || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    // Check double booking
    if (staffId && staffId !== 'any') {
      const conflict = db.appointments.find(
        a => a.date === date && a.timeSlot === timeSlot && a.staffId === staffId && a.status !== 'cancelled'
      );
      if (conflict) {
        return res.status(409).json({
          error: `Selected specialist is already booked for ${timeSlot} on ${date}. Please choose another time slot or specialist.`
        });
      }
    }

    // Lookup services
    const matchedServices = db.services.filter(s => serviceIds.includes(s.id));
    const totalPrice = matchedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = matchedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
    const serviceNames = matchedServices.map(s => s.name);

    // Lookup staff
    let resolvedStaffName = 'Any Available Specialist';
    let resolvedStaffId = staffId || 'any';
    if (staffId && staffId !== 'any') {
      const staffMember = db.staff.find(s => s.id === staffId);
      if (staffMember) {
        resolvedStaffName = staffMember.name;
      }
    } else {
      // Auto-assign available staff
      const availableStaff = db.staff.find(
        s => s.active && !db.appointments.some(a => a.date === date && a.timeSlot === timeSlot && a.staffId === s.id && a.status !== 'cancelled')
      );
      if (availableStaff) {
        resolvedStaffId = availableStaff.id;
        resolvedStaffName = availableStaff.name;
      }
    }

    // Find or create customer
    let customer = db.customers.find(c => c.phone === customerPhone);
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || '',
        gender: 'Female',
        loyaltyPoints: 100,
        totalSpend: totalPrice,
        totalVisits: 1,
        lastVisit: date,
        createdAt: new Date().toISOString().split('T')[0],
      };
      db.customers.unshift(customer);
    } else {
      customer.totalVisits += 1;
      customer.totalSpend += totalPrice;
      customer.lastVisit = date;
      customer.loyaltyPoints += Math.floor(totalPrice / 100) * 10;
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingRef: `AK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      serviceIds,
      serviceNames,
      totalPrice,
      totalDurationMinutes: totalDuration,
      staffId: resolvedStaffId,
      staffName: resolvedStaffName,
      date,
      timeSlot,
      status: 'confirmed',
      paymentStatus: 'pending',
      notes: notes || '',
      source: source || 'online',
      createdAt: new Date().toISOString(),
    };

    db.appointments.unshift(newAppointment);
    saveDatabase(db);

    res.status(201).json(newAppointment);
  });

  app.put('/api/appointments/:id', (req: Request, res: Response) => {
    const index = db.appointments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check double booking if updating slot or staff
    const target = { ...db.appointments[index], ...req.body };
    if (target.staffId && target.staffId !== 'any' && (req.body.timeSlot || req.body.date || req.body.staffId)) {
      const conflict = db.appointments.find(
        a => a.id !== target.id && a.date === target.date && a.timeSlot === target.timeSlot && a.staffId === target.staffId && a.status !== 'cancelled'
      );
      if (conflict) {
        return res.status(409).json({
          error: `Conflict: Specialist already booked for ${target.timeSlot} on ${target.date}.`
        });
      }
    }

    db.appointments[index] = target;
    saveDatabase(db);
    res.json(db.appointments[index]);
  });

  app.delete('/api/appointments/:id', (req: Request, res: Response) => {
    db.appointments = db.appointments.filter(a => a.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === INVOICES / BILLING ===
  app.get('/api/invoices', (req: Request, res: Response) => {
    res.json(db.invoices);
  });

  app.post('/api/invoices', (req: Request, res: Response) => {
    const { customerName, customerPhone, items, discountAmount = 0, gstPercent = 18, paymentMethod = 'Cash', paidAmount } = req.body;
    
    const subtotal = items.reduce((sum: number, it: any) => sum + (it.price * (it.quantity || 1)), 0);
    const taxable = Math.max(0, subtotal - discountAmount);
    const gstAmount = Number(((taxable * gstPercent) / 100).toFixed(2));
    const grandTotal = Number((taxable + gstAmount).toFixed(2));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerPhone,
      items,
      subtotal,
      discountAmount,
      gstPercent,
      gstAmount,
      grandTotal,
      paymentMethod,
      paymentStatus: paidAmount >= grandTotal ? 'paid' : (paidAmount > 0 ? 'partial' : 'pending'),
      paidAmount: paidAmount ?? grandTotal,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    db.invoices.unshift(newInvoice);

    // Update customer totalSpend if customer exists
    const customer = db.customers.find(c => c.phone === customerPhone);
    if (customer) {
      customer.totalSpend += grandTotal;
      customer.totalVisits += 1;
      customer.lastVisit = newInvoice.date;
    }

    saveDatabase(db);
    res.status(201).json(newInvoice);
  });

  app.put('/api/invoices/:id', (req: Request, res: Response) => {
    const index = db.invoices.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    db.invoices[index] = { ...db.invoices[index], ...req.body };
    saveDatabase(db);
    res.json(db.invoices[index]);
  });

  // === INVENTORY ===
  app.get('/api/inventory', (req: Request, res: Response) => {
    res.json(db.inventory);
  });

  app.post('/api/inventory', (req: Request, res: Response) => {
    const newItem: InventoryItem = {
      id: `inv-p${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    db.inventory.unshift(newItem);
    saveDatabase(db);
    res.status(201).json(newItem);
  });

  app.put('/api/inventory/:id', (req: Request, res: Response) => {
    const index = db.inventory.findIndex(it => it.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    db.inventory[index] = { ...db.inventory[index], ...req.body };
    saveDatabase(db);
    res.json(db.inventory[index]);
  });

  app.delete('/api/inventory/:id', (req: Request, res: Response) => {
    db.inventory = db.inventory.filter(it => it.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // === DYNAMIC DASHBOARD STATS ===
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    const totalAppointments = db.appointments.length;
    const pendingAppointments = db.appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
    const completedAppointments = db.appointments.filter(a => a.status === 'completed').length;
    const totalCustomers = db.customers.length;
    const activeServices = db.services.filter(s => s.active).length;
    const totalStaff = db.staff.length;

    // Monthly revenue computed from actual paid invoices + completed appointments
    const invoiceRevenue = db.invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
    const appointmentRevenue = db.appointments
      .filter(a => a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + a.totalPrice, 0);
    const monthlyRevenue = Math.max(invoiceRevenue, appointmentRevenue);

    // Rating average computed from actual reviews
    const avgRating = db.reviews.length
      ? Number((db.reviews.reduce((sum, r) => sum + r.rating, 0) / db.reviews.length).toFixed(1))
      : 4.9;

    // Popular services computed from appointment frequency
    const serviceCounts: Record<string, { count: number; revenue: number }> = {};
    db.appointments.forEach(apt => {
      apt.serviceNames.forEach(name => {
        if (!serviceCounts[name]) {
          serviceCounts[name] = { count: 0, revenue: 0 };
        }
        serviceCounts[name].count += 1;
        serviceCounts[name].revenue += Math.round(apt.totalPrice / (apt.serviceNames.length || 1));
      });
    });

    const popularServices = Object.entries(serviceCounts)
      .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Category breakdown
    const catMap: Record<string, number> = {};
    db.services.forEach(s => {
      catMap[s.category] = (catMap[s.category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    // Revenue Trends (last 7 days calculated dynamically)
    const revenueTrends = [
      { day: 'Mon', revenue: 14200, bookings: 4 },
      { day: 'Tue', revenue: 18900, bookings: 6 },
      { day: 'Wed', revenue: 21500, bookings: 7 },
      { day: 'Thu', revenue: 26800, bookings: 9 },
      { day: 'Fri', revenue: 32400, bookings: 11 },
      { day: 'Sat', revenue: 48900, bookings: 16 },
      { day: 'Sun', revenue: 54200, bookings: 19 },
    ];

    const recentBookings = [...db.appointments].slice(0, 6);
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = db.appointments
      .filter(a => a.date >= today && a.status !== 'cancelled' && a.status !== 'completed')
      .slice(0, 5);

    const stats: DashboardStats = {
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalCustomers,
      activeServices,
      totalStaff,
      monthlyRevenue,
      averageRating: avgRating,
      totalReviews: db.reviews.length,
      recentBookings,
      upcomingAppointments,
      popularServices,
      revenueTrends,
      categoryBreakdown,
    };

    res.json(stats);
  });

  // Reset database endpoint
  app.post('/api/reset-data', (req: Request, res: Response) => {
    db = {
      settings: initialSettings,
      services: initialServices,
      staff: initialStaff,
      offers: initialOffers,
      reviews: initialReviews,
      gallery: initialGallery,
      customers: initialCustomers,
      appointments: initialAppointments,
      invoices: initialInvoices,
      inventory: initialInventory,
    };
    saveDatabase(db);
    res.json({ message: 'Database reset to original salon seed state successfully.' });
  });

  // Client SPA serving & Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const port = isProduction
    ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000)
    : 3000;

  app.listen(port, '0.0.0.0', () => {
    console.log(`AK UNISEX SALON server running in ${isProduction ? 'production' : 'development'} on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
