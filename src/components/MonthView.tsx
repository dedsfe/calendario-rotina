import React from 'react';
import { getDayRecord, formatDateKey, getAllStoredRecords, TARGET_DEADLINE, getDaysRemainingUntilDeadline } from '../utils/storage';

interface MonthViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenDayView: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  onOpenDayView,
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

  // Aggregate monthly stats
  const allRecords = getAllStoredRecords();
  let totalChallengesDone = 0;
  let totalVideosCount = 0;
  let totalGymCount = 0;

  for (let i = 1; i <= totalDays; i++) {
    const dStr = formatDateKey(new Date(year, month, i));
    const rec = allRecords[dStr];
    if (rec && rec.challenges) {
      totalChallengesDone += rec.challenges.filter(c => c.completed).length;

      const igCompleted = rec.challenges.filter(c => c.category === 'instagram' && c.completed).length;
      const ttCompleted = rec.challenges.filter(c => c.category === 'tiktok' && c.completed).length;
      totalVideosCount += (igCompleted + ttCompleted);

      if (rec.challenges.some(c => c.category === 'gym' && c.completed)) {
        totalGymCount++;
      }
    }
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekdayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Month Header & Minimal Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
        <h2 className="text-base font-bold text-zinc-100">
          {monthNames[month]} {year}
        </h2>

        <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
          <span><strong className="text-zinc-200">{totalVideosCount}</strong> vídeos</span>
          <span><strong className="text-zinc-200">{totalGymCount}</strong> treinos</span>
          <span><strong className="text-zinc-200">{totalChallengesDone}</strong> feitos</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-zinc-800/80 overflow-hidden bg-zinc-950">
        {/* Weekday names */}
        <div className="grid grid-cols-7 border-b border-zinc-800 text-center py-2 text-xs text-zinc-500 font-medium">
          {weekdayNames.map((name, i) => (
            <div key={name} className={i === 6 ? 'text-amber-500/70' : ''}>
              {name}
            </div>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-px bg-zinc-800/40">
          {calendarCells.map(({ date, isCurrentMonth }, idx) => {
            const dateKey = formatDateKey(date);
            const isToday = dateKey === todayKey;
            const isDeadline = dateKey === TARGET_DEADLINE;
            const isSunday = date.getDay() === 0;
            const record = getDayRecord(dateKey);

            const total = record.challenges.length;
            const done = record.challenges.filter(c => c.completed).length;
            const isComplete = total > 0 && done === total;

            return (
              <div
                key={idx}
                onClick={() => onOpenDayView(date)}
                className={`min-h-[80px] p-2 cursor-pointer transition-colors relative flex flex-col justify-between ${
                  !isCurrentMonth
                    ? 'bg-zinc-950/40 opacity-20'
                    : isDeadline
                    ? 'bg-red-950/30 ring-1 ring-red-500'
                    : isToday
                    ? 'bg-zinc-900 ring-1 ring-zinc-500'
                    : 'bg-zinc-950 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isDeadline 
                      ? 'text-red-400 font-bold' 
                      : isToday 
                      ? 'text-white font-bold' 
                      : isSunday 
                      ? 'text-amber-400/80' 
                      : 'text-zinc-400'
                  }`}>
                    {date.getDate()}
                  </span>

                  {isDeadline && (
                    <span className="text-[9px] font-mono text-red-400 font-bold">
                      D-Day
                    </span>
                  )}
                </div>

                {/* Minimal dot indicators */}
                {isCurrentMonth && done > 0 && (
                  <div className="flex items-center gap-1 mt-auto">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isComplete ? 'bg-emerald-400' : 'bg-zinc-500'
                    }`} />
                    <span className="text-[10px] font-mono text-zinc-500">
                      {done}/{total}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
