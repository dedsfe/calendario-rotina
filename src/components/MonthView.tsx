import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  TrendingUp, 
  Target, 
  Utensils, 
  Church, 
  Calendar as CalendarIcon,
  Video
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { DayRecord } from '../types';
import { getDayRecord, saveDayRecord, formatDateKey, TARGET_DEADLINE, getDaysRemainingUntilDeadline } from '../utils/storage';

interface MonthViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onOpenDayView: (date: Date) => void;
  onUpdateDayRecord: (record: DayRecord) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  onDateChange,
  onOpenDayView,
  onUpdateDayRecord,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const getDayOfWeekMon = (d: Date) => {
    const day = d.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const startOffset = getDayOfWeekMon(firstDay);
  const totalDays = lastDay.getDate();

  const calendarCells = [];

  for (let i = 0; i < startOffset; i++) {
    const prevDate = new Date(year, month, 1 - (startOffset - i));
    calendarCells.push({ date: prevDate, isCurrentMonth: false });
  }

  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(year, month, i);
    calendarCells.push({ date: dayDate, isCurrentMonth: true });
  }

  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    calendarCells.push({ date: nextDate, isCurrentMonth: false });
  }

  const todayKey = formatDateKey(new Date());

  const handlePrevMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() - 1);
    onDateChange(next);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    onDateChange(next);
  };

  const handleGoToNovember = () => {
    const nov = new Date(2026, 10, 1); // Novembro de 2026
    onDateChange(nov);
  };

  const handleToggleTask = (dateKey: string, challengeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const record = getDayRecord(dateKey);
    const updatedChallenges = record.challenges.map((c) => {
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

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekdayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Month Navigation & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-bold text-zinc-100 min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {month !== 10 && (
            <button
              onClick={handleGoToNovember}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition flex items-center gap-1"
            >
              <span>Ver Novembro (Mês do Prazo 🚨)</span>
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-600"></span> Pendente
          </span>
          <span className="flex items-center gap-1 text-red-400 font-bold">
            [D-Day 26/Nov]
          </span>
        </div>
      </div>

      {/* Big Interactive Calendar Grid */}
      <div className="rounded-xl border border-zinc-800/80 overflow-hidden bg-zinc-950 shadow-xl">
        {/* Weekday names */}
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/60 text-center py-2 text-xs text-zinc-400 font-semibold tracking-wide">
          {weekdayNames.map((name, i) => (
            <div key={name} className={i === 6 ? 'text-amber-400' : ''}>
              {name}
            </div>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-px bg-zinc-800/50">
          {calendarCells.map(({ date, isCurrentMonth }, idx) => {
            const dateKey = formatDateKey(date);
            const isToday = dateKey === todayKey;
            const isDeadline = dateKey === TARGET_DEADLINE;
            const isSunday = date.getDay() === 0;
            const record = getDayRecord(dateKey);

            const total = record.challenges.length;
            const done = record.challenges.filter((c) => c.completed).length;

            const gymCh = record.challenges.find((c) => c.category === 'gym');
            const igList = record.challenges.filter((c) => c.category === 'instagram');
            const ttList = record.challenges.filter((c) => c.category === 'tiktok');
            const ttAdsCh = record.challenges.find((c) => c.category === 'tiktok_ads');
            const fbAdsCh = record.challenges.find((c) => c.category === 'facebook_ads');
            const churchCh = record.challenges.find((c) => c.category === 'church');

            const igDone = igList.filter((c) => c.completed).length;
            const ttDone = ttList.filter((c) => c.completed).length;

            return (
              <div
                key={idx}
                onClick={() => onOpenDayView(date)}
                className={`min-h-[145px] sm:min-h-[155px] p-2 cursor-pointer transition-colors relative flex flex-col justify-between group ${
                  !isCurrentMonth
                    ? 'bg-zinc-950/40 opacity-25'
                    : isDeadline
                    ? 'bg-red-950/20 border-2 border-red-500/80 shadow-md shadow-red-500/10'
                    : isToday
                    ? 'bg-zinc-900 border border-zinc-600'
                    : 'bg-zinc-950 hover:bg-zinc-900/50'
                }`}
              >
                {/* Cell Header: Day number + Progress */}
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/40 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isDeadline
                          ? 'bg-red-600 text-white animate-pulse'
                          : isToday
                          ? 'bg-zinc-100 text-zinc-950'
                          : isSunday
                          ? 'text-amber-400 font-extrabold'
                          : 'text-zinc-300'
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {isDeadline && (
                      <span className="text-[10px] font-black tracking-wider uppercase text-red-400">
                        O DIA D
                      </span>
                    )}
                  </div>

                  {isCurrentMonth && (
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        done === total && total > 0
                          ? 'text-emerald-400'
                          : done > 0
                          ? 'text-zinc-300'
                          : 'text-zinc-600'
                      }`}
                    >
                      {done}/{total}
                    </span>
                  )}
                </div>

                {/* Actual Mini Tasks Inside Each Day */}
                {isCurrentMonth && (
                  <div className="space-y-1 text-[11px] leading-tight flex-1">
                    {/* 🏋️ Academia */}
                    {gymCh && (
                      <div
                        onClick={(e) => handleToggleTask(dateKey, gymCh.id, e)}
                        className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition hover:bg-zinc-800/60 ${
                          gymCh.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-300'
                        }`}
                        title="Academia / Treino Matinal (07:00)"
                      >
                        {gymCh.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                        )}
                        <span className="truncate">🏋️ Academia</span>
                      </div>
                    )}

                    {/* 📸 Instagram (3 Vídeos) */}
                    <div className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-zinc-800/40 text-zinc-300">
                      <span className="flex items-center gap-1 truncate text-zinc-400">
                        <InstagramIcon className="w-2.5 h-2.5 text-pink-400 flex-shrink-0" />
                        <span>3x Reels</span>
                      </span>
                      {/* 3 Clickable mini checkboxes */}
                      <div className="flex items-center gap-1">
                        {igList.map((item, i) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => handleToggleTask(dateKey, item.id, e)}
                            className="p-0.5 focus:outline-none"
                            title={`Reels ${i + 1} (${item.completed ? 'Feito' : 'Pendente'})`}
                          >
                            {item.completed ? (
                              <span className="w-2 h-2 rounded-full bg-pink-400 block" />
                            ) : (
                              <span className="w-2 h-2 rounded-full border border-zinc-600 hover:border-pink-400 block" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 🎵 TikTok (3 Vídeos) */}
                    <div className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-zinc-800/40 text-zinc-300">
                      <span className="flex items-center gap-1 truncate text-zinc-400">
                        <Video className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />
                        <span>3x TikTok</span>
                      </span>
                      {/* 3 Clickable mini checkboxes */}
                      <div className="flex items-center gap-1">
                        {ttList.map((item, i) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => handleToggleTask(dateKey, item.id, e)}
                            className="p-0.5 focus:outline-none"
                            title={`TikTok ${i + 1} (${item.completed ? 'Feito' : 'Pendente'})`}
                          >
                            {item.completed ? (
                              <span className="w-2 h-2 rounded-full bg-purple-400 block" />
                            ) : (
                              <span className="w-2 h-2 rounded-full border border-zinc-600 hover:border-purple-400 block" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 📊 TikTok Ads */}
                    {ttAdsCh && (
                      <div
                        onClick={(e) => handleToggleTask(dateKey, ttAdsCh.id, e)}
                        className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition hover:bg-zinc-800/60 ${
                          ttAdsCh.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-300'
                        }`}
                        title="Verificar Anúncios TikTok"
                      >
                        {ttAdsCh.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                        )}
                        <span className="truncate">📊 TikTok Ads</span>
                      </div>
                    )}

                    {/* 🎯 Facebook Ads */}
                    {fbAdsCh && (
                      <div
                        onClick={(e) => handleToggleTask(dateKey, fbAdsCh.id, e)}
                        className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition hover:bg-zinc-800/60 ${
                          fbAdsCh.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-300'
                        }`}
                        title="Executar Facebook Ads"
                      >
                        {fbAdsCh.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                        )}
                        <span className="truncate">🎯 FB Ads</span>
                      </div>
                    )}

                    {/* ⛪ Igreja domingo */}
                    {isSunday && churchCh && (
                      <div
                        onClick={(e) => handleToggleTask(dateKey, churchCh.id, e)}
                        className={`flex items-center gap-1.5 py-0.5 px-1 rounded transition hover:bg-zinc-800/60 ${
                          churchCh.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-amber-300 font-semibold'
                        }`}
                        title="Igreja à noite (18:30)"
                      >
                        {churchCh.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        )}
                        <span className="truncate">⛪ Igreja (18:30)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cell Footer: Small Open Link */}
                <div className="pt-1 text-[10px] text-zinc-600 group-hover:text-zinc-400 flex justify-end">
                  <span>Abrir dia →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
