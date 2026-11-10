import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, PaymentMethod } from '../../types/clinic';
import {
  DollarSign,
  Receipt,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Lock,
  Wallet
} from 'lucide-react';

export const PatientBillingView: React.FC = () => {
  const {
    selectedPatient,
    invoices,
    recordPayment,
    setActivePrintInvoice
  } = useClinic();

  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedPatient) return null;

  // Invoices strictly belonging to this patient
  const myInvoices = invoices.filter((i) => i.patientId === selectedPatient.id);
  const totalBilled = myInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalPaid = myInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalDue = myInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  const handleOpenPay = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPayMethod('upi');
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentInvoice || payAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      recordPayment(
        activePaymentInvoice.id,
        payAmount,
        payMethod,
        `Self-checkout via Patient Portal (${payMethod.toUpperCase()})`
      );
      setIsProcessing(false);
      setActivePaymentInvoice(null);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner (Modern header styled matching image.png aesthetic) */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>FINANCIAL LEDGER & BILLING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Invoices, Receipts & Online Payments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Itemized treatment fee breakdowns, payment receipts, and immediate 256-bit SSL encrypted digital settlement.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 self-start md:self-auto shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit Encrypted Checkout</span>
        </div>
      </div>

      {/* KPI Cards (Soft Pastel Rounded Cards styled like the treatment cards in image.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Soft Lavender Card */}
        <div className="bg-[#ede9fe]/70 border border-[#ddd6fe] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Total Treatment Cost
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100/90 text-indigo-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
            ${totalBilled.toFixed(2)}
          </div>
          <p className="text-[11px] text-indigo-800/80 font-medium">Cumulative clinical tariffs</p>
        </div>

        {/* Soft Mint/Emerald Card */}
        <div className="bg-[#e8f5e9]/70 border border-[#c8e6c9] rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Total Settled
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
            ${totalPaid.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-800/80 font-medium">Verified by clinic ledger</p>
        </div>

        {/* Soft Rose/Amber Card */}
        <div className={`rounded-3xl p-6 shadow-2xs space-y-2 border ${
          totalDue > 0
            ? 'bg-[#ffebee]/70 border-[#ffcdd2]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              totalDue > 0 ? 'text-rose-900' : 'text-slate-600'
            }`}>
              Outstanding Due
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              totalDue > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${
            totalDue > 0 ? 'text-rose-950' : 'text-slate-900'
          }`}>
            ${totalDue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {totalDue > 0 ? 'Immediate online payment available below' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-5">
        {myInvoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-12 h-12 mx-auto text-slate-300" />
            <h4 className="font-bold text-sm text-slate-700">No Invoices on Record</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no billable invoices or outstanding dues with Smita Dental Clinic.
            </p>
          </div>
        ) : (
          myInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                      #{inv.invoiceNumber}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5">
                    Invoice Date: <strong className="text-slate-800">{inv.date}</strong> • Due Date:{' '}
                    <strong className="text-slate-800">{inv.dueDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => handleOpenPay(inv)}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm shadow-indigo-500/25"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now (${inv.balanceDue.toFixed(2)})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActivePrintInvoice(inv)}
                    className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Print Bill PDF</span>
                  </button>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs bg-slate-50/20">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-xs">
                    <tr>
                      <th className="py-2.5 px-4">Procedure Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Standard Tariff</th>
                      <th className="py-2.5 px-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {inv.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-3 px-4 font-semibold text-slate-900">{it.description}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{it.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">${it.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ${it.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">${inv.subtotal.toFixed(2)}</span>
                  </div>
                  {inv.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Clinic Discount:</span>
                      <span className="font-mono">-${inv.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono">${inv.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Paid to Date:</span>
                    <span className="font-mono">${inv.amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-rose-700 border-t border-slate-200 pt-1.5 text-sm">
                    <span>Outstanding Due:</span>
                    <span className="font-mono">${inv.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Online Checkout Simulator Modal */}
      {activePaymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl sm:rounded-[2rem] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">Online Patient Checkout</h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Invoice #{activePaymentInvoice.invoiceNumber}</p>
              </div>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-Bit SSL
              </span>
            </div>

            <form onSubmit={handleProcessCheckout} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min={1}
                  max={activePaymentInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-lg font-black text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-medium focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="upi">UPI (Google Pay / PhonePe / Paytm / BHIM)</option>
                  <option value="credit-card">Credit Card (Visa / Mastercard / Amex)</option>
                  <option value="debit-card">Debit Card / ATM Pin</option>
                  <option value="bank-transfer">Net Banking (NEFT / RTGS / IMPS)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-150 text-indigo-950 space-y-1">
                <div className="font-bold flex items-center gap-2 text-xs text-indigo-900">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Immediate Ledger Settlement</span>
                </div>
                <p className="text-[11px] text-indigo-800/90 leading-relaxed">
                  Completing this payment updates your balance in real time and automatically records the payment receipt in Dr. Smita's clinic ledger.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActivePaymentInvoice(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm shadow-indigo-500/25"
                >
                  {isProcessing ? 'Processing Transaction...' : `Settle $${payAmount.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
