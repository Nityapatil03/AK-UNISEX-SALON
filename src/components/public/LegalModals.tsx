import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#0b132b] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            ) : (
              <FileText className="w-5 h-5 text-rose-400" />
            )}
            <h3 className="text-base font-bold font-serif-luxury">
              {type === 'privacy' ? 'Privacy & Data Protection Policy' : 'Terms of Service & Salon Etiquette'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                At <strong>AK UNISEX SALON (HAIR &amp; BEAUTY STUDIO)</strong>, we are committed to safeguarding the personal privacy of our esteemed clientele. This policy outlines how we collect, store, and utilize your contact information.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">1. Information We Collect</h4>
              <p>
                When booking online or at reception, we collect your name, phone number, email address, service preferences, and any skin or hair allergy disclosures required to deliver safe chemical and aesthetic rituals.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Use of Information</h4>
              <p>
                Your details are strictly utilized to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Send automated appointment confirmations and WhatsApp reminders.</li>
                <li>Track loyalty reward points and personalized birthday upgrades.</li>
                <li>Maintain your historical color formulas and patch test records.</li>
              </ul>
              <h4 className="font-bold text-slate-800 text-sm">3. Zero Third-Party Selling</h4>
              <p>
                We never monetize or disclose your phone numbers or client information to external marketing agencies or brokers.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                Welcome to <strong>AK UNISEX SALON</strong>. By reserving an appointment through our website or in person, you agree to the following terms and salon etiquette guidelines:
              </p>
              <h4 className="font-bold text-slate-800 text-sm">1. Appointment Arrival &amp; Punctuality</h4>
              <p>
                We value your time and the schedule of fellow clients. Please arrive 10 minutes prior to your scheduled time slot. For delays exceeding 15 minutes, we may reschedule or alter the scope of service.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Cancellations &amp; Rescheduling</h4>
              <p>
                We kindly request a minimum of 2 hours notice for appointment rescheduling or cancellations so that we can open slots for waitlisted clients.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Patch Tests for Chemical Services</h4>
              <p>
                For first-time color transformations or chemical treatments (Keratin, Nanoplastia, Bleaching), our specialists may perform a skin patch test to ensure zero allergic reactivity.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">4. Hygiene &amp; Cleanliness</h4>
              <p>
                All salon instruments undergo medical-grade ultrasonic and UV sterilization after every client use. Single-use biodegradable capes and towels are standard.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-xl"
          >
            I Understand &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
