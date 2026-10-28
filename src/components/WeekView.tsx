import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight
} from 'lucide-react';
import { DayRecord } from '../types';
import { getDayRecord, saveDayRecord, formatDateKey, getDaysRemainingUntilDeadline, TARGET_DEADLINE } from '../utils/storage';

interface WeekViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenDayView: (date: Date) => void;
  onUpdateDayRecord: (record: DayRecord) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  onOpenDayView,
  onUpdateDayRecord,
}) => {
  const getWeekDates = (baseDate: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(baseDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
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
    <div className="max-w-6xl mx-auto space-y-4">
      {/* 7 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const isToday = dateKey === todayKey;
          const isDeadline = dateKey === TARGET_DEADLINE;
          const isSunday = date.getDay() === 0;
          const record = getDayRecord(dateKey);

          const totalChallenges = record.challenges.length;
          const completedChallenges = record.challenges.filter((c) => c.completed).length;
          const pct = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;
          const daysToD = getDaysRemainingUntilDeadline(dateKey);

          const igCount = record.challenges.filter((c) => c.category === 'instagram' && c.completed).length;
          const ttCount = record.challenges.filter((c) => c.category === 'tiktok' && c.completed).length;

          return (
            <div
              key={dateKey}
              className={`flex flex-col rounded-xl border transition-colors ${
                isDeadline
                  ? 'bg-red-950/20 border-red-500/50'
                  : isToday
                  ? 'bg-zinc-900 border-zinc-700'
                  : 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {/* Day Header */}
              <div className="p-3 border-b border-zinc-800/60 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-zinc-400 block">
                    {dayNames[index]}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-zinc-200">
                      {date.getDate()} {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </span>
                    {isDeadline && (
                      <span className="text-[9px] font-mono font-bold text-red-400">
                        [D-Day]
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-zinc-400">
                  {completedChallenges}/{totalChallenges}
                </span>
              </div>

              {/* Tasks list */}
              <div className="p-2.5 flex-1 space-y-1.5 text-xs">
                {/* Academia */}
                {record.challenges
                  .filter(c => c.category === 'gym')
                  .map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleWeekChallenge(dateKey, ch.id)}
                      className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition ${
                        ch.completed ? 'opacity-40 line-through text-zinc-400' : 'text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      <span>Academia</span>
                      {ch.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                    </div>
                  ))}

                {/* 3x IG */}
                <div className="flex items-center justify-between py-1 px-1.5 text-zinc-400">
                  <span>Instagram</span>
                  <span className="font-mono text-[11px] text-zinc-300">{igCount}/3</span>
                </div>

                {/* 3x TT */}
                <div className="flex items-center justify-between py-1 px-1.5 text-zinc-400">
                  <span>TikTok</span>
                  <span className="font-mono text-[11px] text-zinc-300">{ttCount}/3</span>
                </div>

                {/* TikTok Ads */}
                {record.challenges
                  .filter(c => c.category === 'tiktok_ads')
                  .map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleWeekChallenge(dateKey, ch.id)}
                      className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition ${
                        ch.completed ? 'opacity-40 line-through text-zinc-400' : 'text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      <span>TikTok Ads</span>
                      {ch.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                    </div>
                  ))}

                {/* Facebook Ads */}
                {record.challenges
                  .filter(c => c.category === 'facebook_ads')
                  .map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleWeekChallenge(dateKey, ch.id)}
                      className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition ${
                        ch.completed ? 'opacity-40 line-through text-zinc-400' : 'text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      <span>Facebook Ads</span>
                      {ch.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-600" />}
                    </div>
                  ))}

                {/* Igreja domingo */}
                {isSunday && record.challenges
                  .filter(c => c.category === 'church')
                  .map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleWeekChallenge(dateKey, ch.id)}
                      className={`flex items-center justify-between py-1 px-1.5 rounded cursor-pointer text-amber-300/90 transition ${
                        ch.completed ? 'opacity-40 line-through text-zinc-400' : 'hover:bg-zinc-800/50'
                      }`}
                    >
                      <span>Igreja à noite</span>
                      {ch.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <Circle className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  ))}
              </div>

              {/* Day footer */}
              <div className="p-2 border-t border-zinc-800/60">
                <button
                  onClick={() => onOpenDayView(date)}
                  className="w-full py-1 text-center text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  Abrir dia →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
