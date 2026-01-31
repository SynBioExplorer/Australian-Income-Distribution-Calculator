import { State, AgeGroup } from '../types';

export interface IncomeStats {
  median: number;
  p90: number; // Top 10% threshold
  p99: number; // Top 1% threshold
}

// Base median income (approximate AUD for general population)
const BASE_MEDIAN = 65000;

// Multipliers based on ATO general trends for Age
// 45-54 is typically the peak earning period
const AGE_MULTIPLIERS: Record<AgeGroup, number> = {
  [AgeGroup.AGE_18_24]: 0.55,
  [AgeGroup.AGE_25_34]: 1.05,
  [AgeGroup.AGE_35_44]: 1.35,
  [AgeGroup.AGE_45_54]: 1.45,
  [AgeGroup.AGE_55_64]: 1.20,
  [AgeGroup.AGE_65_PLUS]: 0.75,
};

// Multipliers based on ATO general trends for Location
// ACT/WA typically higher due to public service/mining
const STATE_MULTIPLIERS: Record<State, number> = {
  [State.ACT]: 1.30, // Highest median usually
  [State.WA]: 1.15,
  [State.NSW]: 1.08,
  [State.VIC]: 1.02,
  [State.QLD]: 0.98,
  [State.NT]: 1.12,
  [State.SA]: 0.92,
  [State.TAS]: 0.88,
};

/**
 * Simulates looking up a specific row in the ATO database.
 * Returns the Median, Top 10% (P90), and Top 1% (P99) thresholds.
 */
export const getDemographicStats = (state: State, ageGroup: AgeGroup): IncomeStats => {
  const median = Math.round(BASE_MEDIAN * AGE_MULTIPLIERS[ageGroup] * STATE_MULTIPLIERS[state]);
  
  // Income distributions are right-skewed (log-normal).
  // The gap between median and top 1% widens significantly in peak earning years.
  const skewFactor = ageGroup === AgeGroup.AGE_45_54 || ageGroup === AgeGroup.AGE_35_44 ? 1.1 : 1.0;

  return {
    median: median,
    p90: Math.round(median * 2.2 * skewFactor),
    p99: Math.round(median * 5.5 * skewFactor),
  };
};
