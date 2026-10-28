import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Target, 
  Video, 
  Church, 
  Sparkles, 
  Flame, 
  DollarSign, 
  FileText,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';
import { DayRecord, ScheduleBlock, Challenge } from '../types';
import { getDaysRemainingUntilDeadline, TARGET_DEADLINE } from '../utils/storage';
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

  // Toggle challenge completion
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

    // Also update any linked schedule block
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

    // Fire confetti if all challenges are now completed!
    const allDone = updatedChallenges.every((c) => c.completed);
    if (allDone && updatedChallenges.length > 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
      });
    }
  };

  // Toggle schedule block completion
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

    const newRecord: DayRecord = {
      ...dayRecord,
      schedule: updatedSchedule,
      challenges: updatedChallenges,
    };

    onUpdateDayRecord(newRecord);
  };

  // Update TikTok Ads metrics
  const handleUpdateTikTokAdsMetrics = (field: 'spend' | 'cpa' | 'roas' | 'notes', value: string) => {
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

    onUpdateDayRecord({
      ...dayRecord,
      challenges: updatedChallenges,
    });
  };

  // Update general notes
  const handleNotesChange = (text: string) => {
    onUpdateDayRecord({
      ...dayRecord,
      notes: text,
    });
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'gym':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'lunch':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'tiktok_ads':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'facebook_ads':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'church':
        return <Church className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const tiktokAdsChallenge = dayRecord.challenges.find((c) => c.category === 'tiktok_ads');
  const dateObj = new Date(dayRecord.date + 'T12:00:00');
  const isSunday = dateObj.getDay() === 0;
  const daysRemaining = getDaysRemainingUntilDeadline(dayRecord.date);
  const isDeadlineDay = dayRecord.date === TARGET_DEADLINE;

  const handleRevenueChange = (val: string) => {
    onUpdateDayRecord({
      ...dayRecord,
      dailyRevenue: val,
    });
  };

  const handleSpendChange = (val: string) => {
    onUpdateDayRecord({
      ...dayRecord,
      dailySpend: val,
    });
  };

  const revNum = parseFloat(dayRecord.dailyRevenue?.replace(',', '.') || '0') || 0;
  const spendNum = parseFloat(dayRecord.dailySpend?.replace(',', '.') || '0') || 0;
  const profitToday = revNum - spendNum;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Time-blocked Chronological Daily Schedule (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Banner with day mission & Deadline Alert */}
        <div className={`rounded-2xl border p-5 shadow-lg transition-all ${
          isDeadlineDay 
            ? 'bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-red-500 shadow-red-500/20' 
            : 'bg-gradient-to-r from-zinc-900 via-purple-950/20 to-zinc-900 border-zinc-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                isDeadlineDay 
                  ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                  : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
              }`}>
                {isDeadlineDay ? <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {isDeadlineDay ? '🚨 DIA 26: O DIA D • PRAZO FINAL' : 'Cronograma do Seu Dia Decidido pela IA'}
                  </h3>
                  {daysRemaining > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      Faltam {daysRemaining} dias
                    </span>
                  )}
                  {daysRemaining === 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                      HOJE É O DIA 26!
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isSunday 
                    ? 'Domingo Estratégico: Treino suave, 3 vídeos, ads & Igreja sagrada à noite' 
                    : 'Rotina de Guerra: Treino matinal, TikTok Ads, FB Ads, 3x IG, 3x TT e foco em caixa'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isToday && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-lg text-xs font-mono text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Agora: <strong className="text-white">{currentTime}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-4 sm:p-5 shadow-xl space-y-3">
          {dayRecord.schedule.map((block) => {
            const isCurrentBlock =
              isToday && currentTime >= block.startTime && currentTime < block.endTime;

            return (
              <div
                key={block.id}
                className={`relative group rounded-xl p-3.5 border transition-all duration-200 ${
                  block.completed
                    ? 'bg-zinc-950/60 border-zinc-800/60 opacity-65'
                    : isCurrentBlock
                    ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Live Current Block Badge */}
                {isCurrentBlock && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 animate-pulse shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Acontecendo Agora
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => handleToggleBlock(block.id)}
                    className="mt-1 flex-shrink-0 focus:outline-none transition-transform active:scale-95"
                    title={block.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
                  >
                    {block.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                    )}
                  </button>

                  {/* Block Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Time Slot */}
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
                        {block.startTime} - {block.endTime}
                      </span>

                      {/* Category Icon & Badge */}
                      <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                        {getIconForCategory(block.category)}
                      </span>

                      {/* Title */}
                      <h4
                        className={`text-sm font-bold tracking-tight truncate ${
                          block.completed ? 'line-through text-zinc-400' : 'text-zinc-100'
                        }`}
                      >
                        {block.title}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Daily Challenges Tracker & Ads Console (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        {/* Desafios Diários Card */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Desafios Diários de Execução</h3>
                <p className="text-xs text-zinc-400">Marque ao cumprir cada meta do seu dia</p>
              </div>
            </div>
          </div>

          {/* Group 1: Hábitos Pilares (Academia, Almoço, Igreja se domingo) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💪</span> Pilares Pessoais
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Academia */}
              {dayRecord.challenges
                .filter((c) => c.category === 'gym')
                .map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleToggleChallenge(ch.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      ch.completed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0">
                        {ch.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-emerald-400" />
                          <span className={`text-sm font-semibold ${ch.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                            {ch.title}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{ch.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{ch.timeTarget}</span>
                  </div>
                ))}

              {/* Almoço */}
              {dayRecord.challenges
                .filter((c) => c.category === 'lunch')
                .map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleToggleChallenge(ch.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      ch.completed
                        ? 'bg-orange-950/20 border-orange-900/40 text-orange-300'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0">
                        {ch.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-orange-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-orange-400" />
                          <span className={`text-sm font-semibold ${ch.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                            {ch.title}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{ch.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{ch.timeTarget}</span>
                  </div>
                ))}

              {/* Igreja se Domingo */}
              {isSunday &&
                dayRecord.challenges
                  .filter((c) => c.category === 'church')
                  .map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleChallenge(ch.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        ch.completed
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                          : 'bg-gradient-to-r from-amber-950/20 to-zinc-900 border-amber-500/30 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="flex-shrink-0">
                          {ch.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-amber-500/60" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <Church className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-bold text-amber-300">
                              {ch.title}
                            </span>
                          </div>
                          <p className="text-xs text-amber-200/80">{ch.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300">{ch.timeTarget}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Group 2: Instagram (3 Vídeos) */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5" />
                Instagram (3 Vídeos Obrigatórios)
              </span>
              <span className="text-zinc-500 font-mono">
                {dayRecord.challenges.filter((c) => c.category === 'instagram' && c.completed).length}/3
              </span>
            </span>

            <div className="space-y-2">
              {dayRecord.challenges
                .filter((c) => c.category === 'instagram')
                .map((ch, idx) => (
                  <div
                    key={ch.id}
                    onClick={() => handleToggleChallenge(ch.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      ch.completed
                        ? 'bg-pink-950/20 border-pink-900/40 text-pink-300'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button className="flex-shrink-0">
                        {ch.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-pink-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600" />
                        )}
                      </button>
                      <div>
                        <span className={`text-xs font-semibold ${ch.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                          {ch.title}
                        </span>
                        <p className="text-[11px] text-zinc-400">{ch.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">{ch.timeTarget}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Group 3: TikTok (3 Vídeos) */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                TikTok (3 Vídeos Obrigatórios)
              </span>
              <span className="text-zinc-500 font-mono">
                {dayRecord.challenges.filter((c) => c.category === 'tiktok' && c.completed).length}/3
              </span>
            </span>

            <div className="space-y-2">
              {dayRecord.challenges
                .filter((c) => c.category === 'tiktok')
                .map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleToggleChallenge(ch.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      ch.completed
                        ? 'bg-purple-950/20 border-purple-900/40 text-purple-300'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button className="flex-shrink-0">
                        {ch.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600" />
                        )}
                      </button>
                      <div>
                        <span className={`text-xs font-semibold ${ch.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                          {ch.title}
                        </span>
                        <p className="text-[11px] text-zinc-400">{ch.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">{ch.timeTarget}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Group 4: Tráfego Pago (TikTok Ads & Facebook Ads) */}
          <div className="space-y-3 pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Gestão Diária de Tráfego Pago
            </span>

            {/* TikTok Ads Checkbox & Metric inputs */}
            {tiktokAdsChallenge && (
              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <div 
                  onClick={() => handleToggleChallenge(tiktokAdsChallenge.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <button className="flex-shrink-0">
                      {tiktokAdsChallenge.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${tiktokAdsChallenge.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                        {tiktokAdsChallenge.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400">{tiktokAdsChallenge.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">09:15</span>
                </div>

                {/* Quick Metric Tracker for TikTok Ads */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-0.5">Gasto (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 150,00"
                      value={tiktokAdsChallenge.metricData?.spend || ''}
                      onChange={(e) => handleUpdateTikTokAdsMetrics('spend', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-0.5">CPA (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 18,50"
                      value={tiktokAdsChallenge.metricData?.cpa || ''}
                      onChange={(e) => handleUpdateTikTokAdsMetrics('cpa', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-0.5">ROAS</label>
                    <input
                      type="text"
                      placeholder="Ex: 3.4x"
                      value={tiktokAdsChallenge.metricData?.roas || ''}
                      onChange={(e) => handleUpdateTikTokAdsMetrics('roas', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Facebook Ads Card */}
            {dayRecord.challenges
              .filter((c) => c.category === 'facebook_ads')
              .map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2.5"
                >
                  <div 
                    onClick={() => handleToggleChallenge(ch.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <button className="flex-shrink-0">
                        {ch.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold ${ch.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                          {ch.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">{ch.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-blue-400">10:00</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400">
                      Não sabe o que fazer hoje no Face Ads?
                    </span>
                    <button
                      onClick={onOpenFbModal}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition"
                    >
                      Ver Guia Prático
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Caixa & Faturamento Diário (Rumo ao Dia 26) */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Caixa & Vendas Deste Dia
                </h4>
                <p className="text-[11px] text-zinc-400">Objetivo: gerar dinheiro até o Dia 26</p>
              </div>
            </div>
            {onOpenFinancialModal && (
              <button
                onClick={onOpenFinancialModal}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold"
              >
                Ver Meta Geral →
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Entradas / Vendas Hoje (R$)</label>
              <input
                type="text"
                placeholder="Ex: 350,00"
                value={dayRecord.dailyRevenue || ''}
                onChange={(e) => handleRevenueChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Gasto em Anúncios Hoje (R$)</label>
              <input
                type="text"
                placeholder="Ex: 80,00"
                value={dayRecord.dailySpend || ''}
                onChange={(e) => handleSpendChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
            <span className="text-zinc-400">Lucro Líquido do Dia:</span>
            <span className={`font-mono font-bold ${
              profitToday > 0 ? 'text-emerald-400' : profitToday < 0 ? 'text-red-400' : 'text-zinc-400'
            }`}>
              R$ {profitToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Diário de Bordo & Notas Rápidas */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Diário de Bordo & Aprendizados do Dia
            </h4>
          </div>
          <textarea
            value={dayRecord.notes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Anote aqui os resultados de hoje, quais vídeos deram mais retenção, insights dos criativos ou planos de amanhã..."
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
          />
          <p className="text-[11px] text-zinc-400 text-right">
            Salvo automaticamente no armazenamento local.
          </p>
        </div>
      </div>
    </div>
  );
};
