import React, { useState } from 'react';
import { ToothCondition } from '../../types/clinic';

interface OdontogramProps {
  dentalChart: Record<number, ToothCondition>;
  onToothClick?: (toothNumber: number, currentCondition: ToothCondition) => void;
  interactive?: boolean;
}

const conditionColors: Record<ToothCondition, { bg: string; border: string; text: string; label: string }> = {
  healthy: { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800', label: 'Healthy Enamel' },
  caries: { bg: 'bg-rose-100 hover:bg-rose-200', border: 'border-rose-400', text: 'text-rose-900', label: 'Dental Caries / Decay' },
  filled: { bg: 'bg-sky-100 hover:bg-sky-200', border: 'border-sky-400', text: 'text-sky-900', label: 'Composite / Amalgam Filled' },
  rct: { bg: 'bg-amber-100 hover:bg-amber-200', border: 'border-amber-400', text: 'text-amber-900', label: 'Root Canal Treated (RCT)' },
  crown: { bg: 'bg-purple-100 hover:bg-purple-200', border: 'border-purple-400', text: 'text-purple-900', label: 'Crown / Cap Restored' },
  missing: { bg: 'bg-slate-200 hover:bg-slate-300', border: 'border-slate-400', text: 'text-slate-500 line-through', label: 'Missing / Extracted' },
  implant: { bg: 'bg-indigo-100 hover:bg-indigo-200', border: 'border-indigo-400', text: 'text-indigo-900', label: 'Titanium Dental Implant' },
  bridge: { bg: 'bg-violet-100 hover:bg-violet-200', border: 'border-violet-400', text: 'text-violet-900', label: 'Fixed Dental Bridge' }
};

export const Odontogram: React.FC<OdontogramProps> = ({ dentalChart, onToothClick, interactive = true }) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  // Adult Universal Numbering System (1 to 32)
  // Maxillary (Upper): 1 to 16
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  // Mandibular (Lower): 32 down to 17
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  return (
    <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/80 p-5 sm:p-7 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <span>32-Tooth Digital Odontogram Chart</span>
          </h3>
          <p className="text-xs text-slate-500">Universal Dental Numbering System (Adult Dentition)</p>
        </div>
        <div className="text-[11px] text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60">
          Upper: Maxillary (1-16) • Lower: Mandibular (17-32)
        </div>
      </div>

      {/* Odontogram Grid */}
      <div className="space-y-4 overflow-x-auto pb-2">
        {/* Upper Arch */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
            <span>Upper Right (1-8)</span>
            <span className="text-indigo-700 font-bold">MAXILLARY ARCH</span>
            <span>Upper Left (9-16)</span>
          </div>
          <div className="grid grid-cols-16 gap-1.5 min-w-[580px]">
            {upperTeeth.map((num) => {
              const condition = dentalChart[num] || 'healthy';
              const style = conditionColors[condition];
              return (
                <button
                  key={num}
                  type="button"
                  disabled={!interactive}
                  onClick={() => {
                    setSelectedTooth(num);
                    if (onToothClick) onToothClick(num, condition);
                  }}
                  className={`p-1 rounded-xl border text-center transition flex flex-col items-center justify-between h-14 ${
                    style.bg
                  } ${style.border} ${interactive ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'}`}
                  title={`Tooth #${num}: ${style.label}`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-600">{num}</span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border ${style.border} ${
                        condition === 'healthy' ? 'bg-emerald-300' : 'bg-current'
                      }`}
                    />
                  </div>
                  <span className={`text-[8px] font-bold uppercase truncate max-w-[34px] ${style.text}`}>
                    {condition.substring(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arch Separator Line */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-300" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-3 w-fit mx-auto">
            Occlusal Plane
          </div>
        </div>

        {/* Lower Arch */}
        <div>
          <div className="grid grid-cols-16 gap-1.5 min-w-[580px]">
            {lowerTeeth.map((num) => {
              const condition = dentalChart[num] || 'healthy';
              const style = conditionColors[condition];
              return (
                <button
                  key={num}
                  type="button"
                  disabled={!interactive}
                  onClick={() => {
                    setSelectedTooth(num);
                    if (onToothClick) onToothClick(num, condition);
                  }}
                  className={`p-1 rounded-xl border text-center transition flex flex-col items-center justify-between h-14 ${
                    style.bg
                  } ${style.border} ${interactive ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'}`}
                  title={`Tooth #${num}: ${style.label}`}
                >
                  <span className={`text-[8px] font-bold uppercase truncate max-w-[34px] ${style.text}`}>
                    {condition.substring(0, 3)}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border ${style.border} ${
                        condition === 'healthy' ? 'bg-emerald-300' : 'bg-current'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-600">{num}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2 flex justify-between">
            <span>Lower Right (32-25)</span>
            <span className="text-indigo-700 font-bold">MANDIBULAR ARCH</span>
            <span>Lower Left (24-17)</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[10px]">
        {(Object.keys(conditionColors) as ToothCondition[]).map((c) => (
          <div key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full ${conditionColors[c].border} bg-current`} />
            <span className="capitalize font-semibold text-slate-700">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
