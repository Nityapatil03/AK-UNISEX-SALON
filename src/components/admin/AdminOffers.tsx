import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Edit, Calendar, Percent } from 'lucide-react';
import { Offer } from '../../types';
import { api } from '../../api';

interface AdminOffersProps {
  offers: Offer[];
  onRefresh: () => void;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({ offers, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minSpend, setMinSpend] = useState<number>(2000);
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [categoryTag, setCategoryTag] = useState('Bridal & Grooming');
  const [bannerImage, setBannerImage] = useState('');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setCode('FESTIVE25');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(25);
    setMinSpend(3000);
    setValidUntil('2026-12-31');
    setCategoryTag('All Services');
    setBannerImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (o: Offer) => {
    setEditingId(o.id);
    setTitle(o.title);
    setCode(o.code);
    setDescription(o.description);
    setDiscountType(o.discountType);
    setDiscountValue(o.discountValue);
    setMinSpend(o.minSpend);
    setValidUntil(o.validUntil);
    setCategoryTag(o.categoryTag);
    setBannerImage(o.bannerImage);
    setActive(o.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<Offer> = {
        title,
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend),
        validUntil,
        categoryTag,
        bannerImage,
        active,
      };

      if (editingId) {
        await api.updateOffer(editingId, payload);
      } else {
        await api.createOffer(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving offer: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (o: Offer) => {
    try {
      await api.updateOffer(o.id, { active: !o.active });
      onRefresh();
    } catch (err: any) {
      alert(`Error toggling status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional offer?')) return;
    try {
      await api.deleteOffer(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting offer: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Promotional Offers &amp; Coupon Codes</h2>
          <p className="text-xs text-slate-400">Create discount campaigns, manage usage limits, and set expiry dates</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-extrabold text-xs text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-lg tracking-wider">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleToggleActive(offer)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    offer.active
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {offer.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h3 className="font-bold text-white text-base">{offer.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{offer.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Discount</span>
                  <span className="font-bold text-white">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Min Spend</span>
                  <span className="font-bold text-white font-brand">₹{offer.minSpend}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Valid Until</span>
                  <span className="text-slate-300">{offer.validUntil}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Redemptions</span>
                  <span className="font-bold text-emerald-400">{offer.usageCount} clients</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(offer)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Edit Offer"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(offer.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                title="Delete Offer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Glamour Fest"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="GLAM20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category Tag</label>
                  <input
                    type="text"
                    placeholder="Bridal / Hair"
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Value</label>
                  <input
                    type="number"
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Terms and services applicable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
