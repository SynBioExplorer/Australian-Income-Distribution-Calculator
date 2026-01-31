import React from 'react';
import { State, AgeGroup, UserInput } from '../types';

interface InputFormProps {
  input: UserInput;
  onChange: (input: UserInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ input, onChange, onSubmit, isLoading }) => {
  const handleChange = (field: keyof UserInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Your Details</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Annual Income (Before Tax)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="number"
              value={input.income || ''}
              onChange={(e) => handleChange('income', Number(e.target.value))}
              placeholder="80000"
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Location</label>
          <select
            value={input.location}
            onChange={(e) => handleChange('location', e.target.value as State)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 appearance-none cursor-pointer"
          >
            {Object.values(State).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Age Group</label>
          <select
            value={input.ageGroup}
            onChange={(e) => handleChange('ageGroup', e.target.value as AgeGroup)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 appearance-none cursor-pointer"
          >
            {Object.values(AgeGroup).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !input.income}
          className={`w-full py-4 mt-2 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
            isLoading || !input.income 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
          }`}
        >
          {isLoading ? 'Calculating...' : 'Analyze My Income'}
        </button>
      </div>
    </div>
  );
};
