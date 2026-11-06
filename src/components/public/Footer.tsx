import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, Youtube, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface FooterProps {
  settings: BusinessSettings | null;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenBooking: () => void;
  onSwitchToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPrivacy,
  onOpenTerms,
  onOpenBooking,
  onSwitchToAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[#0b132b] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold font-brand text-lg shadow-md">
                AK
              </div>
              <div>
                <div className="font-bold text-white text-lg font-brand tracking-wider">
                  AK UNISEX SALON
                </div>
                <div className="text-[10px] tracking-widest uppercase font-semibold text-rose-400">
                  HAIR &amp; BEAUTY STUDIO
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Mumbai’s premier luxury unisex salon and hair studio. Delivering bespoke hair transformations, 
              clinical skin care, royal bridal styling, and gentleman barbering with uncompromised artistry.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Signature Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-brand">
              Signature Rituals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Keratin Intense Smoothing</a></li>
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Balayage &amp; Highlighting</a></li>
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Hydra-Infusion Aesthetic Facial</a></li>
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Royal HD Bridal Makeup</a></li>
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Gentleman Beard Sculpting</a></li>
              <li><a href="#services" className="hover:text-rose-400 transition-colors">Gel Nail Extensions &amp; Chrome Art</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Hours */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-brand">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#experts" className="hover:text-white transition-colors">Our Master Stylists</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Before &amp; After Lookbook</a></li>
              <li><a href="#offers" className="hover:text-white transition-colors">Offers &amp; Packages</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Directions &amp; Map</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Admin Access */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-brand">
              Join the VIP Club
            </h4>
            <p className="text-xs text-slate-400">
              Receive secret seasonal discounts, hair care advice, and complimentary birthday upgrades.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're on the VIP list! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright, GSTIN, Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span
              onClick={onSwitchToAdmin}
              className="cursor-default select-none"
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} AK UNISEX SALON. All rights reserved. • GSTIN: {settings?.gstin || '27AAECK1234F1Z8'}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-slate-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
