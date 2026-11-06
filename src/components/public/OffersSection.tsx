import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, Calendar, ArrowRight, Percent } from 'lucide-react';
import { Offer } from '../../types';

interface OffersSectionProps {
  offers: Offer[];
  onClaimOffer: (offer: Offer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ offers, onClaimOffer }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeOffers = offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Tag className="w-3.5 h-3.5" />
            Limited Period Privileges
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Exclusive Packages &amp; Seasonal Offers
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Enjoy luxury salon rituals at exceptional seasonal pricing. Copy your preferred promo code and apply it directly when booking online.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gradient-to-b from-slate-50 to-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Banner Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={offer.bannerImage}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  <span>
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `FLAT ₹${offer.discountValue} OFF`}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {offer.categoryTag}
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-xs text-rose-300 font-semibold mb-0.5">Min Spend ₹{offer.minSpend}</div>
                  <h3 className="text-lg font-bold font-serif-luxury text-white line-clamp-1">{offer.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>

                  {/* Promo Code Box */}
                  <div className="bg-slate-100 p-3 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Use Promo Code</div>
                      <div className="text-base font-extrabold text-slate-900 tracking-wider font-mono">
                        {offer.code}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleCopyCode(offer.code, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        copiedCode === offer.code
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                      title="Copy promo code"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Valid until {offer.validUntil}</span>
                    <span>{offer.usageCount} clients claimed</span>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={() => onClaimOffer(offer)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0b132b] hover:bg-rose-600 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-rose-600/20 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>Claim &amp; Book Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
