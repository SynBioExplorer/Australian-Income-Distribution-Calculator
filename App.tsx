import React, { useState } from 'react';
import { State, AgeGroup, UserInput, AnalysisResult } from './types';
import { InputForm } from './components/InputForm';
import { StatsCard } from './components/StatsCard';
import { IncomeChart } from './components/IncomeChart';
import { fetchIncomeAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    income: 85000,
    location: State.NSW,
    ageGroup: AgeGroup.AGE_25_34,
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchIncomeAnalysis(input);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 99) return "Top 1%";
    if (percentile >= 90) return `Top ${100 - percentile}%`;
    if (percentile >= 50) return `Top ${100 - percentile}%`;
    return `Bottom ${percentile}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AusIncome Explorer</h1>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Data: ATO Taxation Statistics 2021-22
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <InputForm 
              input={input} 
              onChange={setInput} 
              onSubmit={handleAnalyze} 
              isLoading={isLoading} 
            />
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              <p className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  This tool uses <strong>Taxation Statistics 2021-22</strong>. It compares your income against the latest complete financial year data available from the ATO for your specific age and state.
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
                {error}
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-slate-600">Enter your details to generate your income profile</p>
                <p className="text-sm mt-2">Compare against {input.ageGroup} year olds in {input.location}</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Insight Banner */}
                <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-800 opacity-20 blur-3xl"></div>
                  <h2 className="text-2xl font-bold relative z-10 mb-2">
                    {getPercentileLabel(result.userPercentile)} 
                    <span className="font-normal text-emerald-200 text-lg ml-2"> of earners in your group</span>
                  </h2>
                  <p className="text-emerald-100 relative z-10">{result.insight}</p>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard 
                    label="Median Income" 
                    value={formatCurrency(result.medianIncome)} 
                    subtext="50% earn less than this"
                  />
                  <StatsCard 
                    label="Your Percentile" 
                    value={`${Math.round(result.userPercentile)}th`}
                    highlight={true}
                    subtext="Higher than this % of peers"
                  />
                  <StatsCard 
                    label="Top 10% Threshold" 
                    value={formatCurrency(result.top10PercentThreshold)} 
                    subtext="Income to join the top 10%"
                  />
                </div>

                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Income Distribution</h3>
                      <p className="text-sm text-slate-500">Relative frequency of incomes for {input.ageGroup} in {input.location}</p>
                    </div>
                  </div>
                  <IncomeChart data={result} input={input} />
                </div>

                {/* Data Sources Section */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Data Source</h4>
                    <ul className="space-y-2">
                      {result.sources.map((source, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
