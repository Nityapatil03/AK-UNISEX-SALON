import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Star,
  Clock,
  Award,
  Phone,
  Mail,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import { Staff, ServiceCategory, Appointment } from '../../types';
import { api } from '../../api';

interface AdminStaffProps {
  staff: Staff[];
  appointments: Appointment[];
  onRefresh: () => void;
}

const ALL_SPECIALIZATIONS: ServiceCategory[] = [
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

export const AdminStaff: React.FC<AdminStaffProps> = ({ staff, appointments, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specializations, setSpecializations] = useState<ServiceCategory[]>(['Hair Care']);
  const [experienceYears, setExperienceYears] = useState(5);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('20:00');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRole('Master Hair Stylist & Colorist');
    setSpecializations(['Hair Care', 'Hair Coloring']);
    setExperienceYears(6);
    setPhone('+91 98200 12345');
    setEmail('specialist@akunisexsalon.com');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
    setCommissionRate(15);
    setStartTime('10:00');
    setEndTime('20:00');
    setBio('Expert in precision cutting and color enhancement.');
    setModalOpen(true);
  };

  const handleOpenEdit = (st: Staff) => {
    setEditingId(st.id);
    setName(st.name);
    setRole(st.role);
    setSpecializations(st.specialization);
    setExperienceYears(st.experienceYears);
    setPhone(st.phone);
    setEmail(st.email);
    setAvatar(st.avatar);
    setCommissionRate(st.commissionRate);
    setStartTime(st.workingHours.start);
    setEndTime(st.workingHours.end);
    setBio(st.bio);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<Staff> = {
        name,
        role,
        specialization: specializations,
        experienceYears: Number(experienceYears),
        phone,
        email,
        avatar,
        commissionRate: Number(commissionRate),
        workingHours: {
          start: startTime,
          end: endTime,
          daysOff: ['Monday'],
        },
        bio,
      };

      if (editingId) {
        await api.updateStaff(editingId, payload);
      } else {
        await api.createStaff(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving staff member: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAttendance = async (st: Staff, newStatus: 'present' | 'absent' | 'on_leave') => {
    try {
      await api.updateStaff(st.id, { attendanceStatus: newStatus });
      onRefresh();
    } catch (err: any) {
      alert(`Error updating attendance: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff profile?')) return;
    try {
      await api.deleteStaff(id);
      onRefresh();
    } catch (err: any) {
      alert(`Error deleting staff: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Staff &amp; Specialists Management</h2>
          <p className="text-xs text-slate-400">Attendance tracking, service allocation, and commission calculation</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Specialist Profile</span>
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => {
          // Calculate commission and performance from completed appointments
          const staffAppointments = appointments.filter(
            (a) => a.staffId === member.id && a.status === 'completed'
          );
          const totalRevenueGenerated = staffAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
          const earnedCommission = Math.round((totalRevenueGenerated * member.commissionRate) / 100);

          return (
            <div
              key={member.id}
              className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Avatar & Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base">{member.name}</h3>
                      <p className="text-xs text-rose-400 font-medium">{member.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" /> {member.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{member.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Edit Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Attendance Status Selector */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Today's Attendance:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAttendance(member, 'present')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                        member.attendanceStatus === 'present'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleToggleAttendance(member, 'on_leave')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                        member.attendanceStatus === 'on_leave'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      On Leave
                    </button>
                    <button
                      onClick={() => handleToggleAttendance(member, 'absent')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                        member.attendanceStatus === 'absent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Skills &amp; Specializations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialization.map((sp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working Hours & Contact */}
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Working Hours: {member.workingHours.start} – {member.workingHours.end}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>

              {/* Commission & Performance Card */}
              <div className="p-3 bg-gradient-to-r from-slate-950 to-slate-900 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs pt-3">
                <div>
                  <div className="text-[10px] text-slate-400">Commission Rate</div>
                  <div className="font-bold text-white text-sm">{member.commissionRate}% per ritual</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Month Payout Est.</div>
                  <div className="font-bold text-emerald-400 text-sm font-brand">
                    ₹{earnedCommission.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingId ? 'Edit Specialist Profile' : 'Add New Specialist'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexandre Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Professional Role / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Hair Stylist &amp; Colorist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={1}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Specializations (Select Multiple)</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {ALL_SPECIALIZATIONS.map((spec) => {
                    const isChecked = specializations.includes(spec);
                    return (
                      <label key={spec} className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSpecializations([...specializations, spec]);
                            } else {
                              setSpecializations(specializations.filter((s) => s !== spec));
                            }
                          }}
                          className="rounded bg-slate-900 border-slate-700 text-rose-600"
                        />
                        <span>{spec}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Shift Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Shift End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Avatar Photo URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Bio &amp; Accreditations</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  {isSubmitting ? 'Saving...' : 'Save Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
