import { DayRecord, FinancialGoal } from '../types';
import { createDefaultChallenges, createDefaultSchedule } from '../data/defaultRoutine';

const STORAGE_PREFIX = 'rotina_cal_';
const STORAGE_FINANCIAL_KEY = 'rotina_financial_goal';

export const TARGET_DEADLINE = '2026-11-26'; // Dia 26 de Novembro de 2026

export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateKey = (dateStr: string): Date => {
  return new Date(dateStr + 'T12:00:00');
};

export const getDaysRemainingUntilDeadline = (currentDateStr: string = formatDateKey(new Date())): number => {
  const current = parseDateKey(currentDateStr);
  const target = parseDateKey(TARGET_DEADLINE);
  const diffTime = target.getTime() - current.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getFinancialGoal = (): FinancialGoal => {
  try {
    const raw = localStorage.getItem(STORAGE_FINANCIAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    targetDate: TARGET_DEADLINE,
    targetAmount: 5000, // Valor padrão de meta sugerido, editável a qualquer instante
    description: 'Valor total a pagar até o Dia 26'
  };
};

export const saveFinancialGoal = (goal: FinancialGoal): void => {
  try {
    localStorage.setItem(STORAGE_FINANCIAL_KEY, JSON.stringify(goal));
  } catch (e) {
    console.error(e);
  }
};

export const getDayRecord = (dateKey: string): DayRecord => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${dateKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    console.error('Error loading day record:', e);
  }

  // Create new day record
  const newRecord: DayRecord = {
    date: dateKey,
    challenges: createDefaultChallenges(dateKey),
    schedule: createDefaultSchedule(dateKey),
    notes: '',
    dailyGoal: 'Execução implacável: 3 vídeos IG + 3 vídeos TT + Tráfego TikTok & FB Ads',
    dailyRevenue: '',
    dailySpend: ''
  };

  saveDayRecord(newRecord);
  return newRecord;
};

export const saveDayRecord = (record: DayRecord): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${record.date}`, JSON.stringify(record));
  } catch (e) {
    console.error('Error saving day record:', e);
  }
};

export const getAllStoredRecords = (): Record<string, DayRecord> => {
  const records: Record<string, DayRecord> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      try {
        const val = localStorage.getItem(key);
        if (val) {
          const date = key.replace(STORAGE_PREFIX, '');
          records[date] = JSON.parse(val);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return records;
};

export const getTotalAccumulatedRevenue = (): number => {
  const records = getAllStoredRecords();
  let total = 0;
  for (const rec of Object.values(records)) {
    if (rec.dailyRevenue) {
      const parsed = parseFloat(rec.dailyRevenue.replace(',', '.'));
      if (!isNaN(parsed)) total += parsed;
    }
  }
  return total;
};

export const calculateStreak = (todayKey: string): { currentStreak: number; bestStreak: number } => {
  const records = getAllStoredRecords();
  let streak = 0;
  let cursor = new Date(todayKey + 'T12:00:00');
  
  const todayRec = records[todayKey];
  const isTodayComplete = todayRec && todayRec.challenges.length > 0 && todayRec.challenges.every(c => c.completed);
  
  if (!isTodayComplete) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const rec = records[key];
    if (rec && rec.challenges.length > 0) {
      const completedCount = rec.challenges.filter(c => c.completed).length;
      const ratio = completedCount / rec.challenges.length;
      if (ratio >= 0.75) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    bestStreak: Math.max(streak, parseInt(localStorage.getItem('rotina_best_streak') || '0', 10)),
  };
};
