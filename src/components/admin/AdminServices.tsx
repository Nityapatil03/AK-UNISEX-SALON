import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Search,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { api } from '../../api';

interface AdminServicesProps {
  services: Service[];
  onRefresh: () => void;
}

const CATEGORIES: ServiceCategory[] = [
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

export const AdminServices: React.FC<AdminServicesProps> = ({ services, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Hair Care');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(999);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [gender, setGender] = useState<'unisex' | 'women' | 'men'>('unisex');
  const [image, setImage] = useState('');
  const [popular, setPopular] = useState(false);
  const [active, setActive] = useState(true);
  const [featuresStr, setFeaturesStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('Hair Care');
    setDescription('');
    setPrice(1299);
    setDurationMinutes(45);
    setGender('unisex');
    setImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80');
    setPopular(false);
    setActive(true);
    setFeaturesStr('Sterile instruments, Certified artist consultation');
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setPrice(s.price);
    setDurationMinutes(s.durationMinutes);
    setGender(s.gender);
    setImage(s.image);
    setPopular(!!s.popular);
    setActive(s.active);
    setFeaturesStr((s.features || []).join(', '));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;
    setIsSubmitting(true);

    const features = featuresStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        await api.updateService(editingId, {
          name,
          category,
          description,
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          gender,
          image,
          popular,
          active,
          features,
        });
      } else {
        await api.createService({
          name,
          category,
          description,
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          gender,
          image,
          popular,
          active,
          features,
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving service: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (s: Service) => {
    try {
      await api.updateService(s.id, { active: !s.active });
      onRefresh();
    } catch (err: any) {
      alert(`Error toggling status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service permanently?')) return;
    try {
      await api.deleteService(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting service: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Service Menu Management</h2>
          <p className="text-xs text-slate-400">Configure pricing, duration, categories, and client visibility</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({services.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = services.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Services Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white truncate max-w-xs">{service.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{service.category}</td>
                  <td className="py-3 px-4 font-bold text-white font-brand text-sm">
                    ₹{service.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      {service.durationMinutes} min
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-300">{service.gender}</td>
                  <td className="py-3 px-4">
                    {service.popular ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                        <Star className="w-3 h-3 fill-amber-400" /> Favorite
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer ${
                        service.active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {service.active ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT SERVICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Service Details' : 'Add New Salon Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nanoplastia Organic Hair Treatment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min={15}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe treatment procedure and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Formaldehyde-free, Olaplex bond repair, Hair wash included"
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-rose-600 focus:ring-0"
                  />
                  <span>Mark as Client Favorite / Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-rose-600 focus:ring-0"
                  />
                  <span>Visible on Public Website</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
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
                  {isSubmitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
