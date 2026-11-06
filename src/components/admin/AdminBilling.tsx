import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  DollarSign,
  Download,
  X,
  Trash2,
} from 'lucide-react';
import { Invoice, Service, Customer, BusinessSettings } from '../../types';
import { api } from '../../api';

interface AdminBillingProps {
  invoices: Invoice[];
  services: Service[];
  customers: Customer[];
  settings: BusinessSettings | null;
  onRefresh: () => void;
  openCreateInvoiceDefault?: boolean;
}

export const AdminBilling: React.FC<AdminBillingProps> = ({
  invoices,
  services,
  customers,
  settings,
  onRefresh,
  openCreateInvoiceDefault = false,
}) => {
  const [modalOpen, setModalOpen] = useState(openCreateInvoiceDefault);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  // New Invoice form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ serviceId: string; serviceName: string; price: number; quantity: number }[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Split'>('UPI');
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations for new invoice
  const subtotal = selectedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const taxable = Math.max(0, subtotal - discountAmount);
  const gstAmount = Number(((taxable * gstPercent) / 100).toFixed(2));
  const grandTotal = Number((taxable + gstAmount).toFixed(2));

  // Add service item to invoice draft
  const handleAddServiceItem = (serviceId: string) => {
    const s = services.find((serv) => serv.id === serviceId);
    if (!s) return;
    const existing = selectedItems.find((it) => it.serviceId === serviceId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((it) =>
          it.serviceId === serviceId ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        { serviceId: s.id, serviceName: s.name, price: s.price, quantity: 1 },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || selectedItems.length === 0) {
      alert('Please select client and at least one service item.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalPaid = paidAmount === '' ? grandTotal : Number(paidAmount);
      const created = await api.createInvoice({
        customerName: clientName,
        customerPhone: clientPhone,
        items: selectedItems,
        discountAmount: Number(discountAmount),
        gstPercent: Number(gstPercent),
        paymentMethod,
        paidAmount: finalPaid,
      });

      setModalOpen(false);
      setSelectedItems([]);
      setClientName('');
      setClientPhone('');
      setDiscountAmount(0);
      setPaidAmount('');
      onRefresh();
      setViewInvoice(created); // Preview generated invoice for printing!
    } catch (err: any) {
      alert(`Error creating invoice: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury">Billing &amp; POS Checkout</h2>
          <p className="text-xs text-slate-400">Generate GST-compliant tax invoices, manage payments, and print receipts</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice / POS Checkout</span>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">GST</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{inv.customerName}</div>
                    <div className="text-[10px] text-slate-400">{inv.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-white font-brand">₹{inv.subtotal}</td>
                  <td className="py-3 px-4 text-slate-400 font-brand">₹{inv.gstAmount} ({inv.gstPercent}%)</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-400 font-brand text-sm">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-rose-400" />
                      <span>Print Tax PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW INVOICE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-800 shadow-2xl relative space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Point of Sale (POS) Billing</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              
              {/* Client Selector or Entry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Roy"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Customer Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Add Services to Cart */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Add Services to Invoice</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddServiceItem(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">+ Click to add service ritual to bill...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - ₹{s.price} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Items Cart */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 max-h-44 overflow-y-auto">
                {selectedItems.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No services added to billing yet.</p>
                ) : (
                  selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-white pb-1.5 border-b border-slate-900">
                      <div>
                        <div className="font-bold">{item.serviceName}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-brand text-emerald-400">₹{item.price * item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount & GST Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">GST Rate</label>
                  <select
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={18}>18% (Standard Luxury Salon)</option>
                    <option value={5}>5% (Composite / Low threshold)</option>
                    <option value={0}>0% (Tax Exempt)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method & Paid Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Split">Split Payment</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    placeholder={`Total ₹${grandTotal}`}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-3 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal: ₹{subtotal}</span>
                  <span>GST ({gstPercent}%): ₹{gstAmount}</span>
                </div>
                <div className="flex justify-between font-extrabold text-white text-sm pt-1 border-t border-slate-800 font-brand">
                  <span>Grand Total Payable:</span>
                  <span className="text-emerald-400 text-base">₹{grandTotal}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  {isSubmitting ? 'Generating...' : 'Finalize & Generate Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PDF / HTML INVOICE MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative space-y-6 my-8 border border-slate-200">
            
            {/* Action Bar (Hidden during print) */}
            <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Tax Invoice Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-400" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="text-slate-400 hover:text-slate-800 p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="space-y-6">
              
              {/* Salon Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 font-brand tracking-wider">
                    AK UNISEX SALON
                  </h1>
                  <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">
                    Hair &amp; Beauty Studio
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-tight">
                    {settings?.address || 'Plot 42, 2nd Floor, Gold Crest Avenue, Bandra West, Mumbai 400050'}
                  </p>
                  <p className="text-xs text-slate-500">GSTIN: {settings?.gstin || '27AAECK1234F1Z8'}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-slate-400">Invoice Number</div>
                  <div className="text-base font-extrabold font-mono text-slate-900">{viewInvoice.invoiceNumber}</div>
                  <div className="text-xs text-slate-500 mt-1">Date: {viewInvoice.date}</div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between">
                <div>
                  <span className="text-slate-400 block">Billed To:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewInvoice.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Contact:</span>
                  <span className="font-mono text-slate-900">{viewInvoice.customerPhone}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-semibold">
                    <th className="py-2">Item / Service</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-bold text-slate-800">{item.serviceName}</td>
                      <td className="py-2.5 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-2.5 text-right text-slate-600 font-brand">₹{item.price}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900 font-brand">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Breakdown */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 font-brand">₹{viewInvoice.subtotal}</span>
                </div>
                {viewInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount:</span>
                    <span>- ₹{viewInvoice.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({viewInvoice.gstPercent}%):</span>
                  <span className="font-semibold text-slate-900 font-brand">₹{viewInvoice.gstAmount}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-300 font-brand">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700">₹{viewInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Mode: {viewInvoice.paymentMethod}</span>
                  <span className="font-bold text-emerald-600 uppercase tracking-wider">{viewInvoice.paymentStatus}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-4 border-t border-slate-200 text-[10px] text-slate-400">
                Thank you for choosing AK UNISEX SALON. For appointments, call {settings?.phone || '+91 98765 43210'}.
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
