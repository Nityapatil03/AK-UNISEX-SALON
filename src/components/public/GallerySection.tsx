import React, { useState } from 'react';
import { Sparkles, Maximize2, X, Heart, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBeforeAfter, setActiveBeforeAfter] = useState<Record<string, 'before' | 'after'>>({});
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const categories = ['All', 'Hair', 'Bridal', 'Skin', 'Nail Art', 'Men'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const toggleBeforeAfter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBeforeAfter((prev) => ({
      ...prev,
      [id]: prev[id] === 'before' ? 'after' : 'before',
    }));
  };

  const handleLike = (id: string, defaultLikes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? defaultLikes) + 1,
    }));
  };

  return (
    <section id="gallery" className="py-20 bg-slate-50 relative border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Transformations &amp; Lookbook
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Transformations, Flawless Results
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Browse our signature transformations. Click the Before / After toggle to inspect the meticulous precision and artistry.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0b132b] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const currentMode = activeBeforeAfter[item.id] || 'after';
            const displayImage = item.isBeforeAfter
              ? (currentMode === 'before' && item.imageBefore ? item.imageBefore : item.imageAfter)
              : item.imageAfter;
            const currentLikes = likes[item.id] ?? item.likes;

            return (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200/80 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={displayImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-900 shadow-sm">
                    {item.category}
                  </div>

                  {/* Fullscreen icon button */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Before / After toggle badge on card */}
                  {item.isBeforeAfter && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <button
                        onClick={(e) => toggleBeforeAfter(item.id, e)}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all transform hover:scale-105"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>Showing: {currentMode.toUpperCase()} (Click to switch)</span>
                      </button>
                    </div>
                  )}

                  {/* Likes counter */}
                  <button
                    onClick={(e) => handleLike(item.id, item.likes, e)}
                    className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-rose-300 hover:text-rose-400 px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    <span>{currentLikes}</span>
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="relative bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row">
            
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image display */}
            <div className="md:w-3/5 relative bg-black flex items-center justify-center min-h-[300px]">
              {lightboxItem.isBeforeAfter ? (
                <div className="w-full h-full relative">
                  <img
                    src={
                      activeBeforeAfter[lightboxItem.id] === 'before' && lightboxItem.imageBefore
                        ? lightboxItem.imageBefore
                        : lightboxItem.imageAfter
                    }
                    alt={lightboxItem.title}
                    className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
                  />
                  <div className="absolute bottom-4 left-4">
                    <button
                      onClick={(e) => toggleBeforeAfter(lightboxItem.id, e)}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>Switch to {activeBeforeAfter[lightboxItem.id] === 'before' ? 'AFTER' : 'BEFORE'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={lightboxItem.imageAfter}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain max-h-[60vh] md:max-h-[80vh]"
                />
              )}
            </div>

            {/* Modal Sidebar Info */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-slate-900 text-white">
              <div className="space-y-4">
                <span className="inline-block bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-md">
                  {lightboxItem.category} Lookbook
                </span>
                
                <h3 className="text-2xl font-bold font-serif-luxury">{lightboxItem.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{lightboxItem.description}</p>
                
                {lightboxItem.isBeforeAfter && (
                  <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-rose-400">Before &amp; After Transformation</div>
                    <div>Shows genuine client result captured at AK Unisex Salon studio under calibrated studio lights.</div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Bandra West Studio</span>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Done Viewing
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
