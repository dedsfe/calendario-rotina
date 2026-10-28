import React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  LayoutList, 
  CalendarDays, 
  Grid3X3,
  Target,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  DollarSign
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

  // Formatted date string in Portuguese
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const completedChallenges = dayRecord.challenges.filter(c => c.completed).length;
  const totalChallenges = dayRecord.challenges.length;
  const percentComplete = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 transition-all shadow-xl">
      {/* Top Banner: WAR MODE DEADLINE DIA 26 */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 border-b border-red-900/40 px-4 py-2 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div 
            onClick={() => onViewChange('countdown')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition group"
            title="Clique para abrir a tela de Contagem Regressiva Gigante"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="font-extrabold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              MODO GUERRA ATÉ O DIA 26:
            </span>
            <span className="font-bold text-white">
              Faltam <span className="text-red-400 text-sm font-black underline">{daysRemaining} dias</span> para o fim do prazo.
            </span>
            <span className="text-[10px] bg-red-600/30 group-hover:bg-red-600/50 text-red-200 px-2 py-0.5 rounded-full ml-1 hidden sm:inline">
              Ver Tela Gigante ⏳
            </span>
          </div>

          {/* Quick Financial Tracker Pill */}
          <button
            onClick={onOpenFinancialModal}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white font-medium transition cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Caixa:</span>
            <strong className="text-emerald-300 font-mono">
              R$ {accumulatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </strong>
            <span className="text-zinc-400">/ R$ {financialGoal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
            <span className="text-[10px] bg-red-600/40 px-1.5 py-0.2 rounded text-red-200">Ajustar Meta</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-purple-600 to-indigo-600 p-0.5 shadow-lg shadow-red-500/10">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-red-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  CALENDÁRIO DE EXECUÇÃO <span className="text-red-400">• SPRINT DIA 26</span>
                </h1>
                <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Localhost
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Todo dia: 3x Instagram • 3x TikTok • Análise TikTok Ads • Executar Facebook Ads • Academia • Almoço
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              <div className="text-xs font-semibold leading-tight">
                <span className="text-sm font-bold">{streak.currentStreak}</span> dias de fogo
              </div>
            </div>

            {/* Daily Completion Progress */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Desafios Hoje</span>
                <span className="text-xs font-bold text-zinc-200">
                  {completedChallenges} / {totalChallenges} ({percentComplete}%)
                </span>
              </div>
              <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    percentComplete === 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-sm shadow-emerald-500/50' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                  }`}
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              {percentComplete === 100 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>

            {/* FB Ads Roadmap Button */}
            <button
              onClick={onOpenFbModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition"
              title="Abrir Trilha do Facebook Ads"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Guia FB Ads</span>
            </button>
          </div>
        </div>

        {/* Navigation & 3 Views Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-3">
          {/* Date Picker Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                title="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  isToday 
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/40' 
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                title="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                {capitalizedDate}
              </h2>
              {isToday && (
                <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Dia de Execução
                </span>
              )}
            </div>
          </div>

          {/* 3 View Mode Tabs: Dia | Semana | Mês */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-inner">
              <button
                onClick={() => onViewChange('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  view === 'day'
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>1. Visão Dia</span>
              </button>

              <button
                onClick={() => onViewChange('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  view === 'week'
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>2. Visão Semana</span>
              </button>

              <button
                onClick={() => onViewChange('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  view === 'month'
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>3. Visão Mês (Dia 26)</span>
              </button>

              <button
                onClick={() => onViewChange('countdown')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  view === 'countdown'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/30'
                    : 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                <span>4. Contagem Gigante ⏳</span>
              </button>
            </div>

            <button
              onClick={onResetDay}
              title="Restaurar tarefas deste dia para o padrão da rotina"
              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-xl transition text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
