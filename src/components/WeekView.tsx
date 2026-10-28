import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Target, 
  Video, 
  Church, 
  ChevronRight,
  Flame,
  Clock
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { DayRecord, Challenge } from '../types';
import { getDayRecord, saveDayRecord, formatDateKey, getDaysRemainingUntilDeadline, TARGET_DEADLINE } from '../utils/storage';

interface WeekViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenDayView: (date: Date) => void;
  onUpdateDayRecord: (record: DayRecord) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  onSelectDate,
  onOpenDayView,
  onUpdateDayRecord,
}) => {
  // Get start of the week (Segunda-feira)
  const getWeekDates = (baseDate: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(baseDate);
    // Find Monday (1). In JS: 0=Sun, 1=Mon, ..., 6=Sat
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(current.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const todayKey = formatDateKey(new Date());

  const handleToggleWeekChallenge = (dateKey: string, challengeId: string) => {
    const record = getDayRecord(dateKey);
    const updatedChallenges = record.challenges.map((c) => {
      if (c.id === challengeId) {
        return { ...c, completed: !c.completed };
      }
      return c;
    });

    const updatedSchedule = record.schedule.map((s) => {
      if (s.linkedChallengeId === challengeId) {
        const matching = updatedChallenges.find((c) => c.id === challengeId);
        return { ...s, completed: !!matching?.completed };
      }
      return s;
    });

    const updatedRecord = {
      ...record,
      challenges: updatedChallenges,
      schedule: updatedSchedule,
    };

    saveDayRecord(updatedRecord);
    onUpdateDayRecord(updatedRecord);
  };

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="space-y-4">
      {/* Week overview header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Visão Semanal de Consistência
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono">
              7 Dias de Execução
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Acompanhe a sua disciplina ao longo da semana. Cada dia precisa bater 100% dos desafios!
          </p>
        </div>
        <div className="text-xs text-zinc-400">
          Semana de <strong className="text-white">{weekDates[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</strong> a <strong className="text-white">{weekDates[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</strong>
        </div>
      </div>

      {/* 7 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const isToday = dateKey === todayKey;
          const isSunday = date.getDay() === 0;
          const record = getDayRecord(dateKey);

          const totalChallenges = record.challenges.length;
          const completedChallenges = record.challenges.filter((c) => c.completed).length;
          const pct = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

          const igCount = record.challenges.filter((c) => c.category === 'instagram' && c.completed).length;
          const ttCount = record.challenges.filter((c) => c.category === 'tiktok' && c.completed).length;
          const gymDone = record.challenges.find((c) => c.category === 'gym')?.completed;
          const ttAdsDone = record.challenges.find((c) => c.category === 'tiktok_ads')?.completed;
          const fbAdsDone = record.challenges.find((c) => c.category === 'facebook_ads')?.completed;
          const churchDone = record.challenges.find((c) => c.category === 'church')?.completed;

          const isDeadline = dateKey === TARGET_DEADLINE;
          const daysToD = getDaysRemainingUntilDeadline(dateKey);

          return (
            <div
              key={dateKey}
              className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDeadline
                  ? 'bg-red-950/30 border-red-500 shadow-xl shadow-red-500/20 ring-2 ring-red-500'
                  : isToday
                  ? 'bg-zinc-900 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Day Column Header */}
              <div className={`p-3 border-b flex items-center justify-between ${
                isDeadline
                  ? 'bg-red-900/40 border-red-500/40'
                  : isToday 
                  ? 'bg-purple-950/30 border-purple-900/40' 
                  : 'bg-zinc-950/40 border-zinc-800/80'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-300">
                      {dayNames[index]}
                    </span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    )}
                    {isDeadline && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                        DIA D
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-white">
                      {date.getDate()} {date.toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                    {daysToD > 0 && !isDeadline && (
                      <span className="text-[10px] font-mono text-red-400">
                        (D-{daysToD})
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    pct === 100
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : pct > 0
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress mini bar */}
              <div className="w-full bg-zinc-800 h-1">
                <div
                  className={`h-full transition-all ${
                    pct === 100 ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Challenge summary cards */}
              <div className="p-3 flex-1 space-y-2">
                {/* 🏋️ Academia */}
                <div 
                  onClick={() => {
                    const gymCh = record.challenges.find(c => c.category === 'gym');
                    if (gymCh) handleToggleWeekChallenge(dateKey, gymCh.id);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition ${
                    gymDone 
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' 
                      : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Academia</span>
                  </div>
                  {gymDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                </div>

                {/* 📸 Instagram 3x */}
                <div className={`p-2 rounded-lg text-xs border ${
                  igCount === 3
                    ? 'bg-pink-950/30 border-pink-800/40 text-pink-300'
                    : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                      <span>Instagram</span>
                    </div>
                    <span className="font-mono font-bold text-[11px]">{igCount}/3</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((v) => (
                      <div
                        key={v}
                        className={`h-1.5 flex-1 rounded-full ${
                          v <= igCount ? 'bg-pink-500' : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 🎵 TikTok 3x */}
                <div className={`p-2 rounded-lg text-xs border ${
                  ttCount === 3
                    ? 'bg-purple-950/30 border-purple-800/40 text-purple-300'
                    : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-purple-400" />
                      <span>TikTok</span>
                    </div>
                    <span className="font-mono font-bold text-[11px]">{ttCount}/3</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((v) => (
                      <div
                        key={v}
                        className={`h-1.5 flex-1 rounded-full ${
                          v <= ttCount ? 'bg-purple-500' : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 📊 TikTok Ads */}
                <div
                  onClick={() => {
                    const ch = record.challenges.find(c => c.category === 'tiktok_ads');
                    if (ch) handleToggleWeekChallenge(dateKey, ch.id);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition ${
                    ttAdsDone 
                      ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300' 
                      : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>TikTok Ads</span>
                  </div>
                  {ttAdsDone ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                </div>

                {/* 🎯 Facebook Ads */}
                <div
                  onClick={() => {
                    const ch = record.challenges.find(c => c.category === 'facebook_ads');
                    if (ch) handleToggleWeekChallenge(dateKey, ch.id);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition ${
                    fbAdsDone 
                      ? 'bg-blue-950/30 border-blue-800/40 text-blue-300' 
                      : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Facebook Ads</span>
                  </div>
                  {fbAdsDone ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                </div>

                {/* ⛪ Igreja (Domingo) */}
                {isSunday && (
                  <div
                    onClick={() => {
                      const ch = record.challenges.find(c => c.category === 'church');
                      if (ch) handleToggleWeekChallenge(dateKey, ch.id);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition ${
                      churchDone 
                        ? 'bg-amber-950/40 border-amber-600/50 text-amber-300' 
                        : 'bg-amber-950/15 border-amber-500/30 text-amber-300/80 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Church className="w-3.5 h-3.5 text-amber-400" />
                      <span>Igreja à Noite</span>
                    </div>
                    {churchDone ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <Circle className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                )}
              </div>

              {/* Day Action footer */}
              <div className="p-2.5 bg-zinc-950/60 border-t border-zinc-800/80">
                <button
                  onClick={() => onOpenDayView(date)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/60 hover:bg-purple-600 transition"
                >
                  <span>Ver Dia Completo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
