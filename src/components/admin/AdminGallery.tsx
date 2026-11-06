import React, { useState } from 'react';
import { Image, Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import { GalleryItem } from '../../types';
import { api } from '../../api';

interface AdminGalleryProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({ gallery, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Hair');
  const [imageBefore, setImageBefore] = useState('');
  const [imageAfter, setImageAfter] = useState('');
  const [isBeforeAfter, setIsBeforeAfter] = useState(true);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageAfter) return;
    setIsSubmitting(true);

    try {
      await api.createGalleryItem({
        title,
        category,
        imageBefore: isBeforeAfter ? imageBefore : undefined,
        imageAfter,
        isBeforeAfter,
        description,
        likes: 12,
      });

      setModalOpen(false);
      setTitle('');
      setImageBefore('');
      setImageAfter('');
      setDescription('');
      onRefresh();
    } catch (err: any) {
      alert(`Error saving gallery item: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lookbook transformation?')) return;
    try {
      await api.deleteGalleryItem(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting item: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Lookbook &amp; Transformation CMS</h2>
          <p className="text-xs text-slate-400">Publish high-definition before/after client transformations</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Transformation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              <img src={item.imageAfter} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
              {item.isBeforeAfter && (
                <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" /> Before/After
                </span>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
              
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-rose-400 font-medium">♥ {item.likes} saves</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">New Gallery Item</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balayage Ombre Glow"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Hair">Hair</option>
                  <option value="Bridal">Bridal</option>
                  <option value="Skin">Skin</option>
                  <option value="Nail Art">Nail Art</option>
                  <option value="Men">Men</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isBeforeAfter}
                  onChange={(e) => setIsBeforeAfter(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-rose-600"
                />
                <span>Include Before Image for Comparison</span>
              </label>

              {isBeforeAfter && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Before Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageBefore}
                    onChange={(e) => setImageBefore(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">After (Final Result) Photo URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={imageAfter}
                  onChange={(e) => setImageAfter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
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
                  {isSubmitting ? 'Uploading...' : 'Publish to Lookbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
