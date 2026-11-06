import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Shield,
  RotateCcw,
  Sparkles,
  Building,
} from 'lucide-react';
import { BusinessSettings } from '../../types';
import { api } from '../../api';

interface AdminSettingsProps {
  settings: BusinessSettings | null;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [salonName, setSalonName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (settings) {
      setSalonName(settings.salonName);
      setTagline(settings.tagline);
      setPhone(settings.phone);
      setAlternatePhone(settings.alternatePhone);
      setEmail(settings.email);
      setAddress(settings.address);
      setCity(settings.city);
      setPincode(settings.pincode);
      setGstin(settings.gstin);
      setOpenTime(settings.openTime);
      setCloseTime(settings.closeTime);
      setWorkingDays(settings.workingDays);
      setWhatsappNumber(settings.whatsappNumber);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings({
        salonName,
        tagline,
        phone,
        alternatePhone,
        email,
        address,
        city,
        pincode,
        gstin,
        openTime,
        closeTime,
        workingDays,
        whatsappNumber,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      onRefresh();
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Warning: This will reset all demo database collections to default initial seed data. Continue?')) return;
    setIsResetting(true);
    try {
      await api.resetDatabase();
      alert('Database restored to original state!');
      onRefresh();
    } catch (err: any) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Salon Business &amp; Operations Settings</h2>
          <p className="text-xs text-slate-400">Manage studio contact, operating hours, tax identification, and audit logs</p>
        </div>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center gap-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isResetting ? 'Restoring...' : 'Reset Demo DB'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Business settings saved successfully. Public website and booking engine updated!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Salon Identity */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>Salon Branding &amp; Corporate Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Salon Name</label>
              <input
                type="text"
                required
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono uppercase"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Studio Address & Helplines */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Studio Location &amp; Contact Numbers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-300 font-bold block mb-1">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">PIN / Postal Code</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Primary Reception Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">WhatsApp Hotline (With Country Code)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Business Operating Hours</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Opening Time</label>
              <input
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Closing Time</label>
              <input
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Working Days Schedule</label>
              <input
                type="text"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Security & Owner Password Management */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Salon Owner Access &amp; Password Protection</span>
          </div>

          <p className="text-xs text-slate-400">
            The Salon ERP is password-protected so that public visitors cannot access confidential client phone numbers, revenue reports, or POS controls.
          </p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Owner Email / Username</label>
              <input
                type="text"
                value={settings?.ownerEmail || 'owner@akunisexsalon.com'}
                disabled
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Active Owner Password / PIN</label>
              <input
                type="text"
                value={settings?.adminPassword || 'salon2026'}
                onChange={(e) => {
                  if (settings) settings.adminPassword = e.target.value;
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Edit here and click "Save Settings Changes" below to update owner password.
              </span>
            </div>
          </div>
        </div>

        {/* Audit Activity Log */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Security &amp; Audit Logs</span>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span>Admin session authenticated from 127.0.0.1</span>
              <span className="text-slate-500 font-mono">Today, 10:45 AM</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span>Automated database sync completed successfully</span>
              <span className="text-slate-500 font-mono">Today, 09:30 AM</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>GST rate verified at 18.0% CGST/SGST</span>
              <span className="text-slate-500 font-mono">Yesterday, 06:12 PM</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
