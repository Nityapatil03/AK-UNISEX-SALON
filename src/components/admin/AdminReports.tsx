import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  Award,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { Appointment, Customer, Invoice, Staff, Service } from '../../types';

interface AdminReportsProps {
  appointments: Appointment[];
  customers: Customer[];
  invoices: Invoice[];
  staff: Staff[];
  services: Service[];
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  appointments,
  customers,
  invoices,
  staff,
  services,
}) => {
  // Aggregate financial metrics
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  const totalGstCollected = invoices.reduce((sum, i) => sum + i.gstAmount, 0);
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const averageTicketSize = appointments.length
    ? Math.round(appointments.reduce((sum, a) => sum + a.totalPrice, 0) / appointments.length)
    : 0;

  // Staff Performance Leaderboard
  const staffLeaderboard = staff.map((member) => {
    const memberAppointments = appointments.filter(
      (a) => a.staffId === member.id && a.status === 'completed'
    );
    const revenue = memberAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
    const count = memberAppointments.length;
    return {
      member,
      count,
      revenue,
      avgRating: member.rating,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Export Appointments to CSV
  const handleExportAppointmentsCSV = () => {
    const headers = ['Booking Ref', 'Client Name', 'Phone', 'Date', 'Time Slot', 'Services', 'Specialist', 'Total Price', 'Status'];
    const rows = appointments.map((a) => [
      a.bookingRef,
      `"${a.customerName}"`,
      a.customerPhone,
      a.date,
      a.timeSlot,
      `"${a.serviceNames.join('; ')}"`,
      `"${a.staffName}"`,
      a.totalPrice,
      a.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AK_Salon_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Customers to CSV
  const handleExportCustomersCSV = () => {
    const headers = ['Client Name', 'Phone', 'Email', 'Gender', 'Loyalty Points', 'Total Spend', 'Visits', 'Created At'];
    const rows = customers.map((c) => [
      `"${c.name}"`,
      c.phone,
      c.email,
      c.gender,
      c.loyaltyPoints,
      c.totalSpend,
      c.totalVisits,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AK_Salon_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Export CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Financial &amp; Operations Reports</h2>
          <p className="text-xs text-slate-400">Live analytics, tax records, staff commission audits, and CSV data export</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportAppointmentsCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Bookings CSV</span>
          </button>
          <button
            onClick={handleExportCustomersCSV}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Clients CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Billed Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-brand">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">From paid invoices &amp; walk-ins</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">GST Collected (18% / 5%)</span>
          <div className="text-2xl font-extrabold text-white font-brand">
            ₹{totalGstCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">Ready for GSTR-1 &amp; 3B filing</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Completed Sessions</span>
          <div className="text-2xl font-extrabold text-blue-400 font-brand">
            {completedAppointments}
          </div>
          <div className="text-[10px] text-slate-500">Fulfilled salon appointments</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Average Ticket Value</span>
          <div className="text-2xl font-extrabold text-amber-400 font-brand">
            ₹{averageTicketSize.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">Per client visit spend</div>
        </div>
      </div>

      {/* Staff Performance Leaderboard Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif-luxury">Specialist Performance &amp; Production</h3>
            <p className="text-xs text-slate-400">Services fulfilled, total client revenue generated, and ratings</p>
          </div>
          <span className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-1 rounded-lg font-bold">
            Live Ranking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Artist / Specialist</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Sessions Completed</th>
                <th className="pb-3 px-3">Gross Revenue</th>
                <th className="pb-3 px-3">Commission Rate</th>
                <th className="pb-3 px-3 text-right">Commission Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffLeaderboard.map((item, idx) => {
                const commissionDue = Math.round((item.revenue * item.member.commissionRate) / 100);
                return (
                  <tr key={item.member.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-amber-400 font-brand">#{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.member.avatar}
                          alt={item.member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-white">{item.member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{item.member.role}</td>
                    <td className="py-3 px-3 text-slate-300 font-bold">{item.count} rituals</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 font-brand">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.member.commissionRate}%</td>
                    <td className="py-3 px-3 text-right font-bold text-white font-brand">
                      ₹{commissionDue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
