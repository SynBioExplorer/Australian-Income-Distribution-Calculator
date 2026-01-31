import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtext, highlight }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
      <p className={`text-sm font-medium mb-1 ${highlight ? 'text-emerald-800' : 'text-slate-500'}`}>{label}</p>
      <h3 className={`text-2xl font-bold ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
        {value}
      </h3>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
  );
};
