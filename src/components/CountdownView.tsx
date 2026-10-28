import React, { useState, useEffect } from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { FinancialGoal } from '../types';
import { TARGET_DEADLINE } from '../utils/storage';

interface CountdownViewProps {
  financialGoal: FinancialGoal;
  accumulatedRevenue: number;
  onOpenFinancialModal: () => void;
  onGoToToday: () => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  financialGoal,
  accumulatedRevenue,
  onOpenFinancialModal,
  onGoToToday,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${TARGET_DEADLINE}T23:59:59`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const targetAmount = financialGoal.targetAmount;
  const remainingMoney = Math.max(0, targetAmount - accumulatedRevenue);
  const daysCount = Math.max(1, timeLeft.days);
  const dailyNeeded = (remainingMoney / daysCount).toFixed(2);
  const progressPercent = targetAmount > 0 
    ? Math.min(100, Math.round((accumulatedRevenue / targetAmount) * 100)) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-red-400">
          Prazo Final: 26 de Novembro
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          Contagem Regressiva
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Tempo exato até o encerramento do prazo para atingir a meta financeira.
        </p>
      </div>

      {/* GIANT MINIMALIST NUMBERS */}
      <div className="grid grid-cols-4 gap-2 sm:gap-6 text-center">
        {/* Days */}
        <div className="py-6 sm:py-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
          <span className="block text-4xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-zinc-100">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1 block">
            dias
          </span>
        </div>

        {/* Hours */}
        <div className="py-6 sm:py-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
          <span className="block text-4xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-zinc-300">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1 block">
            horas
          </span>
        </div>

        {/* Minutes */}
        <div className="py-6 sm:py-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
          <span className="block text-4xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-zinc-300">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1 block">
            min
          </span>
        </div>

        {/* Seconds */}
        <div className="py-6 sm:py-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
          <span className="block text-4xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-red-400">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1 block">
            seg
          </span>
        </div>
      </div>

      {/* MINIMAL FINANCIAL PROGRESS */}
      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 space-y-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Meta Financeira:</span>
          <button
            onClick={onOpenFinancialModal}
            className="text-zinc-400 hover:text-zinc-200 underline"
          >
            Ajustar Valor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-zinc-800/60 py-4">
          <div>
            <span className="text-[11px] text-zinc-500 block mb-0.5">Total a Pagar</span>
            <div className="text-lg font-bold text-zinc-200">
              R$ {targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-zinc-500 block mb-0.5">Em Caixa</span>
            <div className="text-lg font-bold text-emerald-400">
              R$ {accumulatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-zinc-500 block mb-0.5">Necessário por Dia</span>
            <div className="text-lg font-bold text-red-400">
              R$ {parseFloat(dailyNeeded).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              <span className="text-xs text-zinc-500 font-normal">/dia</span>
            </div>
          </div>
        </div>

        {/* Clean progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>Progresso</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-200 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clean button */}
      <div className="text-center">
        <button
          onClick={onGoToToday}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition"
        >
          <span>Ir para o dia de hoje</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
