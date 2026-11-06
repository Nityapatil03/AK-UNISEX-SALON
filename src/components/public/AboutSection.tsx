import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Coffee, Scissors } from 'lucide-react';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Balanced Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Composite & Accreditations */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Primary Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                  alt="Stylist performing bespoke balayage at AK Salon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white text-xs font-medium">
                  Bespoke Balayage &amp; Bond Care Lounge
                </div>
              </div>

              {/* Overlapping Secondary Image */}
              <div className="hidden sm:block absolute -bottom-10 -right-6 w-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                  alt="Medical grade facial treatment room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>

              {/* Floating Highlight Box */}
              <div className="absolute -top-6 -left-4 sm:left-4 bg-[#0b132b] text-white p-4 rounded-2xl shadow-xl max-w-xs border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Excellence in Hair &amp; Skin</div>
                    <div className="text-[11px] text-slate-400">Awarded Best Luxury Unisex Salon 2025</div>
                  </div>
                </div>
              </div>

              {/* Amenities pill */}
              <div className="mt-8 sm:mt-16 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" /> Artisanal Coffee Bar
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Private Bridal Suites
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                  <Scissors className="w-3.5 h-3.5 text-rose-600" /> Bespoke Male Grooming
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Narrative & Craft Pillars */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              About AK Unisex Salon
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Luxurious Sanctuary Where Innovation Meets Authentic Craft
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Established in Bandra West, <strong>AK UNISEX SALON (HAIR &amp; BEAUTY STUDIO)</strong> was envisioned as an inclusive haven where men and women can experience world-class hair designing, skin rejuvenation, and signature grooming rituals under one roof.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              We reject one-size-fits-all treatments. Every haircut begins with a bone-structure and scalp diagnostic. Every hair color is custom-blended using bond-restoring complexes. And every aesthetic treatment is tailored to address Indian climatic factors and specific skin barrier requirements.
            </p>

            {/* 4 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-rose-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Couture Hair Architecture</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Vidal Sassoon trained stylists crafting cuts that retain effortless bounce and volume for months.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-rose-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Medical-Grade Hygiene</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Triple autoclave sterilization, single-use linen, and hospital-grade sanitized workstations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-rose-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Advanced Skin Aesthetics</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Hydra-infusion dermabrasion, carbon laser facials, and clinically certified active peptide formulas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-rose-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Exclusive Products</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Authentic Olaplex, L’Oréal Professionnel, Moroccanoil &amp; O3+ products with zero grey-market compromises.
                </p>
              </div>

            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-[#0b132b] hover:bg-rose-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer"
              >
                Experience the AK Difference
              </button>
              <a
                href="#experts"
                className="text-sm font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-4"
              >
                Meet Our Master Artists →
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
