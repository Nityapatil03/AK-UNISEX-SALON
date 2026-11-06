import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  List,
  AlertCircle,
  Scissors,
  Trash2,
  Search,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Appointment, Service, Staff, AppointmentStatus } from '../../types';
import { api } from '../../api';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
  onRefresh: () => void;
  openWalkInModalDefault?: boolean;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  appointments,
  services,
  staff,
  onRefresh,
  openWalkInModalDefault = false,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [walkInModalOpen, setWalkInModalOpen] = useState(openWalkInModalDefault);
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);

  // Walk-in form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [assignedStaff, setAssignedStaff] = useState('any');
  const [walkInDate, setWalkInDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [walkInSlot, setWalkInSlot] = useState('');
  const [walkInNotes, setWalkInNotes] = useState('');
  const [walkInError, setWalkInError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reschedule form states
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [newStaffId, setNewStaffId] = useState('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Standard time slots
  const standardSlots = [
    '10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM', '01:00 PM',
    '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM', '05:00 PM',
    '05:45 PM', '06:30 PM', '07:15 PM', '08:00 PM',
  ];

  // Filtering
  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (filterStaff !== 'all' && apt.staffId !== filterStaff) return false;
    if (filterDate && apt.date !== filterDate) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.customerName.toLowerCase().includes(q);
      const matchPhone = apt.customerPhone.includes(q);
      const matchRef = apt.bookingRef.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRef) return false;
    }
    return true;
  });

  // Action handlers
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await api.updateAppointment(id, { status });
      onRefresh();
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment record?')) return;
    try {
      await api.deleteAppointment(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting: ${err.message}`);
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError(null);
    if (!clientName || !clientPhone || selectedServices.length === 0 || !walkInSlot) {
      setWalkInError('Please select client info, at least one service, date and slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createAppointment({
        customerName: clientName,
        customerPhone: clientPhone,
        serviceIds: selectedServices,
        staffId: assignedStaff,
        date: walkInDate,
        timeSlot: walkInSlot,
        notes: walkInNotes,
        source: 'walk-in',
      });

      setWalkInModalOpen(false);
      setClientName('');
      setClientPhone('');
      setSelectedServices([]);
      setWalkInSlot('');
      onRefresh();
    } catch (err: any) {
      setWalkInError(err.message || 'Slot conflict or server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModalApt) return;
    setRescheduleError(null);

    try {
      await api.updateAppointment(rescheduleModalApt.id, {
        date: newDate || rescheduleModalApt.date,
        timeSlot: newSlot || rescheduleModalApt.timeSlot,
        staffId: newStaffId || rescheduleModalApt.staffId,
      });

      setRescheduleModalApt(null);
      onRefresh();
    } catch (err: any) {
      setRescheduleError(err.message || 'Conflict rescheduling appointment');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & View Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Appointment Schedule</h2>
          <p className="text-xs text-slate-400">Manage real-time bookings, walk-ins, and specialist assignments</p>
        </div>

        <div className="flex items-center gap-3">
          {/* List vs Calendar Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === 'list' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === 'calendar' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Daily Matrix</span>
            </button>
          </div>

          <button
            onClick={() => setWalkInModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-In</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client, phone, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 w-48 sm:w-60"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Staff Filter */}
          <select
            value={filterStaff}
            onChange={(e) => setFilterStaff(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5"
          >
            <option value="all">All Specialists</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5"
          />
        </div>

        {(filterStatus !== 'all' || filterStaff !== 'all' || filterDate || searchQuery) && (
          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterStaff('all');
              setFilterDate('');
              setSearchQuery('');
            }}
            className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Client Name &amp; Contact</th>
                  <th className="py-3 px-4">Services</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Date &amp; Time Slot</th>
                  <th className="py-3 px-4">Duration &amp; Price</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No appointments matching the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                        {apt.bookingRef}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{apt.customerName}</div>
                        <div className="text-[10px] text-slate-400">{apt.customerPhone}</div>
                        {apt.notes && (
                          <div className="text-[10px] text-rose-300 italic truncate max-w-xs mt-0.5">
                            Note: {apt.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">
                        <div className="truncate font-medium">{apt.serviceNames.join(', ')}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-semibold text-white">{apt.staffName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-bold">{apt.date}</div>
                        <div className="text-[10px] text-rose-400 font-semibold">{apt.timeSlot}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-brand">₹{apt.totalPrice}</div>
                        <div className="text-[10px] text-slate-400">{apt.totalDurationMinutes} mins</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {apt.source}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : apt.status === 'in_progress'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : apt.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {apt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
                              title="Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'in_progress')}
                              className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold"
                              title="Client in chair"
                            >
                              Start
                            </button>
                          )}
                          {apt.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'completed')}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                              title="Mark Completed"
                            >
                              Complete
                            </button>
                          )}
                          
                          {/* Reschedule */}
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setRescheduleModalApt(apt);
                                setNewDate(apt.date);
                                setNewSlot(apt.timeSlot);
                                setNewStaffId(apt.staffId);
                              }}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Reschedule slot"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancel or Delete */}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-rose-400"
                              title="Cancel appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CALENDAR MATRIX VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Daily Slot Matrix for {filterDate || 'Today'}
            </h3>
            <span className="text-xs text-slate-400">Time slots vs Active Specialist assignments</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {standardSlots.map((slot) => {
              const currentDate = filterDate || new Date().toISOString().split('T')[0];
              const slotBookings = appointments.filter(
                (a) => a.date === currentDate && a.timeSlot === slot && a.status !== 'cancelled'
              );
              const isOccupied = slotBookings.length > 0;

              return (
                <div
                  key={slot}
                  className={`p-3 rounded-2xl border transition-all ${
                    isOccupied
                      ? 'bg-rose-950/40 border-rose-800/80'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-white">{slot}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isOccupied ? 'bg-rose-600 text-white' : 'text-emerald-400 bg-emerald-950'
                      }`}
                    >
                      {isOccupied ? `${slotBookings.length} Booked` : 'Open'}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="space-y-1.5">
                      {slotBookings.map((b) => (
                        <div key={b.id} className="text-[11px] p-1.5 rounded bg-slate-900 border border-slate-800">
                          <div className="font-bold text-white truncate">{b.customerName}</div>
                          <div className="text-[10px] text-rose-400 truncate">{b.staffName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{b.serviceNames[0]}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 py-3 text-center">
                      Slots Available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WALK-IN MODAL */}
      {walkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Record Walk-In Appointment</h3>
              <button onClick={() => setWalkInModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {walkInError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{walkInError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer Khanna"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Client Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 11223"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Services *</label>
                <select
                  multiple
                  value={selectedServices}
                  onChange={(e) => {
                    const opts = Array.from(e.target.selectedOptions, (op) => op.value);
                    setSelectedServices(opts);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white h-24"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - ₹{s.price} ({s.durationMinutes}m)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500">Hold Ctrl/Cmd to select multiple services.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Specialist</label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="any">Any Available</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Date</label>
                  <input
                    type="date"
                    value={walkInDate}
                    onChange={(e) => setWalkInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Time Slot *</label>
                <select
                  required
                  value={walkInSlot}
                  onChange={(e) => setWalkInSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Select available slot...</option>
                  {standardSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes or client requests..."
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  {isSubmitting ? 'Reserving...' : 'Save Walk-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">
              Reschedule Appointment ({rescheduleModalApt.bookingRef})
            </h3>

            {rescheduleError && (
              <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 rounded-xl text-xs">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {standardSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Assigned Specialist</label>
                <select
                  value={newStaffId}
                  onChange={(e) => setNewStaffId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  Update Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
