import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { api } from '../../api';

interface AdminInventoryProps {
  inventory: InventoryItem[];
  onRefresh: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ inventory, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Hair Care');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [minAlertThreshold, setMinAlertThreshold] = useState<number>(5);
  const [unitPrice, setUnitPrice] = useState<number>(1200);
  const [supplier, setSupplier] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minAlertThreshold);

  const filteredInventory = inventory.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('Hair Care');
    setBrand('L’Oréal Professionnel');
    setQuantity(10);
    setMinAlertThreshold(4);
    setUnitPrice(1400);
    setSupplier('ProBeauty Supplies Mumbai');
    setSupplierPhone('+91 98200 12345');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setBrand(item.brand);
    setQuantity(item.quantity);
    setMinAlertThreshold(item.minAlertThreshold);
    setUnitPrice(item.unitPrice);
    setSupplier(item.supplier);
    setSupplierPhone(item.supplierPhone);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<InventoryItem> = {
        name,
        category,
        brand,
        quantity: Number(quantity),
        minAlertThreshold: Number(minAlertThreshold),
        unitPrice: Number(unitPrice),
        supplier,
        supplierPhone,
      };

      if (editingId) {
        await api.updateInventoryItem(editingId, payload);
      } else {
        await api.createInventoryItem(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving inventory item: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestock = async (item: InventoryItem, addedQty: number) => {
    try {
      await api.updateInventoryItem(item.id, {
        quantity: item.quantity + addedQty,
        lastRestocked: new Date().toISOString().split('T')[0],
      });
      onRefresh();
    } catch (err: any) {
      alert(`Error restocking: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from inventory?')) return;
    try {
      await api.deleteInventoryItem(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/60 border border-amber-800/80 p-4 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Low Stock Alert ({lowStockItems.length} Products Under Threshold)
              </h4>
              <p className="text-xs text-amber-200 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.quantity} left)`).join('; ')}
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-300 font-bold bg-amber-900/60 px-3 py-1.5 rounded-xl border border-amber-700/60 shrink-0">
            Reorder Prompted
          </span>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Inventory &amp; Product Stock</h2>
          <p className="text-xs text-slate-400">Track professional hair masks, colors, skincare kits and tools</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 w-48 sm:w-60"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quantity in Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Supplier &amp; Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Restock / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.minAlertThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white max-w-xs">{item.name}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{item.brand}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono text-sm font-extrabold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white font-brand">₹{item.unitPrice}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300">{item.supplier}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.supplierPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> Sufficient
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRestock(item, 5)}
                          className="px-2 py-1 bg-slate-800 hover:bg-emerald-900 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          title="Restock +5 units"
                        >
                          +5 Restock
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Inventory Item' : 'Add New Inventory Stock'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olaplex No. 2 Bond Multiplier"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olaplex"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
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
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Color & Chemical">Color &amp; Chemical</option>
                    <option value="Tools & Equip">Tools &amp; Equip</option>
                    <option value="Disposables">Disposables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Min Alert</label>
                  <input
                    type="number"
                    min={1}
                    value={minAlertThreshold}
                    onChange={(e) => setMinAlertThreshold(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Supplier Phone</label>
                  <input
                    type="tel"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
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
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
