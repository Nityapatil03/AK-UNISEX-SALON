import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Phone,
  Mail,
  Check,
  Tag,
  Share2,
  CalendarPlus,
  Loader2,
} from 'lucide-react';
import { Service, Staff, Offer, Appointment, BusinessSettings } from '../../types';
import { api } from '../../api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  staff: Staff[];
  offers: Offer[];
  settings: BusinessSettings | null;
  initialService?: Service | null;
  initialStaff?: Staff | null;
  initialOffer?: Offer | null;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  staff,
  offers,
  settings,
  initialService,
  initialStaff,
  initialOffer,
  onBookingSuccess,
}) => {
  // Step state (1: Services, 2: Specialist, 3: Date & Slot, 4: Customer Info, 5: Review & Confirm, 6: Success)
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGender, setCustomerGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [notes, setNotes] = useState('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponError, setCouponError] = useState('');

  // Slots fetching & state
  const [slots, setSlots] = useState<{ slot: string; available: boolean; bookedCount: number; reason?: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Search in services step
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('All');

  // Initialize from props
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        setSelectedServiceIds([initialService.id]);
      } else if (selectedServiceIds.length === 0 && services.length > 0) {
        setSelectedServiceIds([services[0].id]);
      }

      if (initialStaff) {
        setSelectedStaffId(initialStaff.id);
      }

      if (initialOffer) {
        setCouponCode(initialOffer.code);
        setAppliedOffer(initialOffer);
      }
    }
  }, [isOpen, initialService, initialStaff, initialOffer, services]);

  // Fetch available slots whenever date or staffId changes
  useEffect(() => {
    if (!selectedDate) return;
    let isCancelled = false;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await api.getAvailableSlots(selectedDate, selectedStaffId);
        if (!isCancelled) {
          setSlots(data);
          // If current selected slot is no longer available, reset it
          const isCurrentSlotAvailable = data.some(s => s.slot === selectedSlot && s.available);
          if (!isCurrentSlotAvailable) {
            setSelectedSlot('');
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        if (!isCancelled) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate, selectedStaffId]);

  if (!isOpen) return null;

  // Selected services calculations
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const subtotalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDurationMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedOffer) {
    if (subtotalPrice >= appliedOffer.minSpend) {
      if (appliedOffer.discountType === 'percentage') {
        discountAmount = Math.round((subtotalPrice * appliedOffer.discountValue) / 100);
      } else {
        discountAmount = appliedOffer.discountValue;
      }
    }
  }
  const finalPrice = Math.max(0, subtotalPrice - discountAmount);

  // Toggle service selection
  const handleToggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((sId) => sId !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    const found = offers.find((o) => o.code.toUpperCase() === couponCode.trim().toUpperCase() && o.active);
    if (!found) {
      setCouponError('Invalid promo code or offer expired.');
      setAppliedOffer(null);
      return;
    }
    if (subtotalPrice < found.minSpend) {
      setCouponError(`This coupon requires a minimum spend of ₹${found.minSpend}. Current subtotal is ₹${subtotalPrice}.`);
      setAppliedOffer(null);
      return;
    }
    setAppliedOffer(found);
  };

  // Validate Step 4
  const validateStep4 = () => {
    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return false;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  // Confirm and Submit Booking
  const handleSubmitBooking = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const payload: Partial<Appointment> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        serviceIds: selectedServiceIds,
        staffId: selectedStaffId,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: notes.trim(),
        source: 'online',
      };

      const result = await api.createAppointment(payload);
      setConfirmedBooking(result);
      setStep(6); // Success step

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#3b82f6', '#f59e0b'],
      });

      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Booking failed. Please try a different slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp reminder generator
  const getWhatsAppShareUrl = () => {
    if (!confirmedBooking) return '';
    const text = encodeURIComponent(
      `Hello! My appointment at AK UNISEX SALON is confirmed.\nRef: ${confirmedBooking.bookingRef}\nDate: ${confirmedBooking.date}\nTime: ${confirmedBooking.timeSlot}\nSpecialist: ${confirmedBooking.staffName}\nTotal: ₹${confirmedBooking.totalPrice}`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-[#0b132b] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 text-rose-400 flex items-center justify-center font-bold font-brand text-xs">
              AK
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight font-serif-luxury">Reserve Your Salon Experience</h2>
              <p className="text-[11px] text-slate-400">Step {step} of 5 • Real-time Slot Reservation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 5 && (
          <div className="bg-slate-100 h-1.5 w-full shrink-0">
            <div
              className="bg-rose-600 h-1.5 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: SELECT SERVICES */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Select Service(s)</h3>
                  <p className="text-xs text-slate-500">You can choose multiple services in one booking.</p>
                </div>
                <div className="text-xs font-semibold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg shrink-0">
                  {selectedServiceIds.length} Selected • ₹{subtotalPrice} • {totalDurationMinutes} mins
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search hair, facial, bridal..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Hair Coloring">Hair Coloring</option>
                  <option value="Hair Spa">Hair Spa</option>
                  <option value="Facial">Facial</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                  <option value="Beard Grooming">Beard Grooming</option>
                  <option value="Nail Art">Nail Art</option>
                  <option value="Manicure & Pedicure">Manicure &amp; Pedicure</option>
                </select>
              </div>

              {/* Service Cards Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {services
                  .filter((s) => s.active)
                  .filter((s) => serviceCategory === 'All' || s.category === serviceCategory)
                  .filter((s) => !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
                  .map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleToggleService(service.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-rose-50/60 border-rose-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 text-xs truncate">{service.name}</span>
                            <span className="text-xs font-extrabold text-slate-900 shrink-0 font-brand">₹{service.price}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {service.durationMinutes} min
                            </span>
                            <span>•</span>
                            <span className="capitalize">{service.gender}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT SPECIALIST */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Choose Your Specialist</h3>
                <p className="text-xs text-slate-500">Pick a preferred master artisan or select Any Available.</p>
              </div>

              <div className="space-y-3">
                {/* Any Specialist Option */}
                <div
                  onClick={() => setSelectedStaffId('any')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedStaffId === 'any'
                      ? 'bg-rose-50/60 border-rose-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-rose-400 flex items-center justify-center font-bold text-base font-brand">
                    AK
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Any Available Specialist</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assigns the first available top-tier specialist for maximum slot flexibility.
                    </p>
                  </div>
                </div>

                {/* Specific Staff Members */}
                {staff
                  .filter((s) => s.active)
                  .map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedStaffId(member.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        selectedStaffId === member.id
                          ? 'bg-rose-50/60 border-rose-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm truncate">{member.name}</span>
                          <span className="text-xs font-semibold text-amber-500">★ {member.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-rose-600 font-medium truncate">{member.role}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{member.experienceYears}+ years experience</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOT */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Date &amp; Available Slot</h3>
                <p className="text-xs text-slate-500">Live availability synchronized with salon schedule.</p>
              </div>

              {/* Date Input */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Available Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    Available Time Slots for {selectedDate}
                  </span>
                  {loadingSlots && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-rose-500" /> Checking...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {slots.map((s) => {
                    const isSelected = selectedSlot === s.slot;
                    return (
                      <button
                        key={s.slot}
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s.slot)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          !s.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span>{s.slot}</span>
                        <span className="text-[10px] font-normal opacity-80">
                          {s.available ? 'Available' : 'Booked'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Contact Details</h3>
                <p className="text-xs text-slate-500">We will send booking confirmations and reminders here.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="client@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Special Requests &amp; Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Allergies, scalp sensitivity, preferred style or bridal trial notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW, COUPON & CONFIRMATION */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review &amp; Confirm Booking</h3>
                <p className="text-xs text-slate-500">Please verify your appointment summary before reserving.</p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">Client</span>
                  <span className="text-xs font-semibold text-slate-900">{customerName} ({customerPhone})</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">Date &amp; Time</span>
                  <span className="text-xs font-semibold text-slate-900">{selectedDate} at {selectedSlot}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700">Specialist</span>
                  <span className="text-xs font-semibold text-slate-900">
                    {selectedStaffId === 'any' ? 'Any Available Specialist' : staff.find(s => s.id === selectedStaffId)?.name}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Services ({selectedServices.length}):</span>
                  <div className="space-y-1">
                    {selectedServices.map(s => (
                      <div key={s.id} className="flex justify-between text-xs text-slate-600">
                        <span>• {s.name} ({s.durationMinutes} min)</span>
                        <span className="font-semibold text-slate-900 font-brand">₹{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. WELCOME15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedOffer && (
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon '{appliedOffer.code}' applied! Saving ₹{discountAmount}
                  </p>
                )}
                {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
              </div>

              {/* Total Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1e293b] text-white space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{subtotalPrice.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-rose-300 font-semibold">
                    <span>Discount Applied</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-base font-extrabold font-brand">
                  <span>Total Amount</span>
                  <span className="text-rose-400 text-lg">₹{finalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  * Payable at the salon via Cash, UPI, or Card after completion of service.
                </div>
              </div>

              {submissionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: CONFIRMATION SUCCESS */}
          {step === 6 && confirmedBooking && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest font-brand">Appointment Confirmed!</span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-serif-luxury mt-1">
                  We look forward to pampering you
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Booking Reference ID: <strong className="text-slate-900 font-mono text-sm">{confirmedBooking.bookingRef}</strong>
                </p>
              </div>

              {/* Details card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Slot:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specialist:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Services:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.serviceNames.join(', ')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Total Price:</span>
                  <span className="font-extrabold text-slate-900 font-brand">₹{confirmedBooking.totalPrice}</span>
                </div>
              </div>

              {/* Share / Calendar actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </a>
                
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        {step <= 5 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => {
                  if (step === 1 && selectedServiceIds.length === 0) {
                    alert('Please select at least one service.');
                    return;
                  }
                  if (step === 3 && !selectedSlot) {
                    alert('Please choose an available time slot.');
                    return;
                  }
                  if (step === 4 && !validateStep4()) {
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Book Appointment</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
