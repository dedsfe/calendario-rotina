import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Rocket, Target, ShieldCheck, Video, BarChart2, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { defaultFacebookAdsRoadmap } from '../data/defaultRoutine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_FB_STEPS = 'rotina_fb_ads_steps';

export const FacebookAdsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FB_STEPS);
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleStep = (idx: number) => {
    const updated = { ...completedSteps, [idx]: !completedSteps[idx] };
    setCompletedSteps(updated);
    localStorage.setItem(STORAGE_FB_STEPS, JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const totalSteps = defaultFacebookAdsRoadmap.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Plano de Ação: Começar no Facebook Ads
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-medium">
                  Meta Ads
                </span>
              </h2>
              <p className="text-sm text-zinc-400">
                Seu passo a passo diário para estruturar, testar criativos e rodar anúncios lucrativos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-zinc-950/40 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Progresso da Trilha:</span>
            <span className="text-sm font-bold text-blue-400">{completedCount} de {totalSteps} etapas ({progressPercent}%)</span>
          </div>
          <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-zinc-800/60">
          {defaultFacebookAdsRoadmap.map((item, idx) => {
            const isDone = !!completedSteps[idx];
            return (
              <div 
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`pt-4 first:pt-0 cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
                  isDone 
                    ? 'bg-blue-950/20 border-blue-900/40 opacity-75' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button className="mt-1 flex-shrink-0 text-blue-400">
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-600 hover:text-zinc-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {item.phase}
                      </span>
                      <h4 className={`text-base font-semibold ${isDone ? 'line-through text-zinc-400' : 'text-zinc-100'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick tips callout */}
          <div className="pt-4">
            <div className="rounded-xl p-4 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-white mb-1">Dica de Mestre para Casar TikTok + Facebook:</h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Pegue os melhores vídeos que bateram mais visualizações orgânicas no TikTok e no Instagram Reels (com os ganchos mais fortes) e use diretamente como criativos no Facebook Ads (Meta Ads). Vídeos nativos gravados com celular geram muito mais cliques baratos que vídeos engessados de estúdio!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <p className="text-xs text-zinc-500">
            Seu progresso é gravado automaticamente no navegador.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-500/20"
          >
            Entendido, Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
