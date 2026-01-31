import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AnalysisResult, UserInput } from '../types';

interface IncomeChartProps {
  data: AnalysisResult;
  input: UserInput;
}

export const IncomeChart: React.FC<IncomeChartProps> = ({ data, input }) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  // Custom tooltip to show density info nicely
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="text-sm font-semibold text-slate-700">{`Income: ${formatCurrency(label)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.distribution}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="income" 
            tickFormatter={formatCurrency} 
            stroke="#94a3b8"
            tick={{fontSize: 12}}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="density"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorDensity)"
            strokeWidth={2}
          />
          {/* User's Income Line */}
          <ReferenceLine 
            x={input.income} 
            stroke="#2563eb" 
            strokeDasharray="3 3"
            label={{ 
              value: 'You', 
              position: 'top', 
              fill: '#2563eb', 
              fontSize: 14, 
              fontWeight: 'bold' 
            }} 
          />
           {/* Median Line */}
           <ReferenceLine 
            x={data.medianIncome} 
            stroke="#64748b" 
            label={{ 
              value: 'Median', 
              position: 'insideTopRight', 
              fill: '#64748b', 
              fontSize: 12 
            }} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
