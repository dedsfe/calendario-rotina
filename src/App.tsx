import React, { useState, useEffect } from 'react';
import { ViewType, DayRecord, FinancialGoal } from './types';
import { Header } from './components/Header';
import { DayView } from './components/DayView';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { CountdownView } from './components/CountdownView';
import { FacebookAdsModal } from './components/FacebookAdsModal';
import { FinancialGoalModal } from './components/FinancialGoalModal';
import { 
  getDayRecord, 
  saveDayRecord, 
  formatDateKey, 
  calculateStreak,
  getFinancialGoal,
  saveFinancialGoal,
  getTotalAccumulatedRevenue
} from './utils/storage';
import { createDefaultChallenges, createDefaultSchedule } from './data/defaultRoutine';

export function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('day');
  const [dayRecord, setDayRecord] = useState<DayRecord>(() => {
    return getDayRecord(formatDateKey(new Date()));
  });
  const [isFbModalOpen, setIsFbModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [financialGoal, setFinancialGoal] = useState<FinancialGoal>(() => getFinancialGoal());
  const [accumulatedRevenue, setAccumulatedRevenue] = useState<number>(() => getTotalAccumulatedRevenue());
  const [streak, setStreak] = useState(() => calculateStreak(formatDateKey(new Date())));

  // Whenever currentDate changes, reload the day record
  useEffect(() => {
    const key = formatDateKey(currentDate);
    const rec = getDayRecord(key);
    setDayRecord(rec);
    setStreak(calculateStreak(formatDateKey(new Date())));
    setAccumulatedRevenue(getTotalAccumulatedRevenue());
  }, [currentDate]);

  const handleUpdateDayRecord = (updated: DayRecord) => {
    setDayRecord(updated);
    saveDayRecord(updated);
    setStreak(calculateStreak(formatDateKey(new Date())));
    setAccumulatedRevenue(getTotalAccumulatedRevenue());
  };

  const handleSaveFinancialGoal = (newGoal: FinancialGoal) => {
    setFinancialGoal(newGoal);
    saveFinancialGoal(newGoal);
  };

  const handleResetDay = () => {
    if (window.confirm('Deseja restaurar as tarefas e o cronograma deste dia para a rotina padrão?')) {
      const key = formatDateKey(currentDate);
      const resetRec: DayRecord = {
        date: key,
        challenges: createDefaultChallenges(key),
        schedule: createDefaultSchedule(key),
        notes: '',
        dailyGoal: 'Execução implacável: 3 vídeos IG + 3 vídeos TT + Tráfego TikTok & FB Ads',
        dailyRevenue: '',
        dailySpend: ''
      };
      handleUpdateDayRecord(resetRec);
    }
  };

  const handleOpenDayViewForDate = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top sticky header */}
      <Header
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        dayRecord={dayRecord}
        streak={streak}
        financialGoal={financialGoal}
        accumulatedRevenue={accumulatedRevenue}
        onOpenFbModal={() => setIsFbModalOpen(true)}
        onOpenFinancialModal={() => setIsFinancialModalOpen(true)}
        onResetDay={handleResetDay}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'day' && (
          <DayView
            dayRecord={dayRecord}
            onUpdateDayRecord={handleUpdateDayRecord}
            onOpenFbModal={() => setIsFbModalOpen(true)}
            onOpenFinancialModal={() => setIsFinancialModalOpen(true)}
          />
        )}

        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            onOpenDayView={handleOpenDayViewForDate}
            onUpdateDayRecord={handleUpdateDayRecord}
          />
        )}

        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            onOpenDayView={handleOpenDayViewForDate}
          />
        )}

        {view === 'countdown' && (
          <CountdownView
            financialGoal={financialGoal}
            accumulatedRevenue={accumulatedRevenue}
            onOpenFinancialModal={() => setIsFinancialModalOpen(true)}
            onGoToToday={() => {
              setCurrentDate(new Date());
              setView('day');
            }}
          />
        )}
      </main>

      {/* Facebook Ads Modal */}
      <FacebookAdsModal
        isOpen={isFbModalOpen}
        onClose={() => setIsFbModalOpen(false)}
      />

      {/* Financial Goal & D-Day Modal */}
      <FinancialGoalModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        goal={financialGoal}
        accumulatedRevenue={accumulatedRevenue}
        onSaveGoal={handleSaveFinancialGoal}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            🚨 <strong className="text-red-400">MODO GUERRA ATÉ O DIA 26</strong> • Rodando em <strong className="text-zinc-400">localhost:5173</strong>
          </p>
          <p className="text-zinc-400">
            Foco total em vendas & caixa: 3 IG • 3 TikTok • Anúncios TikTok & Facebook • Academia Matinal • Igreja ao Domingo
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
