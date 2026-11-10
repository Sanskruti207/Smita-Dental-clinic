import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { X, Bell, MessageSquare, Mail, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    visibleNotifications,
    clearNotifications,
    currentRole,
    currentUser,
    selectedPatient
  } = useClinic();

  if (!isNotificationDrawerOpen) return null;

  const isDoctor = currentRole === 'doctor';
  const patientDisplayName = currentUser?.name || selectedPatient?.name || 'Patient';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      <div
        onClick={() => setIsNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm">
                  {isDoctor ? 'Doctor Operatory Alerts' : 'My Notifications & SMS'}
                </h3>
                <p className="text-[11px] text-white/80">
                  {isDoctor
                    ? 'Clinical bookings, cancellations & ledger updates'
                    : `Private clinic communications for ${patientDisplayName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {visibleNotifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  title="Clear notifications"
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of dispatches */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
            {visibleNotifications.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-indigo-200" />
                <p className="text-xs font-bold text-slate-700">No active notifications</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {isDoctor
                    ? 'Schedule modifications, patient registrations, and online bookings will notify here.'
                    : 'Appointment confirmations, digital prescriptions, and receipts from Dr. Smita Bevle will appear here.'}
                </p>
              </div>
            ) : (
              visibleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 rounded-3xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {notif.type === 'sms' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> SMS Dispatched
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-slate-700">{notif.recipientName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{notif.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-white p-3 rounded-2xl border border-slate-200/80">
                    {notif.message}
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Contact: {notif.recipientContact}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Delivered
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
