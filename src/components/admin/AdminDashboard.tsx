import React from 'react';
import {
  Calendar,
  Users,
  Scissors,
  UserCheck,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Receipt,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, Appointment, Staff, Service } from '../../types';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  onNavigateAppointments: () => void;
  onNavigateCustomers: () => void;
  onQuickWalkIn: () => void;
  onQuickBilling: () => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  onNavigateAppointments,
  onNavigateCustomers,
  onQuickWalkIn,
  onQuickBilling,
  onConfirmAppointment,
  onCancelAppointment,
}) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  // Key KPI Cards Data
  const kpis = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      subtitle: `${stats.pendingAppointments} pending / active`,
      icon: Calendar,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Live',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`,
      subtitle: 'From completed visits & POS invoices',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-700',
      badge: '+18.4%',
    },
    {
      title: 'Active Customers',
      value: stats.totalCustomers,
      subtitle: 'Profiles with booking history',
      icon: Users,
      color: 'from-purple-600 to-indigo-800',
      badge: 'Growing',
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.averageRating.toFixed(1)} ★`,
      subtitle: `Across ${stats.totalReviews} verified reviews`,
      icon: Star,
      color: 'from-amber-600 to-orange-700',
      badge: '99% Positive',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salon Live Operations Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            Welcome, Salon Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You have <strong className="text-rose-400">{stats.pendingAppointments} appointments</strong> pending confirmation and {stats.totalStaff} specialists on duty today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onQuickWalkIn}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Walk-In</span>
          </button>
          <button
            onClick={onQuickBilling}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-brand">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 truncate">{kpi.subtitle}</span>
                  <span className="text-emerald-400 font-bold shrink-0">{kpi.badge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Popular Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: 7-Day Revenue Trends Chart (Interactive HTML5 Canvas/Bar Visualization) */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-serif-luxury">Weekly Revenue &amp; Bookings Volume</h3>
              <p className="text-xs text-slate-400">Daily breakdown calculated from confirmed salon visits</p>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {stats.revenueTrends.map((trend, i) => {
                const maxRev = 60000;
                const heightPercent = Math.min(100, Math.max(15, (trend.revenue / maxRev) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-slate-100 text-[10px] py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap mb-1">
                      ₹{trend.revenue.toLocaleString('en-IN')} ({trend.bookings} appts)
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-rose-700 to-rose-500 rounded-t-lg group-hover:from-rose-500 group-hover:to-pink-400 transition-all shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* Day label */}
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white">
                      {trend.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span>Peak Day: <strong>Sunday (₹54,200)</strong></span>
            <span>Average Order Value: <strong>₹3,420</strong></span>
          </div>
        </div>

        {/* Right: Popular Services Breakdown */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif-luxury">Top Salon Rituals</h3>
            <span className="text-xs text-slate-400">By bookings</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats.popularServices.map((service, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[170px]">{service.name}</span>
                  <span className="text-emerald-400 font-bold font-brand">₹{service.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{service.count} appointments completed</span>
                  <span className="text-rose-400 font-medium">Top Rank #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-serif-luxury">Recent Appointment Queue</h3>
            <p className="text-xs text-slate-400">Real-time bookings from public website &amp; front desk</p>
          </div>
          <button
            onClick={onNavigateAppointments}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <span>View Full Schedule &amp; Calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-3">Ref ID</th>
                <th className="pb-3 px-3">Client</th>
                <th className="pb-3 px-3">Service</th>
                <th className="pb-3 px-3">Specialist</th>
                <th className="pb-3 px-3">Date &amp; Slot</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentBookings.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">{apt.bookingRef}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{apt.customerName}</div>
                    <div className="text-[10px] text-slate-400">{apt.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                    {apt.serviceNames.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{apt.staffName}</td>
                  <td className="py-3 px-3">
                    <div className="text-white font-semibold">{apt.date}</div>
                    <div className="text-[10px] text-rose-400">{apt.timeSlot}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-white font-brand">₹{apt.totalPrice}</td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3 text-right">
                    {apt.status === 'pending' || apt.status === 'confirmed' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onConfirmAppointment(apt.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onCancelAppointment(apt.id)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
