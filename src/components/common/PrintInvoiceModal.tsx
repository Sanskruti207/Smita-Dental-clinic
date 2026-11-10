import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PrintInvoiceModal: React.FC = () => {
  const { activePrintInvoice, setActivePrintInvoice } = useClinic();

  if (!activePrintInvoice) return null;

  const inv = activePrintInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Top Action Bar (hidden on print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              Tax Invoice Printable Voucher
            </span>
            <span className="text-xs text-white/80 font-mono">#{inv.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-white text-indigo-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActivePrintInvoice(null)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body (styled for clean print and screen) */}
        <div className="p-8 space-y-6 text-slate-900 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight">SMITA DENTAL CLINIC</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Dr. Smita Bevle (BDS, MDS) • Sole Dental Surgeon
              </p>
              <p className="text-xs text-slate-500">Reg. No: D-48921-MMC • Operatory Suites 1-3</p>
              <p className="text-xs text-slate-500">Bandra West, Mumbai - 400050 • Ph: +91 98200-SMITA</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-black font-mono uppercase tracking-wider text-slate-700">
                INVOICE #{inv.invoiceNumber}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Date: <strong className="text-slate-800">{inv.date}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Due Date: <strong className="text-slate-800">{inv.dueDate}</strong>
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Patient)
              </span>
              <div className="font-black text-sm text-slate-900">{inv.patientName}</div>
              <div className="text-slate-600 font-mono mt-0.5">{inv.patientPhone}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Payment Status
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  inv.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : inv.status === 'partial'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {inv.status}
              </span>
              {inv.paymentMethod && (
                <p className="text-[11px] text-slate-500 mt-1 uppercase">Method: {inv.paymentMethod}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Procedure / Clinical Tariff Item</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{item.description}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${inv.subtotal.toFixed(2)}</span>
              </div>
              {inv.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Courtesy Discount:</span>
                  <span>-${inv.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm border-t border-slate-200 pt-1.5">
                <span>Grand Total:</span>
                <span>${inv.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Amount Paid:</span>
                <span>${inv.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-700 font-black text-sm border-t border-slate-200 pt-1.5">
                <span>Balance Due:</span>
                <span>${inv.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note & Stamp */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs">
            <div className="space-y-1 text-slate-500 text-[11px] max-w-xs">
              <p className="font-bold text-slate-700">Thank you for visiting Smita Dental Clinic.</p>
              <p>UPI ID: smitadental@icici • Bank: HDFC Bank Bandra</p>
              <p>For inquiries, call clinic desk directly.</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 pb-8 mb-1 text-center font-serif italic text-slate-400 text-xs">
                Dr. Smita Bevle
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
