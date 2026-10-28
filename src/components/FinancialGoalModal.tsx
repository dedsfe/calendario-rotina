import React, { useState } from 'react';
import { X, Target, DollarSign, Calendar, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { FinancialGoal } from '../types';
import { TARGET_DEADLINE, getDaysRemainingUntilDeadline } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal;
  accumulatedRevenue: number;
  onSaveGoal: (newGoal: FinancialGoal) => void;
}

export const FinancialGoalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  goal,
  accumulatedRevenue,
  onSaveGoal,
}) => {
  const [targetAmount, setTargetAmount] = useState<string>(goal.targetAmount.toString());
  const [description, setDescription] = useState<string>(goal.description);

  if (!isOpen) return null;

  const daysRemaining = Math.max(0, getDaysRemainingUntilDeadline());
  const parsedTarget = parseFloat(targetAmount) || 0;
  const remainingToGoal = Math.max(0, parsedTarget - accumulatedRevenue);
  const dailyNeeded = daysRemaining > 0 ? (remainingToGoal / daysRemaining).toFixed(2) : '0';
  const progressPercent = parsedTarget > 0 ? Math.min(100, Math.round((accumulatedRevenue / parsedTarget) * 100)) : 0;

  const handleSave = () => {
    onSaveGoal({
      ...goal,
      targetAmount: parsedTarget,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Meta do Dia 26 • Modo Guerra
              </h3>
              <p className="text-xs text-red-300">
                Prazo final improrrogável: {daysRemaining} dias restantes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Quanto você precisa ter pago até o Dia 26? (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-zinc-400">R$</span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-xl pl-10 pr-3 py-2 text-base font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">
                Motivo / Descrição do compromisso
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Quitar contas / compromisso inadiável"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Já Arrecadado
              </span>
              <div className="text-lg font-black text-emerald-400">
                R$ {accumulatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-zinc-400">
                {progressPercent}% da meta
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                Meta Diária Necessária
              </span>
              <div className="text-lg font-black text-red-300">
                R$ {parseFloat(dailyNeeded).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal text-zinc-400">/dia</span>
              </div>
              <span className="text-[10px] text-red-400/80">
                pelos próximos {daysRemaining} dias
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Progresso até o Dia 26:</span>
              <span className="font-bold text-zinc-200">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <p className="text-[11px] text-zinc-400">
            Cada vídeo postado e cada anúncio rodado tem esse único objetivo.
          </p>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-600/30"
          >
            <Check className="w-4 h-4" />
            Salvar Meta
          </button>
        </div>
      </div>
    </div>
  );
};
