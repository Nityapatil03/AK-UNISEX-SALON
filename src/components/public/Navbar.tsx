import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X, Sparkles, Clock, MessageCircle } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface NavbarProps {
  settings: BusinessSettings | null;
  onOpenBooking: () => void;
  onSwitchToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenBooking, onSwitchToAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Experts', href: '#experts' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Offers', href: '#offers' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#0b132b] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Festive Glow Offer: Up to 25% OFF on Bridal &amp; Styling Packages
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {settings?.openTime || '9:30 AM'} – {settings?.closeTime || '9:00 PM'} (Tue – Sun)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${settings?.phone || '+919876543210'}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-rose-400" />
              <span>{settings?.phone || '+91 98765 43210'}</span>
            </a>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=Hi%20AK%20Salon,%20I%20would%20like%20to%20inquire%20about%20salon%20appointments.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5 border-b border-slate-100'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b132b] to-[#1e3a8a] flex items-center justify-center text-white shadow-md shadow-slate-900/10 font-bold tracking-wider text-lg border border-slate-700/20 group-hover:scale-105 transition-transform">
              <span className="text-rose-400 font-brand">AK</span>
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-lg sm:text-xl font-brand">
                AK UNISEX SALON
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-rose-600">
                Hair &amp; Beauty Studio
              </div>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-500 hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0b132b] via-[#1e293b] to-[#0f172a] hover:from-rose-600 hover:to-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-slate-900/10 hover:shadow-rose-600/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="bg-rose-600 text-white p-2 rounded-lg sm:hidden"
              title="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0b132b] flex items-center justify-center text-rose-400 font-brand font-bold text-sm">
                    AK
                  </div>
                  <span className="font-bold text-slate-900 font-brand text-sm">AK UNISEX SALON</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-base font-medium text-slate-700 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-rose-600/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-medium text-slate-800">{settings?.phone}</p>
              <p className="mt-1">{settings?.address}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
