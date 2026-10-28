import { Challenge, ScheduleBlock } from '../types';

export const createDefaultChallenges = (dateStr: string): Challenge[] => {
  const date = new Date(dateStr + 'T12:00:00');
  const isSunday = date.getDay() === 0;

  const base: Challenge[] = [
    // Academia
    {
      id: 'gym-morning',
      title: 'Academia & Treino Matinal',
      subtitle: isSunday ? 'Recuperação ativa / Caminhada matinal' : 'Treino de força / Hipertrofia às 07:00',
      category: 'gym',
      completed: false,
      timeTarget: isSunday ? '09:30' : '07:00',
      iconName: 'Dumbbell',
    },
    // Almoço
    {
      id: 'lunch-strategic',
      title: 'Almoço Saudável & Descanso',
      subtitle: 'Refeição nutritiva sem telas para recarregar as energias',
      category: 'lunch',
      completed: false,
      timeTarget: '12:00',
      iconName: 'Utensils',
    },
    // TikTok Ads
    {
      id: 'tiktok-ads-check',
      title: 'Verificar Anúncios no TikTok Ads',
      subtitle: 'Checar ROAS, CPA, CTR, pausar criativos caros e monitorar escala',
      category: 'tiktok_ads',
      completed: false,
      timeTarget: '09:15',
      iconName: 'TrendingUp',
      metricData: {
        spend: '',
        cpa: '',
        roas: '',
        clicks: '',
        notes: ''
      }
    },
    // Facebook Ads
    {
      id: 'fb-ads-start',
      title: 'Executar Facebook Ads (Meta Ads)',
      subtitle: 'Estruturação, públicos, criativos e campanhas de conversão',
      category: 'facebook_ads',
      completed: false,
      timeTarget: '10:00',
      iconName: 'Target',
    },
    // Instagram 3 Vídeos
    {
      id: 'insta-v1',
      title: 'Instagram: Vídeo 1 / 3',
      subtitle: 'Reels 1 - Almoço (Tema: Gancho forte / Entrega rápida)',
      category: 'instagram',
      completed: false,
      timeTarget: '11:30',
      iconName: 'Instagram',
    },
    {
      id: 'insta-v2',
      title: 'Instagram: Vídeo 2 / 3',
      subtitle: 'Reels 2 - Tarde (Tema: Conteúdo de autoridade / Valor prático)',
      category: 'instagram',
      completed: false,
      timeTarget: '15:30',
      iconName: 'Instagram',
    },
    {
      id: 'insta-v3',
      title: 'Instagram: Vídeo 3 / 3',
      subtitle: 'Reels 3 - Horário Nobre Noite (Tema: Viral / Narrativa / CTA)',
      category: 'instagram',
      completed: false,
      timeTarget: '17:30',
      iconName: 'Instagram',
    },
    // TikTok 3 Vídeos
    {
      id: 'tiktok-v1',
      title: 'TikTok: Vídeo 1 / 3',
      subtitle: 'TikTok 1 - Almoço (Áudio em alta / Hook nos primeiros 3s)',
      category: 'tiktok',
      completed: false,
      timeTarget: '11:30',
      iconName: 'Video',
    },
    {
      id: 'tiktok-v2',
      title: 'TikTok: Vídeo 2 / 3',
      subtitle: 'TikTok 2 - Tarde (Storytelling / Tutorial direto ao ponto)',
      category: 'tiktok',
      completed: false,
      timeTarget: '15:30',
      iconName: 'Video',
    },
    {
      id: 'tiktok-v3',
      title: 'TikTok: Vídeo 3 / 3',
      subtitle: 'TikTok 3 - Pico Noturno (Tendência / Opinião forte / Prova social)',
      category: 'tiktok',
      completed: false,
      timeTarget: '17:30',
      iconName: 'Video',
    },
  ];

  if (isSunday) {
    base.push({
      id: 'church-sunday',
      title: 'Igreja & Culto à Noite',
      subtitle: 'Momento sagrado de conexão espiritual, oração e comunhão às 18:30',
      category: 'church',
      completed: false,
      timeTarget: '18:30',
      iconName: 'Church',
    });
  }

  return base;
};

export const createDefaultSchedule = (dateStr: string): ScheduleBlock[] => {
  const date = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

  if (dayOfWeek === 0) {
    // DOMINGO
    return [
      {
        id: 'dom-01',
        startTime: '08:00',
        endTime: '09:00',
        title: 'Despertar com Calma, Oração & Hidratação',
        category: 'routine',
        description: 'Começar o Domingo em paz, café da manhã calmo e alinhamento mental.',
        completed: false,
        accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      },
      {
        id: 'dom-02',
        startTime: '09:00',
        endTime: '10:30',
        title: 'Caminhada ao Ar Livre / Treino Leve',
        category: 'gym',
        description: 'Recuperação ativa, movimentar o corpo e tomar sol.',
        completed: false,
        linkedChallengeId: 'gym-morning',
        accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      },
      {
        id: 'dom-03',
        startTime: '10:30',
        endTime: '11:30',
        title: 'Revisão Rápida de Tráfego: TikTok & Facebook Ads',
        category: 'tiktok_ads',
        description: 'Verificar métricas do fim de semana, pausar criativos se ROAS cair, manter campanhas estáveis.',
        completed: false,
        linkedChallengeId: 'tiktok-ads-check',
        accentColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
      },
      {
        id: 'dom-04',
        startTime: '11:30',
        endTime: '12:00',
        title: 'Publicação #1: Post Vídeo 1 (Instagram + TikTok)',
        category: 'work',
        description: 'Postar o primeiro lote de conteúdo do domingo.',
        completed: false,
        linkedChallengeId: 'insta-v1',
        accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300'
      },
      {
        id: 'dom-05',
        startTime: '12:00',
        endTime: '14:00',
        title: 'Almoço Especial de Domingo com Família',
        category: 'lunch',
        description: 'Tempo de qualidade, comida boa e descanso merecido.',
        completed: false,
        linkedChallengeId: 'lunch-strategic',
        accentColor: 'border-orange-500/30 bg-orange-500/10 text-orange-300'
      },
      {
        id: 'dom-06',
        startTime: '14:30',
        endTime: '15:00',
        title: 'Publicação #2: Post Vídeo 2 (Instagram + TikTok)',
        category: 'work',
        description: 'Postar o segundo lote de vídeos nos horários de lazer das redes.',
        completed: false,
        linkedChallengeId: 'insta-v2',
        accentColor: 'border-pink-500/30 bg-pink-500/10 text-pink-300'
      },
      {
        id: 'dom-07',
        startTime: '16:00',
        endTime: '17:00',
        title: 'Publicação #3 + Planejamento da Semana',
        category: 'work',
        description: 'Postar o 3º vídeo do dia e definir as prioridades dos anúncios da semana.',
        completed: false,
        linkedChallengeId: 'insta-v3',
        accentColor: 'border-violet-500/30 bg-violet-500/10 text-violet-300'
      },
      {
        id: 'dom-08',
        startTime: '17:30',
        endTime: '18:30',
        title: 'Preparação para a Igreja: Banho & Roupa',
        category: 'routine',
        description: 'Desconectar do trabalho comercial, focar no propósito e gratidão.',
        completed: false,
        accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300'
      },
      {
        id: 'dom-09',
        startTime: '18:30',
        endTime: '21:00',
        title: '⛪ IGREJA / CULTO À NOITE',
        category: 'church',
        description: 'Louvor, adoração, palavra edificante e comunhão com Deus.',
        completed: false,
        linkedChallengeId: 'church-sunday',
        accentColor: 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/30'
      },
      {
        id: 'dom-10',
        startTime: '21:30',
        endTime: '22:30',
        title: 'Ceia Leve, Oração Final & Sono Reparador',
        category: 'rest',
        description: 'Dormir cedo com a mente serena para acordar pronto na segunda-feira.',
        completed: false,
        accentColor: 'border-zinc-700 bg-zinc-800/40 text-zinc-300'
      }
    ];
  }

  if (dayOfWeek === 6) {
    // SÁBADO
    return [
      {
        id: 'sab-01',
        startTime: '07:30',
        endTime: '09:00',
        title: 'Academia / Treino de Sábado',
        category: 'gym',
        description: 'Treino matinal completo com foco em intensidade e recuperação.',
        completed: false,
        linkedChallengeId: 'gym-morning',
        accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      },
      {
        id: 'sab-02',
        startTime: '09:00',
        endTime: '10:00',
        title: 'Café da Manhã Reforçado & Banho',
        category: 'routine',
        description: 'Proteína, hidratação e organização do sábado.',
        completed: false,
        accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      },
      {
        id: 'sab-03',
        startTime: '10:00',
        endTime: '11:00',
        title: 'Análise de Tráfego: TikTok Ads + Facebook Ads',
        category: 'tiktok_ads',
        description: 'Checar métricas diárias, ROAS, CPA e programar ajustes de fim de semana.',
        completed: false,
        linkedChallengeId: 'tiktok-ads-check',
        accentColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
      },
      {
        id: 'sab-04',
        startTime: '11:30',
        endTime: '12:00',
        title: 'Publicação #1: Instagram + TikTok (Vídeo 1)',
        category: 'work',
        description: 'Postar o 1º vídeo do dia em ambas as redes.',
        completed: false,
        linkedChallengeId: 'insta-v1',
        accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300'
      },
      {
        id: 'sab-05',
        startTime: '12:00',
        endTime: '13:30',
        title: 'Almoço Saudável & Descanso',
        category: 'lunch',
        description: 'Pausa nutritiva para recarregar o cérebro.',
        completed: false,
        linkedChallengeId: 'lunch-strategic',
        accentColor: 'border-orange-500/30 bg-orange-500/10 text-orange-300'
      },
      {
        id: 'sab-06',
        startTime: '13:30',
        endTime: '15:30',
        title: 'Gravação em Lote & Criativos de Anúncios',
        category: 'work',
        description: 'Aproveitar a tarde de sábado para adiantar vídeos e criativos da semana.',
        completed: false,
        accentColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
      },
      {
        id: 'sab-07',
        startTime: '15:30',
        endTime: '16:00',
        title: 'Publicação #2: Instagram + TikTok (Vídeo 2)',
        category: 'work',
        description: 'Postar o 2º vídeo do dia.',
        completed: false,
        linkedChallengeId: 'insta-v2',
        accentColor: 'border-pink-500/30 bg-pink-500/10 text-pink-300'
      },
      {
        id: 'sab-08',
        startTime: '17:30',
        endTime: '18:00',
        title: 'Publicação #3: Instagram + TikTok (Vídeo 3)',
        category: 'work',
        description: 'Postar o 3º vídeo do dia no horário nobre do sábado.',
        completed: false,
        linkedChallengeId: 'insta-v3',
        accentColor: 'border-violet-500/30 bg-violet-500/10 text-violet-300'
      },
      {
        id: 'sab-09',
        startTime: '18:30',
        endTime: '22:30',
        title: 'Noite Livre / Lazer & Jantar',
        category: 'rest',
        description: 'Tempo com amigos/família, cinema ou descanso total.',
        completed: false,
        accentColor: 'border-zinc-700 bg-zinc-800/40 text-zinc-300'
      }
    ];
  }

  // SEGUNDA A SEXTA (Rotina Padrão Implacável)
  return [
    {
      id: 'seg-01',
      startTime: '06:30',
      endTime: '07:00',
      title: 'Acordar, Hidratação & Preparação',
      category: 'routine',
      description: '500ml de água, creatina/café pré-treino, vestir roupa de treino sem enrolação.',
      completed: false,
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    },
    {
      id: 'seg-02',
      startTime: '07:00',
      endTime: '08:30',
      title: '🏋️ ACADEMIA / Treino Matinal de Força',
      category: 'gym',
      description: 'Foco total no treino. Liberação de dopamina e energia para dominar o dia.',
      completed: false,
      linkedChallengeId: 'gym-morning',
      accentColor: 'border-emerald-500 bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/40'
    },
    {
      id: 'seg-03',
      startTime: '08:30',
      endTime: '09:15',
      title: 'Banho Restaurador & Café da Manhã Rico em Proteína',
      category: 'routine',
      description: 'Refeição pós-treino (ovos, frutas, whey) e preparação do setup de trabalho.',
      completed: false,
      accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300'
    },
    {
      id: 'seg-04',
      startTime: '09:15',
      endTime: '10:00',
      title: '📊 TRÁFEGO 1: Análise Diária TikTok Ads',
      category: 'tiktok_ads',
      description: 'Abrir o TikTok Ads Manager: Analisar ROAS, CPA, CTR dos criativos. Pausar o que não vendeu e anotar dados.',
      completed: false,
      linkedChallengeId: 'tiktok-ads-check',
      accentColor: 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
    },
    {
      id: 'seg-05',
      startTime: '10:00',
      endTime: '11:30',
      title: '🎯 TRÁFEGO 2: Facebook Ads (Meta Ads) - Execução',
      category: 'facebook_ads',
      description: 'Estruturação da conta, pixel, criação de públicos, subir novos anúncios e campanhas CBO de teste.',
      completed: false,
      linkedChallengeId: 'fb-ads-start',
      accentColor: 'border-blue-500 bg-blue-500/20 text-blue-200'
    },
    {
      id: 'seg-06',
      startTime: '11:30',
      endTime: '12:00',
      title: '📱 PUBLICAÇÃO #1: Instagram + TikTok (Vídeo 1)',
      category: 'work',
      description: 'Postar o 1º vídeo do dia no Instagram Reels e no TikTok. Ficar 10min interagindo.',
      completed: false,
      linkedChallengeId: 'insta-v1',
      accentColor: 'border-purple-500 bg-purple-500/20 text-purple-200'
    },
    {
      id: 'seg-07',
      startTime: '12:00',
      endTime: '13:30',
      title: '🍽️ ALMOÇO NUTRITIVO & Descanso Estratégico',
      category: 'lunch',
      description: 'Comida de verdade, digestão sem pressa e desconexão das redes sociais.',
      completed: false,
      linkedChallengeId: 'lunch-strategic',
      accentColor: 'border-orange-500 bg-orange-500/20 text-orange-200'
    },
    {
      id: 'seg-08',
      startTime: '13:30',
      endTime: '15:30',
      title: '🎬 BLOCO DE PRODUÇÃO: Gravação & Edição de Conteúdo',
      category: 'work',
      description: 'Gravar e editar os 3 vídeos do dia / novos criativos para os anúncios de Facebook e TikTok.',
      completed: false,
      accentColor: 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-200'
    },
    {
      id: 'seg-09',
      startTime: '15:30',
      endTime: '16:00',
      title: '📱 PUBLICAÇÃO #2: Instagram + TikTok (Vídeo 2)',
      category: 'work',
      description: 'Postar o 2º vídeo do dia em ambas as plataformas e responder aos primeiros comentários.',
      completed: false,
      linkedChallengeId: 'insta-v2',
      accentColor: 'border-pink-500 bg-pink-500/20 text-pink-200'
    },
    {
      id: 'seg-10',
      startTime: '16:00',
      endTime: '17:30',
      title: '⚡ Otimização de Anúncios & Roteirização Estratégica',
      category: 'work',
      description: 'Revisar hooks, testar novas chamadas para ação (CTAs) e preparar os criativos do dia seguinte.',
      completed: false,
      accentColor: 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
    },
    {
      id: 'seg-11',
      startTime: '17:30',
      endTime: '18:30',
      title: '📱 PUBLICAÇÃO #3: Instagram + TikTok (Vídeo 3 - Horário Nobre)',
      category: 'work',
      description: 'Postar o 3º vídeo do dia no pico de tráfego orgânico da noite.',
      completed: false,
      linkedChallengeId: 'insta-v3',
      accentColor: 'border-violet-500 bg-violet-500/20 text-violet-200'
    },
    {
      id: 'seg-12',
      startTime: '18:30',
      endTime: '19:15',
      title: '📋 Fechamento do Dia & Check de Metas',
      category: 'routine',
      description: 'Confirmar os 8 desafios cumpridos no calendário, preencher métricas de ads e celebrar vitória.',
      completed: false,
      accentColor: 'border-teal-500 bg-teal-500/20 text-teal-200'
    },
    {
      id: 'seg-13',
      startTime: '19:30',
      endTime: '21:00',
      title: '🥗 Jantar & Descanso / Lazer',
      category: 'rest',
      description: 'Jantar saudável, relaxar, conversar e descontrair a mente.',
      completed: false,
      accentColor: 'border-zinc-700 bg-zinc-800/40 text-zinc-300'
    },
    {
      id: 'seg-14',
      startTime: '21:30',
      endTime: '22:30',
      title: '📖 Desconexão de Telas, Leitura & Preparo para Dormir',
      category: 'rest',
      description: 'Desligar celular, reduzir iluminação da casa, preparar sono reparador.',
      completed: false,
      accentColor: 'border-zinc-800 bg-zinc-900/50 text-zinc-400'
    },
    {
      id: 'seg-15',
      startTime: '22:30',
      endTime: '06:30',
      title: '😴 Sono Reparador (8 Horas)',
      category: 'rest',
      description: 'Recuperação muscular do treino e consolidação de memória.',
      completed: false,
      accentColor: 'border-zinc-800 bg-zinc-900/50 text-zinc-500'
    }
  ];
};

export const defaultFacebookAdsRoadmap: { phase: string; title: string; desc: string; icon: string }[] = [
  {
    phase: 'Etapa 1',
    title: 'Configuração da Base & Ativos',
    desc: 'Criar ou validar Gerenciador de Negócios (BM), Página do FB, Conta de Anúncios, Pixel da Meta e API de Conversões instalada.',
    icon: 'Settings'
  },
  {
    phase: 'Etapa 2',
    title: 'Definição de Oferta & Públicos',
    desc: 'Mapear os 3 maiores desejos do cliente, criar Públicos Personalizados (Visitantes do site, Engajamento IG) e Públicos de Interesse Aberto.',
    icon: 'Users'
  },
  {
    phase: 'Etapa 3',
    title: 'Produção de Criativos Vencedores',
    desc: 'Preparar pelo menos 3 criativos em vídeo (Formato 4:5 ou 9:16) inspirados nos que já funcionam no TikTok orgânico.',
    icon: 'Sparkles'
  },
  {
    phase: 'Etapa 4',
    title: 'Subir Primeira Campanha de Vendas/Leads (CBO/ABO)',
    desc: 'Objetivo de Conversão (Compras ou Cadastros), orçamento diário controlado, 3 a 5 criativos rodando para validação rápida.',
    icon: 'Rocket'
  },
  {
    phase: 'Etapa 5',
    title: 'Análise de Primeiros Dados (24h - 48h)',
    desc: 'Verificar se CTR no link está > 1,5%, CPC controlado, e primeiras conversões caindo. Pausar anúncios ruins.',
    icon: 'BarChart3'
  },
  {
    phase: 'Etapa 6',
    title: 'Escala & Novos Testes',
    desc: 'Aumentar orçamento em 15-20% nos conjuntos vencedores e duplicar para testar novos ângulos de criativos.',
    icon: 'Flame'
  }
];
