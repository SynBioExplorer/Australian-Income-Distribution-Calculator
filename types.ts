export enum State {
  NSW = 'New South Wales',
  VIC = 'Victoria',
  QLD = 'Queensland',
  WA = 'Western Australia',
  SA = 'South Australia',
  TAS = 'Tasmania',
  ACT = 'Australian Capital Territory',
  NT = 'Northern Territory',
}

export enum AgeGroup {
  AGE_18_24 = '18-24',
  AGE_25_34 = '25-34',
  AGE_35_44 = '35-44',
  AGE_45_54 = '45-54',
  AGE_55_64 = '55-64',
  AGE_65_PLUS = '65+',
}

export interface UserInput {
  income: number;
  location: State;
  ageGroup: AgeGroup;
}

export interface DistributionPoint {
  income: number;
  density: number; // Probability density or frequency
}

export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  medianIncome: number;
  userPercentile: number; // 0-100 (e.g., 90 means top 10%)
  top10PercentThreshold: number;
  top1PercentThreshold: number;
  distribution: DistributionPoint[];
  insight: string;
  sources?: Source[];
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}
