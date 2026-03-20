'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ── Search index ────────────────────────────────────────────────────────────
type ItemType = 'cert' | 'resource' | 'path' | 'market';

interface SearchItem {
  id: string; type: ItemType; icon: string;
  title: string; sub: string; href: string; tags: string[];
  // Detail panel
  level?: string; levelColor?: string;
  cost?: string; hours?: string; provider?: string;
  desc: string;
  meta?: { label: string; value: string }[];
  actions?: { label: string; href: string; primary?: boolean }[];
}

const INDEX: SearchItem[] = [
  // ── Certificações ─────────────────────────────────────────────────────────
  { id:'c1', type:'cert', icon:'🛡️', title:'Security+', sub:'CompTIA · Entry · $392', href:'/certifications?search=Security%2B', tags:['sec+','entry','defensive','baseline','dod','comptia'],
    level:'ENTRY', levelColor:'#22c55e', cost:'$392', hours:'80–120h', provider:'CompTIA',
    desc:'Certificação baseline mais reconhecida mundialmente. Exigida pelo DoD dos EUA. Abre portas para qualquer role entry-level em security. Ideal como primeiro passo.',
    meta:[{label:'Duração exame',value:'90 min · 90 questões'},{label:'Score mínimo',value:'750/900'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=Security%2B',primary:true},{label:'Ver recursos',href:'/resources?search=sec+'}] },

  { id:'c2', type:'cert', icon:'🎯', title:'eJPT', sub:'INE Security · Entry · $200', href:'/certifications?search=eJPT', tags:['ejpt','entry','pentest','offensive','ine','prático'],
    level:'ENTRY', levelColor:'#22c55e', cost:'$200', hours:'60–80h', provider:'INE Security',
    desc:'Certificação prática de pentest para iniciantes. Exame 100% hands-on em laboratório. Sem questões de múltipla escolha. Melhor ponto de entrada para red team.',
    meta:[{label:'Tipo de exame',value:'24h prático em lab'},{label:'Validade',value:'Lifetime'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=eJPT',primary:true},{label:'Roadmap ofensivo',href:'/roadmap'}] },

  { id:'c3', type:'cert', icon:'🔵', title:'CySA+', sub:'CompTIA · Intermediate · $392', href:'/certifications?search=CySA%2B', tags:['cysa','intermediate','blue team','soc','defensive'],
    level:'INTERMEDIATE', levelColor:'#3b82f6', cost:'$392', hours:'80–100h', provider:'CompTIA',
    desc:'Análise comportamental para combater ameaças. Foca em threat intelligence, gestão de vulnerabilidades e IR. Muito pedido em SOC Tier 2.',
    meta:[{label:'Duração exame',value:'165 min · 85 questões'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CySA%2B',primary:true},{label:'Ver recursos blue team',href:'/resources'}] },

  { id:'c4', type:'cert', icon:'🔴', title:'CEH', sub:'EC-Council · Intermediate · $1.199', href:'/certifications?search=CEH', tags:['ceh','intermediate','ethical hacking','offensive','ec-council'],
    level:'INTERMEDIATE', levelColor:'#3b82f6', cost:'$1.199', hours:'120–160h', provider:'EC-Council',
    desc:'Metodologia de ethical hacking com 20 disciplinas. Reconhecido por Fortune 500. Mais teórico que o PNPT/OSCP mas tem forte reconhecimento de marca.',
    meta:[{label:'Duração exame',value:'240 min · 125 questões'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CEH',primary:true}] },

  { id:'c5', type:'cert', icon:'🔴', title:'GPEN', sub:'SANS/GIAC · Intermediate · $979', href:'/certifications?search=GPEN', tags:['gpen','intermediate','pentest','offensive','sans','giac','active directory'],
    level:'INTERMEDIATE', levelColor:'#3b82f6', cost:'$979', hours:'120–140h', provider:'SANS/GIAC',
    desc:'Certificação de pentest reconhecida pela indústria. Cobre metodologia completa, Active Directory attacks e ambientes corporativos reais.',
    meta:[{label:'Duração exame',value:'180 min · 115 questões'},{label:'Validade',value:'4 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=GPEN',primary:true}] },

  { id:'c6', type:'cert', icon:'🔥', title:'OSCP', sub:'Offensive Security · Advanced · $1.499', href:'/certifications?search=OSCP', tags:['oscp','advanced','pentest','offensive','try harder','offensive security'],
    level:'ADVANCED', levelColor:'#f59e0b', cost:'$1.499', hours:'300–500h', provider:'Offensive Security',
    desc:'A certificação ofensiva mais respeitada. Exame prático de 24h em rede isolada. "Try Harder" é o mantra. Diferencia candidatos de forma definitiva no mercado.',
    meta:[{label:'Tipo de exame',value:'24h prático + 24h relatório'},{label:'Validade',value:'Lifetime'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=OSCP',primary:true},{label:'Prep list TJ Null',href:'/resources?search=oscp'}] },

  { id:'c7', type:'cert', icon:'🏆', title:'CISSP', sub:'(ISC)² · Advanced · $749', href:'/certifications?search=CISSP', tags:['cissp','advanced','governance','gold standard','isc2','arquitetura'],
    level:'ADVANCED', levelColor:'#f59e0b', cost:'$749', hours:'200–300h', provider:'(ISC)²',
    desc:'O padrão ouro para liderança em security. Cobre 8 domínios. Exigido para CISO, Security Architect. Requer 5 anos de experiência para certificar.',
    meta:[{label:'Duração exame',value:'360 min · 125–175 questões'},{label:'Experiência requerida',value:'5 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CISSP',primary:true}] },

  { id:'c8', type:'cert', icon:'🟣', title:'CISM', sub:'ISACA · Advanced · $575', href:'/certifications?search=CISM', tags:['cism','advanced','governance','risk','management','isaca'],
    level:'ADVANCED', levelColor:'#f59e0b', cost:'$575', hours:'150–200h', provider:'ISACA',
    desc:'Gestão de segurança da informação. Governance, risk management e desenvolvimento de programas. Muito valorizado na Europa e em roles que combinam técnica com negócio.',
    meta:[{label:'Duração exame',value:'240 min · 150 questões'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CISM',primary:true}] },

  { id:'c9', type:'cert', icon:'🆓', title:'ISC2 CC', sub:'(ISC)² · Entry · ~$199', href:'/certifications?search=CC', tags:['cc','entry','isc2','gratuito','free','iniciante','transição','dev'],
    level:'ENTRY', levelColor:'#22c55e', cost:'~$199', hours:'40–60h', provider:'(ISC)²',
    desc:'Certificação entry-level da mesma organização do CISSP. Peso de marca enorme para iniciante. Treinamento oficial gratuito. Primeira credencial ideal para devs em transição.',
    meta:[{label:'Duração exame',value:'120 min · 100 questões'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CC',primary:true},{label:'Dev → Security path',href:'/roadmap'}] },

  { id:'c10', type:'cert', icon:'⚡', title:'PNPT', sub:'TCM Security · Intermediate · $400', href:'/certifications?search=PNPT', tags:['pnpt','intermediate','pentest','practical','tcm','dev','relatório'],
    level:'INTERMEDIATE', levelColor:'#3b82f6', cost:'$400', hours:'80–120h', provider:'TCM Security',
    desc:'Certificação 100% prática do TCM Security. Exame de 5 dias com relatório real de pentest. Muito mais respeitada tecnicamente que CEH. Background dev é vantagem direta.',
    meta:[{label:'Tipo de exame',value:'5 dias + relatório'},{label:'Validade',value:'Lifetime'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=PNPT',primary:true},{label:'TCM Academy',href:'/resources'}] },

  { id:'c11', type:'cert', icon:'☁️', title:'AWS Security', sub:'AWS · Advanced · $300', href:'/certifications?search=AWS', tags:['aws','advanced','cloud','cloud security','amazon','specialty'],
    level:'ADVANCED', levelColor:'#f59e0b', cost:'$300', hours:'150–200h', provider:'Amazon Web Services',
    desc:'A certificação de cloud security mais pedida. 80% das vagas de Security Engineer envolvem cloud. Foco em IAM, encryption, logging e IR na AWS.',
    meta:[{label:'Duração exame',value:'170 min · 65 questões'},{label:'Validade',value:'3 anos'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=AWS',primary:true},{label:'Ver mercado cloud',href:'/market'}] },

  { id:'c12', type:'cert', icon:'🌐', title:'Google Cyber', sub:'Google · Entry · ~$200', href:'/certifications?search=Google', tags:['google','entry','certificado','coursera','linkedin'],
    level:'ENTRY', levelColor:'#22c55e', cost:'~$200', hours:'120–180h', provider:'Google/Coursera',
    desc:'Certificado do Google em parceria com o Coursera. 6 meses, ~$200 total. Aceito como equivalente a experiência em muitas vagas entry. Excelente para o LinkedIn.',
    meta:[{label:'Formato',value:'6 meses · Online self-paced'},{label:'Validade',value:'Lifetime'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=Google',primary:true}] },

  { id:'c13', type:'cert', icon:'🧪', title:'HTB CPTS', sub:'HackTheBox · Advanced · $490', href:'/certifications?search=CPTS', tags:['cpts','advanced','hackthebox','htb','pentest','oscp alternativa'],
    level:'ADVANCED', levelColor:'#f59e0b', cost:'$490', hours:'200–300h', provider:'HackTheBox',
    desc:'Certificação hands-on do HackTheBox lançada em 2023. Completamente prática, reconhecida pelo mercado técnico. Boa alternativa ao OSCP com preço mais acessível.',
    meta:[{label:'Tipo de exame',value:'10 dias prático'},{label:'Validade',value:'Lifetime'}],
    actions:[{label:'Ver certificação',href:'/certifications?search=CPTS',primary:true}] },

  // ── Resources ──────────────────────────────────────────────────────────────
  { id:'r1', type:'resource', icon:'🎓', title:'Professor Messer SY0-701', sub:'Gratuito · Vídeo · 14h', href:'/resources', tags:['professor messer','sec+','free','gratuito','video'],
    provider:'Professor Messer', cost:'Gratuito', hours:'14h',
    desc:'O melhor curso gratuito para Security+. Vídeos curtos e objetivos cobrindo todo o SY0-701. Rating 4.9. Acompanha notas de estudo e simulados opcionais.',
    meta:[{label:'Tipo',value:'Vídeo gratuito'},{label:'Rating',value:'⭐ 4.9'}],
    actions:[{label:'Acessar recurso',href:'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',primary:true},{label:'Ver todos os recursos',href:'/resources?search=sec+'}] },

  { id:'r2', type:'resource', icon:'🧪', title:'TryHackMe Pre-Security', sub:'Freemium · Lab · 40h', href:'/resources', tags:['tryhackme','free','lab','iniciante','beginner','fundamentos'],
    provider:'TryHackMe', cost:'Gratuito / $14/mês', hours:'40h',
    desc:'Caminho interativo para iniciantes. Cobre networking, Linux, web basics e security fundamentals. Conteúdo básico gratuito, labs avançados precisam de assinatura.',
    meta:[{label:'Tipo',value:'Lab interativo'},{label:'Rating',value:'⭐ 4.8'}],
    actions:[{label:'Acessar recurso',href:'https://tryhackme.com/path/outline/presecurity',primary:true}] },

  { id:'r3', type:'resource', icon:'🧪', title:'HackTheBox Starting Point', sub:'Gratuito · Lab · 20h', href:'/resources', tags:['hackthebox','htb','free','gratuito','lab','pentest','guiado'],
    provider:'HackTheBox', cost:'Gratuito', hours:'20h',
    desc:'Série de máquinas guiadas para iniciantes em HTB. Introduz metodologia de pentest real com writeups inclusos.',
    meta:[{label:'Tipo',value:'Lab guiado'},{label:'Rating',value:'⭐ 4.7'}],
    actions:[{label:'Acessar recurso',href:'https://www.hackthebox.com/starting-point',primary:true}] },

  { id:'r4', type:'resource', icon:'📖', title:'OWASP Testing Guide v4', sub:'Gratuito · PDF · Web Security', href:'/resources', tags:['owasp','free','web','app security','guia','pdf'],
    provider:'OWASP', cost:'Gratuito', hours:'~30h',
    desc:'Referência definitiva para testes em aplicações web. Cobre todos os vetores do OWASP Top 10. Essencial para qualquer dev em transição para security.',
    meta:[{label:'Tipo',value:'Guia / PDF'},{label:'Rating',value:'⭐ 4.8'}],
    actions:[{label:'Acessar recurso',href:'https://owasp.org/www-project-web-security-testing-guide/',primary:true}] },

  { id:'r5', type:'resource', icon:'▶️', title:'ippsec YouTube', sub:'Gratuito · Vídeo · OSCP prep', href:'/resources', tags:['ippsec','youtube','free','oscp','walkthroughs','htb'],
    provider:'ippsec', cost:'Gratuito', hours:'200h+',
    desc:'Canal do YouTube com walkthroughs detalhados de máquinas HTB. Essencial para preparação do OSCP. Explica o raciocínio passo a passo.',
    meta:[{label:'Tipo',value:'YouTube'},{label:'Rating',value:'⭐ 4.9'}],
    actions:[{label:'Acessar recurso',href:'https://www.youtube.com/@ippsec',primary:true}] },

  { id:'r6', type:'resource', icon:'🆓', title:'Splunk Free Training', sub:'Gratuito · Curso · SIEM', href:'/resources', tags:['splunk','free','siem','soc','logs','blue team','gratuito'],
    provider:'Splunk', cost:'Gratuito', hours:'20–30h',
    desc:'Treinamento oficial do Splunk gratuitamente. SIEM mais usado no mercado. Colocar no currículo diferencia muito em vagas de SOC. Query de logs é trivial para dev.',
    meta:[{label:'Tipo',value:'Curso oficial'},{label:'Rating',value:'⭐ 4.7'}],
    actions:[{label:'Acessar recurso',href:'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',primary:true}] },

  { id:'r7', type:'resource', icon:'⚡', title:'TCM Security PEH', sub:'$30 · Curso · PNPT/OSCP prep', href:'/resources', tags:['tcm','practical ethical hacking','peh','pentest','active directory'],
    provider:'TCM Security', cost:'$30', hours:'25h',
    desc:'Um dos melhores cursos de ethical hacking disponíveis. Cobre AD attacks, web app, relatório. Excelente custo-benefício. Background dev é vantagem enorme aqui.',
    meta:[{label:'Tipo',value:'Curso'},{label:'Rating',value:'⭐ 4.9'}],
    actions:[{label:'Acessar recurso',href:'https://academy.tcm-sec.com',primary:true}] },

  // ── Roadmap Paths ──────────────────────────────────────────────────────────
  { id:'m1', type:'path', icon:'🔀', title:'Dev → Security', sub:'Transição · 200–320h · $400–$1.200', href:'/roadmap', tags:['dev','transição','transition','developer','software','career change','começar'],
    cost:'$400–$1.200', hours:'200–320h',
    desc:'Caminho estratégico para devs mudando para security. Aproveita seu background em código — você já entende APIs, lógica de sistemas, criptografia. Mais rápido que começar do zero.',
    meta:[{label:'Passos',value:'CC → SEC+ → Splunk → PNPT'},{label:'Tempo estimado',value:'8–14 meses'}],
    actions:[{label:'Ver roadmap',href:'/roadmap',primary:true}] },

  { id:'m2', type:'path', icon:'🌱', title:'Beginner Path', sub:'Sem experiência · SEC+ + eJPT', href:'/roadmap', tags:['beginner','iniciante','zero','começar','entry','primeiro'],
    cost:'$392–$600', hours:'180–240h',
    desc:'Para quem está começando do zero em security. Foco em fundamentos sólidos antes de qualquer especialização.',
    meta:[{label:'Passos',value:'SEC+ → eJPT'},{label:'Tempo estimado',value:'6–12 meses'}],
    actions:[{label:'Ver roadmap',href:'/roadmap',primary:true}] },

  { id:'m3', type:'path', icon:'⚡', title:'Intermediate Path', sub:'1–3 anos · CySA+ / CEH / GPEN', href:'/roadmap', tags:['intermediate','intermediário','crescimento','blue team','red team'],
    cost:'$1.000–$2.500', hours:'300–500h',
    desc:'Para quem já tem Security+ e quer se especializar. Escolha entre Blue Team (CySA+), Red Team (CEH/GPEN) ou ambos.',
    meta:[{label:'Passos',value:'CySA+ ou CEH/GPEN'},{label:'Tempo estimado',value:'12–24 meses'}],
    actions:[{label:'Ver roadmap',href:'/roadmap',primary:true}] },

  // ── Market ─────────────────────────────────────────────────────────────────
  { id:'mk1', type:'market', icon:'💼', title:'SOC Analyst', sub:'$55k–$85k US · €42k–€65k DE', href:'/market', tags:['soc','analyst','salário','salary','blue team','entry'],
    desc:'Role de entrada mais comum no mercado. Alta demanda global. Foco em monitoramento, análise de alertas, SIEM e IR. Certs: Security+ e CySA+.',
    meta:[{label:'Nível',value:'Entry–Mid'},{label:'Demanda',value:'🔴 CRITICAL'},{label:'Certs recomendadas',value:'SEC+ · CySA+'}],
    actions:[{label:'Ver mercado',href:'/market',primary:true},{label:'Ver roadmap',href:'/roadmap'}] },

  { id:'mk2', type:'market', icon:'💼', title:'Penetration Tester', sub:'$90k–$145k US · €65k–€110k DE', href:'/market', tags:['pentest','pentester','red team','salário','salary','offensive'],
    desc:'Alta remuneração e demanda crescente. Exige certs práticas (OSCP/PNPT). Background dev acelera muito a entrada. Foco em simulação de ataques reais.',
    meta:[{label:'Nível',value:'Mid–Senior'},{label:'Demanda',value:'🟡 HIGH'},{label:'Certs recomendadas',value:'PNPT · CEH · OSCP'}],
    actions:[{label:'Ver mercado',href:'/market',primary:true},{label:'Ver roadmap ofensivo',href:'/roadmap'}] },

  { id:'mk3', type:'market', icon:'🌍', title:'Mercado Alemanha', sub:'CRITICAL · +42% crescimento · €82k médio', href:'/market', tags:['alemanha','germany','europa','europe','koln','berlin','köln'],
    desc:'Déficit crítico de profissionais de security na Alemanha. Crescimento de +42% ao ano. 90k+ vagas abertas. Salário médio €82k. Você está no lugar certo.',
    meta:[{label:'Demanda',value:'🔴 CRITICAL'},{label:'Crescimento',value:'+42% ao ano'},{label:'Vagas abertas',value:'90k+'}],
    actions:[{label:'Ver análise completa',href:'/market',primary:true}] },

  { id:'mk4', type:'market', icon:'🌍', title:'Mercado EUA', sub:'CRITICAL · 850k+ vagas · $105k médio', href:'/market', tags:['eua','usa','estados unidos','america','vagas','remoto'],
    desc:'O maior mercado de cybersecurity do mundo. 850k+ vagas abertas. Trabalho remoto comum para roles técnicos. Salário médio $105k para Security Engineer.',
    meta:[{label:'Demanda',value:'🔴 CRITICAL'},{label:'Vagas abertas',value:'850k+'},{label:'Crescimento',value:'+35% até 2031'}],
    actions:[{label:'Ver análise completa',href:'/market',primary:true}] },
];

const TYPE_META: Record<ItemType, { label: string; color: string; bg: string }> = {
  cert:     { label: 'Certificação', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  resource: { label: 'Recurso',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  path:     { label: 'Roadmap',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  market:   { label: 'Mercado',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

function scoreItem(item: SearchItem, q: string): number {
  const ql = q.toLowerCase();
  if (item.title.toLowerCase() === ql) return 100;
  if (item.title.toLowerCase().startsWith(ql)) return 90;
  if (item.title.toLowerCase().includes(ql)) return 75;
  if (item.tags.some(t => t === ql)) return 80;
  if (item.tags.some(t => t.startsWith(ql))) return 65;
  if (item.sub.toLowerCase().includes(ql)) return 55;
  if (item.desc.toLowerCase().includes(ql)) return 40;
  if (item.tags.some(t => t.includes(ql))) return 35;
  return 0;
}

// ── Component ────────────────────────────────────────────────────────────────
export function GlobalSearch({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [active, setActive]     = useState(0);
  const [selected, setSelected] = useState<SearchItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length < 1 ? [] :
    INDEX.map(item => ({ item, s: scoreItem(item, query.trim()) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s)
      .slice(0, 8).map(x => x.item);

  const openModal = useCallback(() => {
    setOpen(true); setQuery(''); setActive(0); setSelected(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);
  const close = useCallback(() => { setOpen(false); setQuery(''); setSelected(null); }, []);
  const select = useCallback((item: SearchItem) => { setSelected(item); }, []);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open ? close() : openModal(); }
      if (e.key === 'Escape') { if (selected) setSelected(null); else close(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, selected, close, openModal]);

  // Arrow + Enter
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!open || selected || results.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (results[active]) select(results[active]); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, selected, results, active, select]);

  useEffect(() => { setActive(0); setSelected(null); }, [query]);

  const SUGGESTIONS = ['SEC+', 'Dev → Security', 'OSCP', 'Gratuito', 'Alemanha', 'SOC Analyst', 'Splunk'];

  return (
    <>
      {/* Trigger */}
      <button onClick={openModal} aria-label="Busca global" className="search-trigger"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(155,176,198,0.6)', fontSize: 12,
          fontFamily: '"JetBrains Mono", monospace', transition: 'all 150ms',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.08)'; el.style.color='#e6eef8'; el.style.borderColor='rgba(255,255,255,0.15)'; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.color='rgba(155,176,198,0.6)'; el.style.borderColor='rgba(255,255,255,0.09)'; }}
      >
        <Search size={13} />
        <span style={{ display: 'none' }} className="sm-inline">Buscar</span>
      </button>

      {/* Overlay */}
      {open && (
        <div onClick={close} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(6,4,18,0.82)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: 'clamp(60px,10vh,100px) 16px 16px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: selected ? 880 : 560,
            display: 'flex', gap: 12,
            transition: 'max-width 250ms cubic-bezier(0.4,0,0.2,1)',
          }}>

            {/* ── Search panel ── */}
            <div style={{
              flex: selected ? '0 0 340px' : '1',
              background: 'rgba(10,6,24,0.98)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              transition: 'flex 250ms ease',
            }}>
              {/* Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <Search size={15} style={{ color: 'rgba(139,92,246,0.5)', flexShrink: 0 }} />
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Certificações, recursos, cargos..."
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#e6eef8', fontFamily: '"Inter", sans-serif', caretColor: '#8b5cf6' }}
                />
                {query ? (
                  <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(155,176,198,0.35)', padding: 2 }}><X size={13} /></button>
                ) : (
                  <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(155,176,198,0.25)', padding: '2px 5px', background: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>ESC</kbd>
                )}
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: '6px 0', margin: 0, maxHeight: 380, overflowY: 'auto' }}>
                  {results.map((item, i) => {
                    const meta = TYPE_META[item.type];
                    const isActive = active === i;
                    const isSel = selected?.id === item.id;
                    return (
                      <li key={item.id}>
                        <button onClick={() => select(item)} onMouseEnter={() => setActive(i)}
                          style={{
                            width: '100%', padding: '9px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: isSel ? `${meta.color}20` : isActive ? 'rgba(255,255,255,0.04)' : 'none',
                            border: 'none', cursor: 'pointer', textAlign: 'left',
                            borderLeft: `2px solid ${isSel ? meta.color : isActive ? `${meta.color}60` : 'transparent'}`,
                            transition: 'background 80ms',
                          }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 13, color: isSel ? '#fff' : '#e6eef8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(155,176,198,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sub}</div>
                          </div>
                          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, color: meta.color, background: meta.bg, padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>{meta.label.toUpperCase()}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : query.trim().length > 0 ? (
                <div style={{ padding: '28px 16px', textAlign: 'center', color: 'rgba(155,176,198,0.4)', fontSize: 13 }}>
                  Nenhum resultado para <strong style={{ color: 'rgba(155,176,198,0.6)' }}>"{query}"</strong>
                </div>
              ) : (
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)', letterSpacing: '0.1em', marginBottom: 10 }}>SUGESTÕES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => setQuery(s)} style={{ padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(155,176,198,0.55)', fontFamily: '"Inter", sans-serif', transition: 'all 120ms' }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.background='rgba(139,92,246,0.1)'; el.style.color='#a78bfa'; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(255,255,255,0.04)'; el.style.color='rgba(155,176,198,0.55)'; }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer hints */}
              <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 14 }}>
                {[['↑↓','navegar'],['↵','detalhes'],['ESC','fechar']].map(([k,l]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'rgba(155,176,198,0.3)', padding: '1px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.07)' }}>{k}</kbd>
                    <span style={{ fontSize: 10, color: 'rgba(155,176,198,0.25)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Detail panel ── */}
            {selected && (() => {
              const meta = TYPE_META[selected.type];
              return (
                <div style={{
                  flex: 1, background: 'rgba(10,6,24,0.98)',
                  border: `1px solid ${meta.color}30`,
                  borderRadius: 14, overflow: 'hidden',
                  boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}15`,
                  display: 'flex', flexDirection: 'column',
                  animation: 'detail-in 200ms cubic-bezier(0.4,0,0.2,1)',
                }}>
                  {/* Top accent */}
                  <div style={{ height: 2, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}40, transparent)` }} />

                  <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{selected.icon}</span>
                        <div>
                          <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 18, color: '#f0eeff' }}>{selected.title}</div>
                          {selected.level && (
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: selected.levelColor, background: `${selected.levelColor}18`, border: `1px solid ${selected.levelColor}30`, padding: '2px 7px', borderRadius: 4 }}>{selected.level}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(155,176,198,0.3)', padding: 4 }}><X size={14} /></button>
                    </div>

                    {/* Provider + cost + hours */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                      {selected.provider && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.5)' }}>{selected.provider}</span>}
                      {selected.cost && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: meta.color }}>{selected.cost}</span>}
                      {selected.hours && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{selected.hours}</span>}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: 'rgba(200,195,225,0.75)', lineHeight: 1.65, marginBottom: 16 }}>{selected.desc}</p>

                    {/* Meta */}
                    {selected.meta && selected.meta.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {selected.meta.map(m => (
                          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(155,176,198,0.4)' }}>{m.label}</span>
                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: 'rgba(220,215,240,0.7)', textAlign: 'right' }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {selected.actions && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selected.actions.map(a => {
                          const isExt = a.href.startsWith('http');
                          const style_: React.CSSProperties = {
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                            textDecoration: 'none', fontSize: 13, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600,
                            transition: 'all 150ms',
                            ...(a.primary ? {
                              background: `linear-gradient(135deg, ${meta.color}25, ${meta.color}10)`,
                              border: `1px solid ${meta.color}40`, color: meta.color,
                            } : {
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(155,176,198,0.65)',
                            }),
                          };
                          return isExt ? (
                            <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" style={style_}>
                              {a.label} <ExternalLink size={12} style={{ opacity: 0.6 }} />
                            </a>
                          ) : (
                            <Link key={a.label} href={a.href} onClick={close} style={style_}>
                              {a.label} <ChevronRight size={13} style={{ opacity: 0.6 }} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes detail-in {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 640px) {
          /* Em mobile: painel de detalhe empilha abaixo, não ao lado */
          .search-trigger span.sm-inline { display: inline; }
        }
      `}</style>
    </>
  );
}
