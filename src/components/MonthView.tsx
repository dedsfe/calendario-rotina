import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Dumbbell, 
  Video, 
  TrendingUp, 
  Church, 
  Calendar as CalendarIcon,
  ChevronRight,
  Award
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { getDayRecord, formatDateKey, getAllStoredRecords, TARGET_DEADLINE, getDaysRemainingUntilDeadline } from '../utils/storage';

interface MonthViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenDayView: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  onSelectDate,
  onOpenDayView,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);

  // Day of week for first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Let's use Monday as first column (0 = Mon, 6 = Sun)
  const getDayOfWeekMon = (d: Date) => {
    const day = d.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const startOffset = getDayOfWeekMon(firstDay);
  const totalDays = lastDay.getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = 0; i < startOffset; i++) {
    const prevDate = new Date(year, month, 1 - (startOffset - i));
    calendarCells.push({ date: prevDate, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const dayDate = new Date(year, month, i);
    calendarCells.push({ date: dayDate, isCurrentMonth: true });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    calendarCells.push({ date: nextDate, isCurrentMonth: false });
  }

  const todayKey = formatDateKey(new Date());

  // Aggregate monthly stats
  const allRecords = getAllStoredRecords();
  let totalChallengesDone = 0;
  let totalChallengesPossible = 0;
  let totalVideosCount = 0;
  let totalGymCount = 0;
  let totalAdsCheckedCount = 0;

  for (let i = 1; i <= totalDays; i++) {
    const dStr = formatDateKey(new Date(year, month, i));
    const rec = allRecords[dStr];
    if (rec && rec.challenges) {
      totalChallengesPossible += rec.challenges.length;
      totalChallengesDone += rec.challenges.filter(c => c.completed).length;

      // Count videos
      const igCompleted = rec.challenges.filter(c => c.category === 'instagram' && c.completed).length;
      const ttCompleted = rec.challenges.filter(c => c.category === 'tiktok' && c.completed).length;
      totalVideosCount += (igCompleted + ttCompleted);

      // Count gym
      if (rec.challenges.some(c => c.category === 'gym' && c.completed)) {
        totalGymCount++;
      }

      // Count ads
      if (rec.challenges.some(c => c.category === 'tiktok_ads' && c.completed)) {
        totalAdsCheckedCount++;
      }
    }
  }

  const overallConsistency = totalChallengesPossible > 0 
    ? Math.round((totalChallengesDone / totalChallengesPossible) * 100) 
    : 0;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekdayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="space-y-5">
      {/* Monthly Statistics Overview Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Vídeos Postados</span>
            <Video className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalVideosCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Instagram Reels + TikTok</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Treinos Realizados</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalGymCount} dias</div>
          <p className="text-[11px] text-zinc-400 mt-1">Academia de manhã</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Dias de Ads Ativos</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalAdsCheckedCount} dias</div>
          <p className="text-[11px] text-zinc-400 mt-1">TikTok & Facebook Ads</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Disciplina do Mês</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{overallConsistency}%</div>
          <p className="text-[11px] text-zinc-400 mt-1">{totalChallengesDone} desafios cumpridos</p>
        </div>
      </div>

      {/* Main Month Grid Card */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
        {/* Month Header Banner */}
        <div className="p-4 sm:p-5 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {monthNames[month]} de {year}
              </h3>
              <p className="text-xs text-zinc-400">
                Grade de consistência mensal. Clique em qualquer dia para ver ou editar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 100% Batido
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Parcial
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Church className="w-3.5 h-3.5" /> Domingo
            </span>
          </div>
        </div>

        {/* Weekday names bar */}
        <div className="grid grid-cols-7 border-b border-zinc-800/80 bg-zinc-950/40 text-center py-2.5">
          {weekdayNames.map((name, i) => (
            <div 
              key={name} 
              className={`text-xs font-bold uppercase tracking-wider ${
                i === 6 ? 'text-amber-400' : 'text-zinc-400'
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-px bg-zinc-800/50">
          {calendarCells.map(({ date, isCurrentMonth }, idx) => {
            const dateKey = formatDateKey(date);
            const isToday = dateKey === todayKey;
            const isSunday = date.getDay() === 0;
            const record = getDayRecord(dateKey);

            const total = record.challenges.length;
            const done = record.challenges.filter(c => c.completed).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            const hasGym = record.challenges.some(c => c.category === 'gym' && c.completed);
            const igDoneCount = record.challenges.filter(c => c.category === 'instagram' && c.completed).length;
            const ttDoneCount = record.challenges.filter(c => c.category === 'tiktok' && c.completed).length;

            const isDeadline = dateKey === TARGET_DEADLINE;
            const daysToD = getDaysRemainingUntilDeadline(dateKey);

            return (
              <div
                key={idx}
                onClick={() => onOpenDayView(date)}
                className={`min-h-[105px] p-2 sm:p-2.5 cursor-pointer transition-all duration-150 relative flex flex-col justify-between group ${
                  !isCurrentMonth
                    ? 'bg-zinc-950/40 opacity-30'
                    : isDeadline
                    ? 'bg-red-950/40 ring-2 ring-red-500 z-20 shadow-lg shadow-red-500/20'
                    : isToday
                    ? 'bg-zinc-900 ring-2 ring-purple-500 z-10'
                    : 'bg-zinc-900 hover:bg-zinc-800/80'
                }`}
              >
                {/* Cell Header: Day Number + Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-extrabold rounded-md px-1.5 py-0.5 ${
                      isDeadline
                        ? 'bg-red-600 text-white font-black animate-pulse'
                        : isToday 
                        ? 'bg-purple-600 text-white' 
                        : isSunday 
                        ? 'text-amber-400' 
                        : 'text-zinc-200'
                    }`}>
                      {date.getDate()}
                    </span>
                    {isCurrentMonth && daysToD > 0 && !isDeadline && (
                      <span className="text-[9px] font-mono text-zinc-400">
                        D-{daysToD}
                      </span>
                    )}
                  </div>

                  {isDeadline ? (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600/80 text-white">
                      DIA D
                    </span>
                  ) : isCurrentMonth && total > 0 && done > 0 ? (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      pct === 100
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {pct}%
                    </span>
                  ) : null}
                </div>

                {/* Badges / Micro indicators */}
                {isCurrentMonth && (
                  <div className="space-y-1 my-1">
                    {/* Visual icons of what got completed */}
                    <div className="flex flex-wrap items-center gap-1 text-[11px]">
                      {hasGym && (
                        <span title="Academia realizada" className="p-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          <Dumbbell className="w-3 h-3" />
                        </span>
                      )}
                      {(igDoneCount > 0 || ttDoneCount > 0) && (
                        <span title={`${igDoneCount + ttDoneCount} vídeos postados`} className="p-0.5 rounded bg-purple-500/10 text-purple-400 flex items-center font-mono text-[9px]">
                          <Video className="w-3 h-3 mr-0.5" />
                          {igDoneCount + ttDoneCount}
                        </span>
                      )}
                      {isSunday && (
                        <span title="Igreja à noite" className="p-0.5 rounded bg-amber-500/10 text-amber-400">
                          <Church className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom line progress */}
                {isCurrentMonth && (
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all ${
                        pct === 100 ? 'bg-emerald-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
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
