import React from 'react';
import { Calendar, Sparkles, Star, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface HeroProps {
  settings: BusinessSettings | null;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenBooking }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-200/30 to-blue-200/20 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100/40 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Value Props, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Micro Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-medium shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-300 font-semibold">Bespoke Unisex Studio</span>
              <span className="text-slate-400">|</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.9 Rating (1,200+ Reviews)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Elevate Your Everyday Elegance with{' '}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-900">
                Couture Hair &amp; Skin Care
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Step into AK UNISEX SALON — Bandra’s signature sanctuary for international hair styling, 
              dimensional balayage, medical-grade hydra aesthetics, bridal glam, and royal men’s grooming.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Wait Time with Online Slots</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>Certified Sassoon &amp; O3+ Specialists</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Hospital-Grade Sanitization</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-rose-600/30 hover:shadow-rose-600/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-rose-200" />
                <span>Book Your Session Now</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-4 rounded-xl font-semibold text-base transition-all shadow-xs"
              >
                <span>View Menu &amp; Pricing</span>
              </a>
            </div>

            {/* Quick Customer Testimonial Snippet */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Client"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Client"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Client"
                />
              </div>
              <p>
                <strong className="text-slate-800 font-semibold">1,250+ clients</strong> served this month with 99.4% satisfaction
              </p>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Floating Feature Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                  alt="AK Unisex Salon Interior and Luxury Hair Styling"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Overlay Caption */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Luxury Experience
                  </div>
                  <h3 className="text-xl font-bold font-serif-luxury">
                    Precision Craft. Supreme Comfort.
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Gold Crest Avenue, Bandra West • Open Today until {settings?.closeTime || '9:00 PM'}
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Expert Styling */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Bespoke Balayage</div>
                  <div className="text-[11px] text-slate-500">Olaplex Certified Colorists</div>
                </div>
              </div>

              {/* Floating Badge 2: Hygiene Guarantee */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Sterile Salon</div>
                  <div className="text-[11px] text-slate-500">UV-C Sterilized Equipment</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white/60 border border-slate-100">
            <div className="text-3xl font-extrabold text-slate-900 font-brand">12+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Years of Studio Excellence</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-100">
            <div className="text-3xl font-extrabold text-rose-600 font-brand">15,000+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Happy Clients Pampered</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-100">
            <div className="text-3xl font-extrabold text-indigo-900 font-brand">35+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Artisan Hair &amp; Skin Rituals</div>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-slate-100">
            <div className="text-3xl font-extrabold text-amber-500 font-brand">4.9 ★</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Google &amp; Salon Rating</div>
          </div>
        </div>

      </div>
    </section>
  );
};
