import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  Receipt,
  Package,
  Tag,
  BarChart3,
  MessageSquare,
  Image,
  Settings,
  Eye,
  Bell,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  Shield,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'appointments'
  | 'customers'
  | 'services'
  | 'staff'
  | 'billing'
  | 'inventory'
  | 'offers'
  | 'reports'
  | 'reviews'
  | 'gallery'
  | 'settings';

export type UserRole = 'Super Admin' | 'Manager' | 'Receptionist' | 'Staff';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  onQuickWalkIn: () => void;
  onQuickBilling: () => void;
  pendingAppointmentsCount: number;
  lowStockCount: number;
  settings: BusinessSettings | null;
  children: React.ReactNode;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: any;
  badge?: number | string;
  badgeColor?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  onLogout,
  onQuickWalkIn,
  onQuickBilling,
  pendingAppointmentsCount,
  lowStockCount,
  settings,
  children,
}) => {
  const [role, setRole] = useState<UserRole>('Super Admin');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : undefined },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'services', label: 'Services Catalog', icon: Scissors },
    { id: 'staff', label: 'Staff & Specialists', icon: UserCheck },
    { id: 'billing', label: 'Billing & POS', icon: Receipt },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? 'Low' : undefined, badgeColor: 'bg-amber-500' },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews & Feedback', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery CMS', icon: Image },
    { id: 'settings', label: 'Salon Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#070b19] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col w-64 border-r shrink-0 transition-colors ${
          isDarkMode ? 'bg-[#0b132b] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Salon Brand Title */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold font-brand text-sm shadow-md">
              AK
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide font-brand text-white">
                AK SALON ERP
              </div>
              <div className="text-[10px] text-rose-400 font-semibold tracking-wider uppercase">
                Management Studio
              </div>
            </div>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">{role}</span>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
            Live DB
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock &amp; Logout ERP</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header
          className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 shrink-0 transition-colors ${
            isDarkMode ? 'bg-[#0b132b] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Mobile menu button & breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white capitalize font-brand">
                {currentTab.replace('-', ' ')}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                AK Unisex Salon (Hair &amp; Beauty Studio) • ERP v2.4
              </p>
            </div>
          </div>

          {/* Quick Action Buttons & Role Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Quick Walk-In Button */}
            <button
              onClick={onQuickWalkIn}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Add Walk-in Customer Appointment"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Walk-In</span>
            </button>

            {/* Quick POS Billing */}
            <button
              onClick={onQuickBilling}
              className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Open Point of Sale Invoice Generator"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>POS Billing</span>
            </button>

            {/* Role Switcher */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={`text-xs rounded-xl px-2.5 py-1.5 font-semibold border cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 focus:outline-none'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
              title="Change active staff permission profile"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Staff">Specialist/Staff</option>
            </select>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 relative cursor-pointer"
                title="Salon Activity Alerts"
              >
                <Bell className="w-4 h-4" />
                {pendingAppointmentsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
                {pendingAppointmentsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
                    <span>Active Salon Alerts</span>
                    <span className="text-[10px] text-rose-400">{pendingAppointmentsCount} Pending</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <p className="p-2 rounded-lg bg-slate-800/80">
                      📅 <strong>{pendingAppointmentsCount} Online Bookings</strong> require staff confirmation.
                    </p>
                    {lowStockCount > 0 && (
                      <p className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300">
                        ⚠️ <strong>{lowStockCount} Products</strong> have reached low-stock reorder thresholds.
                      </p>
                    )}
                    <p className="p-2 rounded-lg bg-slate-800/80 text-slate-400">
                      🎂 <strong>Devansh Saxena</strong> has a birthday today! Auto discount applied.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* View Public Website */}
            <button
              onClick={onExitAdmin}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 cursor-pointer"
              title="Return to Public Website"
            >
              <Eye className="w-4 h-4 text-slate-300" />
            </button>

            {/* Lock / Logout Session */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/60 cursor-pointer"
              title="Lock Session &amp; Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-64 bg-[#0b132b] text-white p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="font-bold text-sm font-brand">AK SALON ERP</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id as AdminTab);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onExitAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 py-2.5 rounded-xl text-xs font-bold text-slate-200"
              >
                <Eye className="w-4 h-4 text-rose-400" />
                <span>Exit to Website</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
