import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Navigation,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface ContactSectionProps {
  settings: BusinessSettings | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setFormName('');
      setFormPhone('');
      setFormMsg('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Bandra West Flagship
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visit Our Sanctuary &amp; Connect With Us
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Conveniently situated on Gold Crest Avenue, Bandra West with dedicated valet parking and private luxury suites.
          </p>
        </div>

        {/* 3-Column / Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Salon Info Card */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-brand">
                  Location &amp; Studio
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif-luxury mt-1">
                  AK UNISEX SALON
                </h3>
                <p className="text-xs text-slate-500">HAIR &amp; BEAUTY STUDIO</p>
              </div>

              {/* Address item */}
              <div className="flex items-start gap-3.5 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Studio Address</div>
                  <p className="mt-0.5 leading-relaxed">
                    {settings?.address || 'Plot 42, 2nd Floor, Gold Crest Avenue, Linking Road, Bandra West'}
                  </p>
                  <p className="text-slate-400 mt-0.5">{settings?.city || 'Mumbai'}, {settings?.pincode || '400050'}</p>
                </div>
              </div>

              {/* Phone item */}
              <div className="flex items-start gap-3.5 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Direct Phone &amp; Helpline</div>
                  <p className="mt-0.5 font-medium text-slate-800">{settings?.phone || '+91 98765 43210'}</p>
                  <p className="text-slate-400">{settings?.alternatePhone || '+91 98222 34567'} (Bridal Inquiries)</p>
                </div>
              </div>

              {/* Hours item */}
              <div className="flex items-start gap-3.5 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Business Hours</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Open Today
                    </span>
                  </div>
                  <p className="mt-0.5 font-medium text-slate-800">
                    {settings?.openTime || '09:30 AM'} – {settings?.closeTime || '09:00 PM'}
                  </p>
                  <p className="text-slate-400 mt-0.5">{settings?.workingDays || 'Tuesday to Sunday (Mondays on appointment)'}</p>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=Hi%20AK%20Salon,%20I%20would%20like%20to%20consult%20about%20a%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Map Simulation + Quick Consultation Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Map Visual */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative min-h-[260px] flex flex-col justify-end">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                alt="Map area representation"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Map Floating Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce-slow">
                <div className="bg-rose-600 text-white p-3 rounded-full shadow-2xl border-2 border-white">
                  <MapPin className="w-6 h-6 fill-rose-600" />
                </div>
                <div className="bg-white/95 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-lg mt-2 font-brand">
                  AK UNISEX SALON
                </div>
              </div>

              {/* Bottom bar on map */}
              <div className="relative p-5 flex flex-wrap items-center justify-between gap-3 text-white">
                <div>
                  <div className="text-xs font-semibold text-rose-300">Linking Road, Bandra West</div>
                  <div className="text-xs text-slate-300">Valet Parking Available at Entrance</div>
                </div>
                <a
                  href={settings?.googleMapsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-600" />
                  <span>Get Directions in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Consultation Inquiry Form */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              <h4 className="font-bold text-slate-900 text-base mb-1">
                Request a Callback or Consultation
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Have specific queries regarding bridal trousseau, nanoplastia or aesthetics? Our team will reach out within 30 minutes.
              </p>

              {sentSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! Your consultation request has been received. Our salon team will call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number *"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Which service or date are you inquiring about?"
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#0b132b] hover:bg-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-rose-400" />
                    <span>Send Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
