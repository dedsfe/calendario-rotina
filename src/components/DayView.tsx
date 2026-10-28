import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Target,
  DollarSign
} from 'lucide-react';
import { DayRecord, ScheduleBlock, Challenge } from '../types';
import { TARGET_DEADLINE, getDaysRemainingUntilDeadline } from '../utils/storage';
import confetti from 'canvas-confetti';

interface DayViewProps {
  dayRecord: DayRecord;
  onUpdateDayRecord: (updated: DayRecord) => void;
  onOpenFbModal: () => void;
  onOpenFinancialModal?: () => void;
}

export const DayView: React.FC<DayViewProps> = ({
  dayRecord,
  onUpdateDayRecord,
  onOpenFbModal,
  onOpenFinancialModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showMetrics, setShowMetrics] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isToday = new Date().toISOString().split('T')[0] === dayRecord.date;
  const isSunday = new Date(dayRecord.date + 'T12:00:00').getDay() === 0;

  const handleToggleChallenge = (challengeId: string) => {
    const updatedChallenges = dayRecord.challenges.map((c) => {
      if (c.id === challengeId) {
        const nextState = !c.completed;
        return {
          ...c,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return c;
    });

    const updatedSchedule = dayRecord.schedule.map((block) => {
      if (block.linkedChallengeId === challengeId) {
        const target = updatedChallenges.find((c) => c.id === challengeId);
        return { ...block, completed: !!target?.completed };
      }
      return block;
    });

    const newRecord: DayRecord = {
      ...dayRecord,
      challenges: updatedChallenges,
      schedule: updatedSchedule,
    };

    onUpdateDayRecord(newRecord);

    const allDone = updatedChallenges.every((c) => c.completed);
    if (allDone && updatedChallenges.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleToggleBlock = (blockId: string) => {
    let linkedChallengeToUpdate: string | undefined;

    const updatedSchedule = dayRecord.schedule.map((block) => {
      if (block.id === blockId) {
        const nextState = !block.completed;
        if (block.linkedChallengeId) {
          linkedChallengeToUpdate = block.linkedChallengeId;
        }
        return { ...block, completed: nextState };
      }
      return block;
    });

    let updatedChallenges = dayRecord.challenges;
    if (linkedChallengeToUpdate) {
      const matchingBlock = updatedSchedule.find((b) => b.id === blockId);
      updatedChallenges = dayRecord.challenges.map((c) => {
        if (c.id === linkedChallengeToUpdate) {
          return {
            ...c,
            completed: !!matchingBlock?.completed,
            completedAt: matchingBlock?.completed ? new Date().toISOString() : undefined,
          };
        }
        return c;
      });
    }

    onUpdateDayRecord({
      ...dayRecord,
      schedule: updatedSchedule,
      challenges: updatedChallenges,
    });
  };

  const handleUpdateTikTokMetrics = (field: 'spend' | 'cpa' | 'roas', value: string) => {
    const updatedChallenges = dayRecord.challenges.map((c) => {
      if (c.category === 'tiktok_ads') {
        return {
          ...c,
          metricData: {
            ...c.metricData,
            [field]: value,
          },
        };
      }
      return c;
    });
    onUpdateDayRecord({ ...dayRecord, challenges: updatedChallenges });
  };

  const tiktokChallenge = dayRecord.challenges.find((c) => c.category === 'tiktok_ads');
  const revNum = parseFloat(dayRecord.dailyRevenue?.replace(',', '.') || '0') || 0;
  const spendNum = parseFloat(dayRecord.dailySpend?.replace(',', '.') || '0') || 0;
  const profitToday = revNum - spendNum;

  // Filter challenges into clean sections
  const igChallenges = dayRecord.challenges.filter((c) => c.category === 'instagram');
  const ttChallenges = dayRecord.challenges.filter((c) => c.category === 'tiktok');
  const trafficChallenges = dayRecord.challenges.filter(
    (c) => c.category === 'tiktok_ads' || c.category === 'facebook_ads'
  );
  const routineChallenges = dayRecord.challenges.filter(
    (c) => c.category === 'gym' || c.category === 'lunch' || c.category === 'church'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* LEFT: Clean Hourly Timeline (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Cronograma do Dia
          </h2>
          {isToday && (
            <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              Agora: {currentTime}
            </span>
          )}
        </div>

        <div className="space-y-1">
          {dayRecord.schedule.map((block) => {
            const isCurrentBlock =
              isToday && currentTime >= block.startTime && currentTime < block.endTime;

            return (
              <div
                key={block.id}
                onClick={() => handleToggleBlock(block.id)}
                className={`flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors ${
                  block.completed
                    ? 'opacity-40 hover:opacity-60'
                    : isCurrentBlock
                    ? 'bg-zinc-900 border-l-2 border-red-500'
                    : 'hover:bg-zinc-900/60'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  className="mt-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {block.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>

                {/* Time slot */}
                <span className="w-24 text-xs font-mono text-zinc-400 flex-shrink-0 mt-0.5">
                  {block.startTime} — {block.endTime}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${block.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                    {block.title.replace(/^[^\w\s]+/, '').trim()}
                  </div>
                  {block.description && (
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {block.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Minimalist Checklist & Cash Flow (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Caixa de Hoje (Minimalist) */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Caixa de Hoje
            </span>
            <span className={`text-xs font-mono font-bold ${
              profitToday > 0 ? 'text-emerald-400' : profitToday < 0 ? 'text-red-400' : 'text-zinc-400'
            }`}>
              Lucro: R$ {profitToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">Vendas (R$)</span>
              <input
                type="text"
                placeholder="0,00"
                value={dayRecord.dailyRevenue || ''}
                onChange={(e) => onUpdateDayRecord({ ...dayRecord, dailyRevenue: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 block mb-1">Gasto Ads (R$)</span>
              <input
                type="text"
                placeholder="0,00"
                value={dayRecord.dailySpend || ''}
                onChange={(e) => onUpdateDayRecord({ ...dayRecord, dailySpend: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>
        </div>

        {/* Desafios de Conteúdo: Instagram & TikTok */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-1.5">
            <span className="font-semibold uppercase tracking-wider text-zinc-300">
              Vídeos do Dia (6 Obrigatórios)
            </span>
            <span className="font-mono text-[11px]">
              {[...igChallenges, ...ttChallenges].filter(c => c.completed).length}/6
            </span>
          </div>

          <div className="space-y-1">
            {/* Instagram */}
            <div className="text-[11px] font-medium text-zinc-400 pt-1">Instagram Reels:</div>
            {igChallenges.map((c, idx) => (
              <div
                key={c.id}
                onClick={() => handleToggleChallenge(c.id)}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer text-xs transition ${
                  c.completed ? 'opacity-40 hover:opacity-60' : 'hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                  <span className={c.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}>
                    Reels {idx + 1}
                  </span>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">{c.timeTarget}</span>
              </div>
            ))}

            {/* TikTok */}
            <div className="text-[11px] font-medium text-zinc-400 pt-2">TikTok:</div>
            {ttChallenges.map((c, idx) => (
              <div
                key={c.id}
                onClick={() => handleToggleChallenge(c.id)}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer text-xs transition ${
                  c.completed ? 'opacity-40 hover:opacity-60' : 'hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                  <span className={c.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}>
                    TikTok {idx + 1}
                  </span>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">{c.timeTarget}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tráfego Pago */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-1.5">
            <span className="font-semibold uppercase tracking-wider text-zinc-300">
              Tráfego Pago
            </span>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
            >
              <span>Métricas</span>
              {showMetrics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="space-y-1">
            {trafficChallenges.map((c) => (
              <div
                key={c.id}
                onClick={() => handleToggleChallenge(c.id)}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer text-xs transition ${
                  c.completed ? 'opacity-40 hover:opacity-60' : 'hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                  <span className={c.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}>
                    {c.title}
                  </span>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">{c.timeTarget}</span>
              </div>
            ))}
          </div>

          {/* Collapsible TikTok Ads metrics */}
          {showMetrics && tiktokChallenge && (
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 grid grid-cols-3 gap-2 pt-2">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5">Gasto TT</span>
                <input
                  type="text"
                  placeholder="R$"
                  value={tiktokChallenge.metricData?.spend || ''}
                  onChange={(e) => handleUpdateTikTokMetrics('spend', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-xs text-zinc-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5">CPA</span>
                <input
                  type="text"
                  placeholder="R$"
                  value={tiktokChallenge.metricData?.cpa || ''}
                  onChange={(e) => handleUpdateTikTokMetrics('cpa', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-xs text-zinc-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5">ROAS</span>
                <input
                  type="text"
                  placeholder="Ex: 3x"
                  value={tiktokChallenge.metricData?.roas || ''}
                  onChange={(e) => handleUpdateTikTokMetrics('roas', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-xs text-zinc-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pilares Pessoais */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5">
            Pilares
          </div>

          <div className="space-y-1">
            {routineChallenges.map((c) => (
              <div
                key={c.id}
                onClick={() => handleToggleChallenge(c.id)}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer text-xs transition ${
                  c.completed ? 'opacity-40 hover:opacity-60' : 'hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                  <span className={c.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}>
                    {c.title}
                  </span>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">{c.timeTarget}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anotações do Dia (Clean Textarea) */}
        <div className="pt-2">
          <textarea
            value={dayRecord.notes || ''}
            onChange={(e) => onUpdateDayRecord({ ...dayRecord, notes: e.target.value })}
            placeholder="Anotações rápidas do dia..."
            rows={3}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
