import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowLeftRight,
  Columns2,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Service } from '../../types';

interface TransformationItem {
  id: string;
  title: string;
  category: 'Hair' | 'Bridal' | 'Skin' | 'Men' | 'Nail Art';
  subtitle: string;
  imageBefore: string;
  imageAfter: string;
  artistName: string;
  artistRole: string;
  duration: string;
  productsUsed: string[];
  keyOutcomes: string[];
  serviceName: string;
}

const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'trans-1',
    title: 'Warm Honey Caramel Balayage & Olaplex Restoration',
    category: 'Hair',
    subtitle: 'From brassy, damaged monotone strands to multi-dimensional sun-kissed reflection.',
    imageBefore: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    artistName: 'Alexandre Roy',
    artistRole: 'Creative Director & Master Colorist',
    duration: '120 mins',
    productsUsed: ['Olaplex No. 1 Bond Multiplier', 'L’Oréal Dialight Glaze', 'Argan Nourishing Oil'],
    keyOutcomes: ['Zero chemical breakage', 'Seamless seamless blend', 'Mirror gloss finish lasting 4+ months'],
    serviceName: 'Balayage & Dimensional Highlights',
  },
  {
    id: 'trans-2',
    title: 'Keratin Intense Frizz Reversal & Silk Treatment',
    category: 'Hair',
    subtitle: 'Tamed 95% of unruly humidity frizz into featherlight, liquid-smooth glass hair.',
    imageBefore: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80',
    artistName: 'Alexandre Roy',
    artistRole: 'Creative Director & Master Stylist',
    duration: '150 mins',
    productsUsed: ['Formaldehyde-Free Nanokeratin', 'Bio-Peptide Complex', 'Thermal Ozone Seal'],
    keyOutcomes: ['Effortless 5-minute blowdry at home', 'Resistant to Mumbai humidity', 'Soft cashmere touch'],
    serviceName: 'Keratin Intense Smoothing Therapy',
  },
  {
    id: 'trans-3',
    title: 'Royal Destination HD Bridal Glamour & Draping',
    category: 'Bridal',
    subtitle: 'Luminous dewy complexion with soft smoked rose-gold gaze and 16-hour sweatproof hold.',
    imageBefore: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    artistName: 'Kavita Sharma',
    artistRole: 'Celebrity Bridal Artist',
    duration: '180 mins',
    productsUsed: ['Dior Backstage Airbrush', 'Huda Beauty Rose Gold Eyes', 'Bespoke Feather Lashes'],
    keyOutcomes: ['Flash-photography approved', 'Zero cakey creasing', 'Includes luxury saree/lehenga draping'],
    serviceName: 'Royal HD Bridal Makeup & Draping',
  },
  {
    id: 'trans-4',
    title: 'Gentleman Razor Low Fade & Royal Beard Architecture',
    category: 'Men',
    subtitle: 'Reshaped facial contours with straight-edge precision lines and hot eucalyptus steam.',
    imageBefore: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',
    artistName: 'Farhan Ansari',
    artistRole: 'Master Barber & Male Grooming Specialist',
    duration: '45 mins',
    productsUsed: ['Cedarwood Organic Beard Butter', 'Eucalyptus Hot Towel Wrap', 'Japanese Razor Blades'],
    keyOutcomes: ['Sharp jawline definition', 'Zero razor bump irritation', 'Relaxing scalp and neck pressure release'],
    serviceName: 'Royal Beard Sculpting & Hot Towel Spa',
  },
  {
    id: 'trans-5',
    title: 'Hydra-Infusion Aesthetic Glow & Deep Pore Purify',
    category: 'Skin',
    subtitle: 'Vortex suction removed sebum and stubborn congestion, infused antioxidant peptides.',
    imageBefore: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80',
    imageAfter: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    artistName: 'Zoya Khan',
    artistRole: 'Clinical Aesthetician & Skin Specialist',
    duration: '60 mins',
    productsUsed: ['Salicylic Vortex Extraction', 'Hyaluronic Acid Peptides', 'Cold Blue LED Therapy'],
    keyOutcomes: ['Instant glassy skin glow', 'Refined pore visibility', 'Zero downtime or peeling'],
    serviceName: 'Hydra-Infusion Aesthetic Facial',
  },
];

interface BeforeAfterSliderProps {
  onBookServiceByName?: (serviceName: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onBookServiceByName }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'flip'>('slider');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTransformation = TRANSFORMATIONS[activeItemIndex];

  // Mouse & touch drag calculation for slider
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = Math.round((clamped / rect.width) * 100);
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden border-b border-slate-200/80">
      
      {/* Subtle background ambient circles */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Transformation Studio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-luxury">
            See the Before &amp; After Difference
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Drag the comparison slider horizontally or switch view modes to inspect how our signature rituals transform hair texture, bridal elegance, and skin vitality.
          </p>

          {/* Transformation Selectors Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
            {TRANSFORMATIONS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeItemIndex === idx
                    ? 'bg-[#0b132b] text-white shadow-md scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {item.category}: {item.title.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="font-bold text-slate-900 font-brand">Case #{activeItemIndex + 1} of {TRANSFORMATIONS.length}:</span>
            <span className="text-slate-700 font-semibold">{activeTransformation.category} Transformation</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'slider' ? 'bg-[#0b132b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-[#0b132b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side by Side</span>
            </button>
            <button
              onClick={() => setViewMode('flip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'flip' ? 'bg-[#0b132b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Flip Mode</span>
            </button>
          </div>
        </div>

        {/* Main Transformation Presentation Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Visual Showcase (Columns 1-7) */}
          <div className="lg:col-span-7 bg-slate-950 relative select-none min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
            
            {/* VIEW MODE A: INTERACTIVE SPLIT SLIDER */}
            {viewMode === 'slider' && (
              <div
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchMove={handleTouchMove}
                onClick={handleContainerClick}
                className="w-full h-full relative cursor-ew-resize min-h-[380px] sm:min-h-[460px] overflow-hidden group"
              >
                {/* Background: AFTER Image */}
                <img
                  src={activeTransformation.imageAfter}
                  alt={`${activeTransformation.title} After`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* "AFTER" Floating Badge */}
                <div className="absolute top-4 right-4 z-10 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AFTER
                </div>

                {/* Foreground Clipped: BEFORE Image */}
                <div
                  className="absolute inset-0 h-full overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={activeTransformation.imageBefore}
                    alt={`${activeTransformation.title} Before`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{
                      width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                      height: '100%',
                    }}
                  />
                  
                  {/* "BEFORE" Floating Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md text-rose-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-md tracking-wider border border-slate-700">
                    BEFORE
                  </div>
                </div>

                {/* Divider Line & Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Circular Grab Handle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center border-2 border-slate-900 font-bold transition-transform group-hover:scale-110">
                    <ArrowLeftRight className="w-4 h-4 text-rose-600" />
                  </div>
                </div>

                {/* Instruction Bottom Pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-950/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-3.5 py-1 rounded-full shadow-lg border border-slate-800 pointer-events-none">
                  ⇄ Drag slider or tap to compare ({sliderPosition}% revealed)
                </div>
              </div>
            )}

            {/* VIEW MODE B: SIDE BY SIDE */}
            {viewMode === 'side-by-side' && (
              <div className="w-full h-full grid grid-cols-2 min-h-[380px] sm:min-h-[460px]">
                <div className="relative border-r border-slate-800 overflow-hidden">
                  <img
                    src={activeTransformation.imageBefore}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-rose-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    BEFORE
                  </div>
                </div>
                <div className="relative overflow-hidden">
                  <img
                    src={activeTransformation.imageAfter}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    AFTER
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE C: FLIP / TOGGLE */}
            {viewMode === 'flip' && (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full relative cursor-pointer min-h-[380px] sm:min-h-[460px]"
              >
                <img
                  src={isFlipped ? activeTransformation.imageBefore : activeTransformation.imageAfter}
                  alt={isFlipped ? 'Before' : 'After'}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800">
                  Showing: <span className={isFlipped ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>{isFlipped ? 'BEFORE' : 'AFTER'}</span>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl">
                  Click Anywhere to Flip to {isFlipped ? 'AFTER' : 'BEFORE'}
                </div>
              </div>
            )}

          </div>

          {/* Details & Action Panel (Columns 8-12) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  {activeTransformation.category} Artistry
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  {activeTransformation.duration}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-luxury leading-tight">
                {activeTransformation.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeTransformation.subtitle}
              </p>

              {/* Master Specialist Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-rose-400 flex items-center justify-center font-brand font-bold text-sm shrink-0">
                  AK
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{activeTransformation.artistName}</div>
                  <div className="text-[11px] text-rose-600 font-medium truncate">{activeTransformation.artistRole}</div>
                </div>
              </div>

              {/* Key Improvements Checkpoints */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Signature Improvements
                </div>
                {activeTransformation.keyOutcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              {/* Product Formulations */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 mb-1.5 font-medium">
                  Products &amp; Active Ingredients:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTransformation.productsUsed.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking CTA Button */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  if (onBookServiceByName) {
                    onBookServiceByName(activeTransformation.serviceName);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0f172a] hover:from-rose-600 hover:to-rose-700 text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-rose-600/25 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Book This Transformation ({activeTransformation.serviceName})</span>
              </button>

              {/* Navigation pagination buttons */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  onClick={() => {
                    setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : TRANSFORMATIONS.length - 1));
                    setIsFlipped(false);
                  }}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Look
                </button>
                <span>{activeItemIndex + 1} / {TRANSFORMATIONS.length}</span>
                <button
                  onClick={() => {
                    setActiveItemIndex((prev) => (prev < TRANSFORMATIONS.length - 1 ? prev + 1 : 0));
                    setIsFlipped(false);
                  }}
                  className="flex items-center gap-1 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Next Look <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
