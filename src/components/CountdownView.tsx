import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  DollarSign, 
  Video, 
  Dumbbell, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Target,
  Sparkles
} from 'lucide-react';
import { FinancialGoal } from '../types';
import { TARGET_DEADLINE, parseDateKey } from '../utils/storage';

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
    totalSeconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      // TARGET_DEADLINE at 23:59:59 on the 26th of November 2026
      const target = new Date(`${TARGET_DEADLINE}T23:59:59`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds, totalSeconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const targetAmount = financialGoal.targetAmount;
  const remainingMoney = Math.max(0, targetAmount - accumulatedRevenue);
  const daysCount = Math.max(1, timeLeft.days);
  const dailyNeeded = (remainingMoney / daysCount).toFixed(2);
  const hourlyNeeded = (remainingMoney / (daysCount * 12)).toFixed(2); // considerando 12 horas úteis/dia

  const progressPercent = targetAmount > 0 
    ? Math.min(100, Math.round((accumulatedRevenue / targetAmount) * 100)) 
    : 0;

  // Total videos remaining until day 26 (6 videos per day: 3 IG + 3 TT)
  const remainingVideos = timeLeft.days * 6;
  const remainingGym = timeLeft.days;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-fadeIn">
      {/* Top Warning Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Contagem Regressiva Oficial • O Temido Dia 26</span>
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
          TEMPO RESTANTE PARA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-400">O DIA 26</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
          Ou o dinheiro está na conta para pagar o que deve, ou acabou. Cada segundo é um criativo a mais, um vídeo a mais, uma venda a mais.
        </p>
      </div>

      {/* GIANT COUNTDOWN DISPLAY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {/* DAYS */}
        <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-b from-red-950/50 via-zinc-900 to-zinc-950 border-2 border-red-500/50 p-6 sm:p-8 text-center shadow-2xl shadow-red-500/20">
          <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
          <div className="relative">
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-white drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-red-400">
              Dias Exatos
            </span>
          </div>
        </div>

        {/* HOURS */}
        <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-zinc-800 p-6 sm:p-8 text-center shadow-xl">
          <div className="relative">
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-zinc-100">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-zinc-400">
              Horas
            </span>
          </div>
        </div>

        {/* MINUTES */}
        <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-zinc-800 p-6 sm:p-8 text-center shadow-xl">
          <div className="relative">
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-zinc-100">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-zinc-400">
              Minutos
            </span>
          </div>
        </div>

        {/* SECONDS */}
        <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-b from-amber-950/30 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 p-6 sm:p-8 text-center shadow-xl">
          <div className="relative">
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-amber-400 animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="mt-2 block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400">
              Segundos
            </span>
          </div>
        </div>
      </div>

      {/* FINANCIAL SURVIVAL DASHBOARD */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Meta Financeira do Prazo: 26 de Novembro
              </h2>
              <p className="text-xs text-zinc-400">
                {financialGoal.description || 'Valor para quitar contas e compromissos inadiáveis'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFinancialModal}
            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-center"
          >
            Editar Valor da Meta (R$)
          </button>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Valor Total a Pagar
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              R$ {targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-red-400 mt-1 block">
              Falta arrecadar: R$ {remainingMoney.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Já em Caixa
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              R$ {accumulatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-emerald-400/80 mt-1 block">
              {progressPercent}% do montante concluído
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40">
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
              Meta Diária de Lucro Líquido
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-400">
              R$ {parseFloat(dailyNeeded).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              <span className="text-xs font-normal text-zinc-400">/dia</span>
            </div>
            <span className="text-xs text-zinc-400 mt-1 block">
              ou R$ {hourlyNeeded}/hora em 12h de trabalho
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-400">Progresso do Caixa Rumo ao Dia 26:</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* AMMUNITION / REMAINING WORK UNITS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{remainingVideos} vídeos</div>
            <p className="text-xs text-zinc-400">Restantes para postar (3 IG + 3 TT por dia)</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{remainingGym} treinos</div>
            <p className="text-xs text-zinc-400">Matinais para manter o foco inabalável</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{timeLeft.days} dias de Ads</div>
            <p className="text-xs text-zinc-400">Otimizando TikTok Ads e Facebook Ads</p>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION BUTTON */}
      <div className="text-center pt-2">
        <button
          onClick={onGoToToday}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-base shadow-2xl shadow-red-600/40 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span>EXECUTE O DIA DE HOJE AGORA</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
