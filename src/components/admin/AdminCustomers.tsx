import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Gift,
  Award,
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  X,
  Cake,
  CheckCircle2,
} from 'lucide-react';
import { Customer, Appointment } from '../../types';
import { api } from '../../api';

interface AdminCustomersProps {
  customers: Customer[];
  appointments: Appointment[];
  onRefresh: () => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({
  customers,
  appointments,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check today's birthdays (matching MM-DD)
  const todayMMDD = new Date().toISOString().slice(5, 10); // e.g. "11-05"
  const birthdayCustomers = customers.filter(
    (c) => c.birthDate && c.birthDate.slice(5, 10) === todayMMDD
  );

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setGender('Female');
    setAddress('');
    setBirthDate('');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingId(cust.id);
    setName(cust.name);
    setPhone(cust.phone);
    setEmail(cust.email);
    setGender(cust.gender);
    setAddress(cust.address || '');
    setBirthDate(cust.birthDate || '');
    setNotes(cust.notes || '');
    setModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        await api.updateCustomer(editingId, {
          name,
          phone,
          email,
          gender,
          address,
          birthDate,
          notes,
        });
      } else {
        await api.createCustomer({
          name,
          phone,
          email,
          gender,
          address,
          birthDate,
          notes,
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving customer: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer profile?')) return;
    try {
      await api.deleteCustomer(id);
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting: ${err.message}`);
    }
  };

  // Get appointment history for selected customer
  const customerAppointments = selectedCustomer
    ? appointments.filter((a) => a.customerPhone === selectedCustomer.phone)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Birthday Reminder Banner */}
      {birthdayCustomers.length > 0 && (
        <div className="bg-gradient-to-r from-pink-950 via-rose-950 to-slate-900 border border-pink-700/60 p-4 rounded-3xl shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Cake className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Birthday Celebrations Today!</span>
                <span className="text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded-full font-extrabold">
                  {birthdayCustomers.length} VIPs
                </span>
              </h4>
              <p className="text-xs text-pink-200 mt-0.5">
                {birthdayCustomers.map((c) => c.name).join(', ')} celebrating birthday today. Send automated 20% privilege promo.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert(`WhatsApp greetings dispatched to ${birthdayCustomers.map(c => c.name).join(', ')} with promo code BDAY20!`)}
            className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Send Birthday Perks
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Customer Directory &amp; CRM</h2>
          <p className="text-xs text-slate-400">Total profiles, lifetime spend, visits, and loyalty rewards</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Grid: Customer Table + Customer Profile Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Table Column */}
        <div className={`space-y-4 ${selectedCustomer ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Phone &amp; Email</th>
                    <th className="py-3 px-4">Loyalty Pts</th>
                    <th className="py-3 px-4">Total Spend</th>
                    <th className="py-3 px-4">Visits</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        No customers found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const isSelected = selectedCustomer?.id === cust.id;
                      return (
                        <tr
                          key={cust.id}
                          onClick={() => setSelectedCustomer(cust)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-rose-950/30' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{cust.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{cust.gender}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-300 font-mono">{cust.phone}</div>
                            <div className="text-[10px] text-slate-500">{cust.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1 font-bold text-amber-400 font-brand">
                              <Award className="w-3.5 h-3.5" />
                              {cust.loyaltyPoints}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400 font-brand">
                            ₹{cust.totalSpend.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold text-[10px]">
                              {cust.totalVisits} visits
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenEdit(cust)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Edit profile"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(cust.id)}
                                className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Customer Detailed Profile Panel */}
        {selectedCustomer && (
          <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base font-brand">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCustomer.name}</h3>
                  <p className="text-xs text-rose-400">Client ID: #{selectedCustomer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Lifetime Spend</div>
                <div className="text-xs font-bold text-emerald-400 font-brand mt-0.5">
                  ₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Visits Count</div>
                <div className="text-xs font-bold text-white font-brand mt-0.5">
                  {selectedCustomer.totalVisits}
                </div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Loyalty Pts</div>
                <div className="text-xs font-bold text-amber-400 font-brand mt-0.5">
                  {selectedCustomer.loyaltyPoints}
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-white">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-white">{selectedCustomer.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Birthday:</span>
                <span className="font-semibold text-pink-300">{selectedCustomer.birthDate || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-white">{selectedCustomer.address || 'Bandra West, Mumbai'}</span>
              </div>
              {selectedCustomer.notes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-bold text-rose-400 block mb-0.5">Clinical / Preference Notes:</span>
                  {selectedCustomer.notes}
                </div>
              )}
            </div>

            {/* Appointment History */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Visit &amp; Service History ({customerAppointments.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {customerAppointments.length === 0 ? (
                  <p className="text-xs text-slate-500">No appointments recorded yet.</p>
                ) : (
                  customerAppointments.map((apt) => (
                    <div key={apt.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span className="truncate max-w-[180px]">{apt.serviceNames.join(', ')}</span>
                        <span className="text-rose-400 font-brand">₹{apt.totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{apt.date} at {apt.timeSlot} • {apt.staffName}</span>
                        <span className="capitalize text-emerald-400">{apt.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Customer Profile' : 'Add New Customer Profile'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Birth Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Mumbai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Clinical &amp; Preference Notes</label>
                <textarea
                  rows={2}
                  placeholder="Allergies, color formulas, scalp conditions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
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
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
