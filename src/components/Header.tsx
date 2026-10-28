import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Target
} from 'lucide-react';
import { ViewType, DayRecord, FinancialGoal } from '../types';
import { getDaysRemainingUntilDeadline } from '../utils/storage';

interface HeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  dayRecord: DayRecord;
  streak: { currentStreak: number; bestStreak: number };
  financialGoal: FinancialGoal;
  accumulatedRevenue: number;
  onOpenFbModal: () => void;
  onOpenFinancialModal: () => void;
  onResetDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  dayRecord,
  streak,
  financialGoal,
  accumulatedRevenue,
  onOpenFbModal,
  onOpenFinancialModal,
  onResetDay
}) => {
  const isToday = new Date().toDateString() === currentDate.toDateString();
  const daysRemaining = Math.max(0, getDaysRemainingUntilDeadline());

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (view === 'day') next.setDate(next.getDate() - 1);
    else if (view === 'week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    onDateChange(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (view === 'day') next.setDate(next.getDate() + 1);
    else if (view === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).replace('.', '');

  const completedCount = dayRecord.challenges.filter(c => c.completed).length;
  const totalCount = dayRecord.challenges.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60">
      {/* Top minimal status strip */}
      <div className="border-b border-zinc-900 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-zinc-400">
        <button
          onClick={() => onViewChange('countdown')}
          className="flex items-center gap-2 hover:text-red-400 transition cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="text-zinc-300 font-medium">Prazo final:</span>
          <span className="text-red-400 font-bold">{daysRemaining} dias até o Dia 26</span>
        </button>

        <button
          onClick={onOpenFinancialModal}
          className="hover:text-emerald-400 transition cursor-pointer text-zinc-400 font-mono text-[11px]"
        >
          Caixa: <strong className="text-zinc-200">R$ {accumulatedRevenue.toLocaleString('pt-BR')}</strong> / R$ {financialGoal.targetAmount.toLocaleString('pt-BR')}
        </button>
      </div>

      {/* Main clean nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Date navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-zinc-400">
            <button
              onClick={handlePrev}
              className="p-1 rounded-md hover:bg-zinc-900 hover:text-white transition"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                isToday 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-md hover:bg-zinc-900 hover:text-white transition"
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-semibold text-zinc-100 capitalize">
            {formattedDate}
          </span>
        </div>

        {/* Center: Minimal Segmented Control */}
        <nav className="flex items-center bg-zinc-900/90 border border-zinc-800/80 rounded-lg p-0.5 self-start sm:self-center">
          <button
            onClick={() => onViewChange('day')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              view === 'day'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              view === 'week'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition ${
              view === 'month'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => onViewChange('countdown')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition flex items-center gap-1.5 ${
              view === 'countdown'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'text-red-400/80 hover:text-red-300'
            }`}
          >
            <span>Contagem</span>
            <span className="text-[10px] font-mono opacity-80">({daysRemaining}d)</span>
          </button>
        </nav>

        {/* Right: Progress & Tools */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-400">
            <span className="text-zinc-200 font-semibold">{completedCount}</span>/{totalCount} feitos
          </div>

          <button
            onClick={onOpenFbModal}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition text-xs flex items-center gap-1"
            title="Guia Facebook Ads"
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Guia FB Ads</span>
          </button>

          <button
            onClick={onResetDay}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md transition"
            title="Restaurar padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
