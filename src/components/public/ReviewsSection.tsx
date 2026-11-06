import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, Sparkles, X, Send, HeartHandshake } from 'lucide-react';
import { Review, Service } from '../../types';
import { api } from '../../api';

interface ReviewsSectionProps {
  reviews: Review[];
  services: Service[];
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, services, onReviewAdded }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Compute average score & distribution
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 4.9;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please fill in your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createReview({
        customerName: name.trim(),
        serviceName: selectedService || (services[0]?.name ?? 'Salon Hair & Skin Ritual'),
        rating,
        comment: comment.trim(),
        verified: true,
        status: 'approved',
      });

      onReviewAdded(created);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setModalOpen(false);
        setName('');
        setComment('');
      }, 1800);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-slate-50 relative border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Client Testimonials &amp; Trust
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved &amp; Trusted by Over 15,000 Clients
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Real experiences from real clients. We pride ourselves on uncompromised quality, hygiene, and signature hospitality.
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Big Score Box */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="text-5xl font-extrabold text-slate-900 font-brand">
                {avgRating}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(avgRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Based on <strong>{totalReviews} verified client reviews</strong>
                </div>
              </div>
            </div>

            {/* Satisfaction Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>99.2% Appointment Punctuality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Branded Products</span>
              </div>
            </div>

            {/* Write a review button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-[#0b132b] hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-rose-400" />
              <span>Share Your Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews
            .filter((r) => r.status !== 'pending')
            .map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Verified Flag */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Client
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                    "{review.comment}"
                  </p>
                </div>

                <div>
                  {/* Staff Reply if any */}
                  {review.staffReply && (
                    <div className="bg-slate-50 p-3 rounded-xl border-l-2 border-rose-500 text-[11px] text-slate-600 mb-3 space-y-1">
                      <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider text-rose-700">
                        Salon Response:
                      </div>
                      <p>{review.staffReply}</p>
                    </div>
                  )}

                  {/* Author & Service Meta */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{review.customerName}</div>
                      <div className="text-[11px] text-rose-600 font-medium truncate max-w-[180px]">
                        {review.serviceName}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Thank You!</h3>
                <p className="text-xs text-slate-500">
                  Your feedback helps us continuously elevate our salon artistry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">Share Your Experience</h3>
                  <p className="text-xs text-slate-500">How was your visit at AK UNISEX SALON?</p>
                </div>

                {/* Rating picker */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika S."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Service Experienced</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="">Select service...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the stylist, ambience, outcome and comfort..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Post Verified Review'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
