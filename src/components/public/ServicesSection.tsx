import React, { useState, useMemo } from 'react';
import { Search, Clock, Sparkles, Check, ArrowRight, UserCheck } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const CATEGORIES: ('All' | ServiceCategory)[] = [
  'All',
  'Hair Care',
  'Hair Coloring',
  'Hair Spa',
  'Facial',
  'Skin Care',
  'Bridal Makeup',
  'Beard Grooming',
  'Nail Art',
  'Manicure & Pedicure',
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');
  const [genderFilter, setGenderFilter] = useState<'all' | 'women' | 'men'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category match
      if (selectedCategory !== 'All' && service.category !== selectedCategory) {
        return false;
      }
      // Gender match
      if (genderFilter !== 'all' && service.gender !== 'unisex' && service.gender !== genderFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(q);
        const matchesDesc = service.description.toLowerCase().includes(q);
        const matchesCat = service.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return service.active;
    });
  }, [services, selectedCategory, genderFilter, searchQuery]);

  return (
    <section id="services" className="py-20 bg-slate-50 relative border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Studio Menu
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Curated Hair, Skin &amp; Grooming Rituals
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Transparent pricing, master practitioners, and premium international product lines. Select a service to reserve your preferred specialist and time slot.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. Balayage, Keratin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Gender Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  genderFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Genders
              </button>
              <button
                onClick={() => setGenderFilter('women')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  genderFilter === 'women'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Women's
              </button>
              <button
                onClick={() => setGenderFilter('men')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  genderFilter === 'men'
                    ? 'bg-[#0b132b] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Men's
              </button>
            </div>

            {/* Service counter */}
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Showing <span className="text-slate-900 font-bold">{filteredServices.length}</span> curated services
            </div>
          </div>

          {/* Category Horizontal Scrolling Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0b132b] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-base">No services found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setGenderFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-rose-600 text-sm font-semibold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {service.category}
                  </span>

                  {/* Popular Flag */}
                  {service.popular && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Client Favorite
                    </span>
                  )}

                  {/* Price & Duration overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="text-xl font-extrabold text-white font-brand">
                      ₹{service.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-slate-200">
                      <Clock className="w-3 h-3 text-rose-400" />
                      <span>{service.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                      <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {service.gender}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features checklist */}
                    {service.features && service.features.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Booking CTA Button */}
                  <div className="pt-3">
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full flex items-center justify-center gap-2 bg-[#0b132b] hover:bg-rose-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-rose-600/25 group-hover:bg-rose-600 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Book This Service</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
