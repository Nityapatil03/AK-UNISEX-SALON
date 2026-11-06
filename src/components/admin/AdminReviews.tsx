import React, { useState } from 'react';
import { Star, MessageSquare, Check, Trash2, Reply, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../api';

interface AdminReviewsProps {
  reviews: Review[];
  onRefresh: () => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({ reviews, onRefresh }) => {
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleFeature = async (r: Review) => {
    try {
      await api.updateReview(r.id, {
        status: r.status === 'featured' ? 'approved' : 'featured',
      });
      onRefresh();
    } catch (err: any) {
      alert(`Error updating: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this review?')) return;
    try {
      await api.deleteReview(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting review: ${err.message}`);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.updateReview(replyingReview.id, {
        staffReply: replyText.trim(),
      });
      setReplyingReview(null);
      setReplyText('');
      onRefresh();
    } catch (err: any) {
      alert(`Error saving reply: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Client Reviews &amp; Feedback Moderation</h2>
          <p className="text-xs text-slate-400">Moderate visitor reviews, highlight testimonials, and publish salon replies</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-white ml-1.5">{review.rating}.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeature(review)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider cursor-pointer ${
                      review.status === 'featured'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {review.status === 'featured' ? '★ Featured on Site' : 'Standard'}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic my-3">
                "{review.comment}"
              </p>

              {review.staffReply && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                    Salon Management Response:
                  </div>
                  <p>{review.staffReply}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <strong className="text-white block">{review.customerName}</strong>
                <span className="text-[10px] text-rose-400">{review.serviceName} • {review.date}</span>
              </div>

              <button
                onClick={() => {
                  setReplyingReview(review);
                  setReplyText(review.staffReply || '');
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Reply className="w-3.5 h-3.5 text-rose-400" />
                <span>{review.staffReply ? 'Edit Response' : 'Reply'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Reply to {replyingReview.customerName}</h3>
              <button onClick={() => setReplyingReview(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400 italic">
              "{replyingReview.comment}"
            </p>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Official Salon Response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank the client, address styling comments..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
