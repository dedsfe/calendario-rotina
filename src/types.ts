export type ViewType = 'day' | 'week' | 'month' | 'countdown';

export type ChallengeCategory = 
  | 'instagram'
  | 'tiktok'
  | 'tiktok_ads'
  | 'facebook_ads'
  | 'gym'
  | 'lunch'
  | 'church'
  | 'custom';

export interface Challenge {
  id: string;
  title: string;
  subtitle?: string;
  category: ChallengeCategory;
  completed: boolean;
  completedAt?: string;
  timeTarget?: string; // e.g. "11:30"
  iconName?: string;
  metricData?: {
    spend?: string;
    cpa?: string;
    roas?: string;
    clicks?: string;
    revenue?: string;
    notes?: string;
  };
}

export interface ScheduleBlock {
  id: string;
  startTime: string; // "07:00"
  endTime: string;   // "08:30"
  title: string;
  category: ChallengeCategory | 'routine' | 'work' | 'rest';
  description: string;
  completed: boolean;
  linkedChallengeId?: string;
  accentColor?: string;
  isFixed?: boolean;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  challenges: Challenge[];
  schedule: ScheduleBlock[];
  notes: string;
  dailyGoal: string;
  dailyRevenue?: string; // Vendas / Caixa gerado no dia
  dailySpend?: string;   // Gasto total do dia em anúncios
}

export interface FacebookAdsStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FinancialGoal {
  targetDate: string; // "2026-11-26"
  targetAmount: number; // R$ a pagar
  description: string;
}
