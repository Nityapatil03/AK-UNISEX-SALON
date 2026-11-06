import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Phone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  Service,
  Staff,
  Offer,
  Review,
  GalleryItem,
  Appointment,
  Customer,
  Invoice,
  InventoryItem,
  BusinessSettings,
  DashboardStats,
} from './types';
import { api } from './api';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { AboutSection } from './components/public/AboutSection';
import { ServicesSection } from './components/public/ServicesSection';
import { ExpertsSection } from './components/public/ExpertsSection';
import { GallerySection } from './components/public/GallerySection';
import { OffersSection } from './components/public/OffersSection';
import { ReviewsSection } from './components/public/ReviewsSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { BookingModal } from './components/public/BookingModal';
import { LegalModal } from './components/public/LegalModals';
import { BeforeAfterSlider } from './components/public/BeforeAfterSlider';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminServices } from './components/admin/AdminServices';
import { AdminStaff } from './components/admin/AdminStaff';
import { AdminBilling } from './components/admin/AdminBilling';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminOffers } from './components/admin/AdminOffers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminSettings } from './components/admin/AdminSettings';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Core Data Stores
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Booking Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialService, setBookingInitialService] = useState<Service | null>(null);
  const [bookingInitialStaff, setBookingInitialStaff] = useState<Staff | null>(null);
  const [bookingInitialOffer, setBookingInitialOffer] = useState<Offer | null>(null);

  // Legal Modals
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Quick Action triggers in Admin
  const [quickWalkInOpen, setQuickWalkInOpen] = useState(false);
  const [quickBillingOpen, setQuickBillingOpen] = useState(false);

  // Owner Authentication Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ak_salon_admin_auth') === 'true';
  });
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Load all initial data from backend API
  const fetchAllData = useCallback(async () => {
    try {
      setLoadError(null);
      const [
        sSettings,
        sServices,
        sStaff,
        sOffers,
        sReviews,
        sGallery,
        sAppointments,
        sCustomers,
        sInvoices,
        sInventory,
        sStats,
      ] = await Promise.all([
        api.getSettings(),
        api.getServices(),
        api.getStaff(),
        api.getOffers(),
        api.getReviews(),
        api.getGallery(),
        api.getAppointments(),
        api.getCustomers(),
        api.getInvoices(),
        api.getInventory(),
        api.getDashboardStats(),
      ]);

      setSettings(sSettings);
      setServices(sServices);
      setStaff(sStaff);
      setOffers(sOffers);
      setReviews(sReviews);
      setGallery(sGallery);
      setAppointments(sAppointments);
      setCustomers(sCustomers);
      setInvoices(sInvoices);
      setInventory(sInventory);
      setDashboardStats(sStats);
    } catch (err: any) {
      console.error('Data fetch error:', err);
      setLoadError(err.message || 'Failed to connect to backend salon database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Public Booking Trigger Helpers
  const handleOpenGeneralBooking = () => {
    setBookingInitialService(null);
    setBookingInitialStaff(null);
    setBookingInitialOffer(null);
    setBookingModalOpen(true);
  };

  const handleSelectServiceFromMenu = (service: Service) => {
    setBookingInitialService(service);
    setBookingInitialStaff(null);
    setBookingInitialOffer(null);
    setBookingModalOpen(true);
  };

  const handleSelectExpertFromList = (expert: Staff) => {
    setBookingInitialService(null);
    setBookingInitialStaff(expert);
    setBookingInitialOffer(null);
    setBookingModalOpen(true);
  };

  const handleClaimOffer = (offer: Offer) => {
    setBookingInitialService(null);
    setBookingInitialStaff(null);
    setBookingInitialOffer(offer);
    setBookingModalOpen(true);
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    fetchAllData();
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    fetchAllData();
  };

  // Quick Action Handlers for Admin
  const handleAdminQuickWalkIn = () => {
    setAdminTab('appointments');
    setQuickWalkInOpen(true);
  };

  const handleAdminQuickBilling = () => {
    setAdminTab('billing');
    setQuickBillingOpen(true);
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      await api.updateAppointment(id, { status: 'confirmed' });
      fetchAllData();
    } catch (err: any) {
      alert(`Error confirming: ${err.message}`);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await api.updateAppointment(id, { status: 'cancelled' });
      fetchAllData();
    } catch (err: any) {
      alert(`Error cancelling: ${err.message}`);
    }
  };

  // Owner Access Control Handlers
  const handleRequestAdminAccess = useCallback(() => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setAdminLoginModalOpen(true);
    }
  }, [isAdminAuthenticated]);

  // Hidden owner access triggers:
  // 1. Keyboard shortcut: Ctrl+Shift+A or Alt+A
  // 2. URL hash or query: #admin or ?admin
  useEffect(() => {
    const checkUrlTrigger = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin')
      ) {
        handleRequestAdminAccess();
      }
    };
    checkUrlTrigger();
    window.addEventListener('hashchange', checkUrlTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        handleRequestAdminAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrlTrigger);
    };
  }, [handleRequestAdminAccess]);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setAdminLoginModalOpen(false);
    setViewMode('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('ak_salon_admin_auth');
    localStorage.removeItem('ak_salon_admin_token');
    setIsAdminAuthenticated(false);
    setViewMode('public');
  };

  const handleBookServiceByName = (serviceName: string) => {
    const matched = services.find(
      (s) =>
        s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(s.name.toLowerCase())
    ) || services[0];

    if (matched) {
      handleSelectServiceFromMenu(matched);
    } else {
      handleOpenGeneralBooking();
    }
  };

  // Pending counts for badges
  const pendingAppointmentsCount = appointments.filter(
    (a) => a.status === 'pending'
  ).length;
  const lowStockCount = inventory.filter((i) => i.quantity <= i.minAlertThreshold).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b19] text-white flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-brand text-2xl font-bold shadow-xl animate-pulse">
          AK
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold font-brand tracking-wider">AK UNISEX SALON</h2>
          <p className="text-xs text-rose-400 font-semibold tracking-widest uppercase">
            HAIR &amp; BEAUTY STUDIO
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          <span>Synchronizing with live salon database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased text-slate-900 bg-white">
      
      {/* =========================================================================
          VIEW MODE 1: PUBLIC-FACING LUXURY SALON WEBSITE
         ========================================================================= */}
      {viewMode === 'public' && (
        <div className="relative">
          {/* Main Top Navigation */}
          <Navbar
            settings={settings}
            onOpenBooking={handleOpenGeneralBooking}
            onSwitchToAdmin={handleRequestAdminAccess}
          />

          <main>
            {/* Hero Section */}
            <Hero
              settings={settings}
              onOpenBooking={handleOpenGeneralBooking}
            />

            {/* About Us Section (Two-column layout) */}
            <AboutSection onOpenBooking={handleOpenGeneralBooking} />

            {/* Services Catalog with Category Filters */}
            <ServicesSection
              services={services}
              onSelectService={handleSelectServiceFromMenu}
            />

            {/* Meet Our Experts / Staff Section */}
            <ExpertsSection
              staff={staff}
              onSelectExpert={handleSelectExpertFromList}
            />

            {/* Interactive Before & After Transformation Slider ("How it Looks") */}
            <BeforeAfterSlider onBookServiceByName={handleBookServiceByName} />

            {/* Lookbook Transformations & Interactive Before/After Gallery */}
            <GallerySection galleryItems={gallery} />

            {/* Dynamic Special Offers & Packages */}
            <OffersSection
              offers={offers}
              onClaimOffer={handleClaimOffer}
            />

            {/* Verified Customer Testimonials & Reviews */}
            <ReviewsSection
              reviews={reviews}
              services={services}
              onReviewAdded={handleReviewAdded}
            />

            {/* Location, Google Map & Business Hours */}
            <ContactSection settings={settings} />
          </main>

          {/* Footer */}
          <Footer
            settings={settings}
            onOpenPrivacy={() => setLegalModalType('privacy')}
            onOpenTerms={() => setLegalModalType('terms')}
            onOpenBooking={handleOpenGeneralBooking}
            onSwitchToAdmin={handleRequestAdminAccess}
          />

          {/* Sticky Mobile Quick-Book Action Bar */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-between gap-3 shadow-2xl">
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=Hello%20AK%20Salon`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-3 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm"
              title="WhatsApp Salon"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={handleOpenGeneralBooking}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white py-3 px-4 rounded-xl font-bold text-xs shadow-lg shadow-rose-600/25 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment • From ₹699</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: SALON MANAGEMENT ADMIN PANEL ERP (OWNER PROTECTED)
         ========================================================================= */}
      {viewMode === 'admin' && (
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          onExitAdmin={() => setViewMode('public')}
          onLogout={handleAdminLogout}
          onQuickWalkIn={handleAdminQuickWalkIn}
          onQuickBilling={handleAdminQuickBilling}
          pendingAppointmentsCount={pendingAppointmentsCount}
          lowStockCount={lowStockCount}
          settings={settings}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              stats={dashboardStats}
              onNavigateAppointments={() => setAdminTab('appointments')}
              onNavigateCustomers={() => setAdminTab('customers')}
              onQuickWalkIn={handleAdminQuickWalkIn}
              onQuickBilling={handleAdminQuickBilling}
              onConfirmAppointment={handleConfirmAppointment}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {adminTab === 'appointments' && (
            <AdminAppointments
              appointments={appointments}
              services={services}
              staff={staff}
              onRefresh={fetchAllData}
              openWalkInModalDefault={quickWalkInOpen}
            />
          )}

          {adminTab === 'customers' && (
            <AdminCustomers
              customers={customers}
              appointments={appointments}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'services' && (
            <AdminServices
              services={services}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'staff' && (
            <AdminStaff
              staff={staff}
              appointments={appointments}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'billing' && (
            <AdminBilling
              invoices={invoices}
              services={services}
              customers={customers}
              settings={settings}
              onRefresh={fetchAllData}
              openCreateInvoiceDefault={quickBillingOpen}
            />
          )}

          {adminTab === 'inventory' && (
            <AdminInventory
              inventory={inventory}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'offers' && (
            <AdminOffers
              offers={offers}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'reports' && (
            <AdminReports
              appointments={appointments}
              customers={customers}
              invoices={invoices}
              staff={staff}
              services={services}
            />
          )}

          {adminTab === 'reviews' && (
            <AdminReviews
              reviews={reviews}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'gallery' && (
            <AdminGallery
              gallery={gallery}
              onRefresh={fetchAllData}
            />
          )}

          {adminTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onRefresh={fetchAllData}
            />
          )}
        </AdminLayout>
      )}

      {/* =========================================================================
          COMMON GLOBAL MODALS
         ========================================================================= */}

      {/* 5-Step Appointment Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        services={services}
        staff={staff}
        offers={offers}
        settings={settings}
        initialService={bookingInitialService}
        initialStaff={bookingInitialStaff}
        initialOffer={bookingInitialOffer}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Legal Policy Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Salon Owner Password Protection Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
