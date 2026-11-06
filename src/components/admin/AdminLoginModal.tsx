import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('owner@akunisexsalon.com');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter the salon owner password or PIN.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.loginAdmin(password.trim(), email.trim());
      if (res.success) {
        // Save token to localStorage for persistent session
        localStorage.setItem('ak_salon_admin_token', res.token);
        localStorage.setItem('ak_salon_admin_auth', 'true');
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Access denied.');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect password. Only salon owner has access.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillDemo = () => {
    setPassword('salon2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b132b] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          title="Return to Public Website"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Lock Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Salon Owner Access</span>
          </div>

          <h2 className="text-2xl font-bold font-serif-luxury text-white">
            Salon ERP Security Gate
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Financial records, revenue reports, and customer CRM are protected. Please authenticate with your owner password.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Owner Email / Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold">Owner Access Password / PIN *</label>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Auto-fill Demo PIN
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter salon owner password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo Credentials Info Box */}
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <div>
              <span className="text-slate-300 font-bold block">Default Owner Password:</span>
              <span className="font-mono text-amber-300 font-bold text-xs">salon2026</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Apply
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-900/30 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Unlock Salon ERP Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800/80 text-[11px] text-slate-500">
          Public salon visitors cannot access ERP operations without owner authorization.
        </div>

      </div>
    </div>
  );
};
