'use client';

/**
 * lib/i18n/index.tsx
 * Lightweight i18n — no external deps, no file-system routing.
 * Default: English (EN). Optional: Portuguese BR (PT_BR).
 *
 * Usage:
 *   const { t, locale, setLocale } = useI18n();
 *   t('nav.certifications')   → 'Certifications' | 'Certificações'
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export type Locale = 'EN' | 'PT_BR';

const STORAGE_KEY = 'cp_locale';
const DEFAULT_LOCALE: Locale = 'EN';

// ── Translation map ────────────────────────────────────────────────────────

export const translations = {
  EN: {
    // ── Navigation ──
    'nav.home':             'Home',
    'nav.certifications':   'Certifications',
    'nav.roadmap':          'Roadmap',
    'nav.resources':        'Resources',
    'nav.market':           'Market',
    'nav.teams':            'Teams',
    'nav.profile':          'Profile',
    'nav.docs':             'API Docs',
    'nav.threatUniverse':   'Threat Universe',
    'nav.logout':           'Sign out',
    'nav.admin':            'Admin',

    // ── Footer ──
    'footer.careers':       'Careers',
    'footer.portal':        'Portal',
    'footer.docs':          'Docs',
    'footer.copyright':     '© {year} CYBERSEC HUB · signal > noise',
    'footer.tagline':       'Built for security practitioners — not just certification collectors.',
    'footer.certifications':'Certifications',
    'footer.roadmap':       'Roadmap',
    'footer.resources':     'Resources',
    'footer.market':        'Market',
    'footer.home':          'Home',
    'footer.profile':       'Profile',
    'footer.apiRef':        'API Reference',

    // ── Auth — Login ──
    'auth.identify':            'IDENTIFY',
    'auth.identifier':          'Identifier',
    'auth.passphrase':          'Min 12 chars · upper · lower · symbol',
    'auth.rememberDevice':      'Remember this device',
    'auth.rememberDeviceHint':  '· Only on trusted devices',
    'auth.authenticate':        'AUTHENTICATE',
    'auth.authenticating':      'AUTHENTICATING...',
    'auth.usePasskey':          'Use passkey',
    'auth.forgotPassphrase':    'Forgot passphrase?',
    'auth.newHere':             'New here?',
    'auth.register':            'Create account →',
    'auth.channelReady':        'Secure channel ready',
    'auth.error.credentials':   'Could not verify credentials.',
    'auth.error.rateLimit':     'Too many attempts. Try again later.',
    'auth.error.session':       'Session could not be established. Try again.',
    'auth.error.connection':    'Connection error. Try again.',
    // strength labels
    'auth.strength.weak':       'weak',
    'auth.strength.fair':       'fair',
    'auth.strength.good':       'good',
    'auth.strength.strong':     'strong',
    'auth.strength.chars':      '12+ chars',
    'auth.strength.upper':      'Uppercase',
    'auth.strength.number':     'Number',
    'auth.strength.symbol':     'Symbol',
    // handshake steps
    'auth.hs.init':             'Initiating secure channel...',
    'auth.hs.negotiate':        'Negotiating cipher suite...',
    'auth.hs.verify':           'Verifying credentials...',
    'auth.hs.established':      'Session established ✓',

    // ── Auth — Register ──
    'register.title':           'CREATE ACCOUNT',
    'register.name':            'Display name',
    'register.email':           'Email address',
    'register.passphrase':      'Passphrase',
    'register.confirm':         'Confirm passphrase',
    'register.submit':          'CREATE ACCOUNT',
    'register.submitting':      'CREATING...',
    'register.haveAccount':     'Already have an account?',
    'register.signIn':          'Sign in →',

    // ── Teams badges (login bottom) ──
    'team.red.label':           'RED TEAM',
    'team.red.desc':            'Adversarial heuristics active',
    'team.blue.label':          'BLUE TEAM',
    'team.blue.desc':           'Defensive session checks enabled',
    'team.purple.label':        'PURPLE TEAM',
    'team.purple.desc':         'Telemetry & improvement logging',

    // ── Teams page ──
    'teams.title':              'Teams',
    'teams.subtitle':           'Red · Blue · Purple',
    'teams.red.tagline':        'Think like the attacker.',
    'teams.blue.tagline':       'Detect. Contain. Respond.',
    'teams.purple.tagline':     'Close the loop.',
    'teams.does':               'Does',
    'teams.doesNot':            "Doesn't do",
    'teams.certifications':     'Certifications',
    'teams.skills':             'Core skills',
    'teams.viewRoadmap':        'View roadmap',

    // ── Threat Universe ──
    'tu.title':                 'Threat Universe',
    'tu.today':                 'Today:',
    'tu.study':                 'Study',
    'tu.lab':                   '1 Lab',
    'tu.risk':                  'Risk:',
    'tu.low':                   'Low',
    'tu.search':                'Search universe...',
    'tu.youAreHere':            'YOU ARE HERE',
    'tu.attack':                'ATTACK',
    'tu.attackSub':             'RED TEAM',
    'tu.defend':                'DEFEND',
    'tu.defendSub':             'BLUE TEAM',
    'tu.improve':               'IMPROVE',
    'tu.improveSub':            'PURPLE TEAM',
    'tu.noResult':              'No nodes match your search.',
    'tu.selectNode':            'Select a node to explore',
    'tu.selectNodeSub':         'Click any item in the universe to load its context here.',
    'tu.severity':              'Severity',
    'tu.confidence':            'Confidence',
    'tu.action1':               'Start Lab',
    'tu.action2':               'Read Report',
    'tu.action3':               'Add Notes',

    // ── Home / Hub ──
    'home.welcome':             'Welcome back',
    'home.portal':              'Threat Universe',
    'home.portal.sub':          'Galactic Portal',
    'home.portal.desc':         'Navigate the threat universe, labs and missions in Red/Blue/Purple mode.',
    'home.certs':               'Certifications',
    'home.certs.desc':          'Browse cybersecurity certifications: SEC+, CEH, CISSP, OSCP and more.',
    'home.roadmap':             'Roadmap',
    'home.roadmap.desc':        'Career plan from your current profile to Security Engineer.',
    'home.resources':           'Resources',
    'home.resources.desc':      'Curated study materials, labs, guides and tools.',
    'home.market':              'Market',
    'home.market.desc':         'Salary data, demand by role and region, certifications that pay off.',
    'home.teams':               'Teams',
    'home.teams.desc':          'Understand Red, Blue and Purple team roles in depth.',

    // ── Signal Lost (mobile gate) ──
    'signal.status':            'SIGNAL LOST',
    'signal.subtext':           'full-spectrum viewport required',
    'signal.riddle':            'the patient sigil wakes the silent eye',

    // ── Profile ──
    'profile.title':            'Profile',
    'profile.goal':             'Career goal',
    'profile.experience':       'Experience level',
    'profile.save':             'Save changes',
    'profile.saving':           'Saving...',

    // ── Certifications ──
    'certs.title':              'Certifications',
    'certs.search':             'Search certifications...',
    'certs.filter.all':         'All',
    'certs.filter.level':       'Level',
    'certs.filter.category':    'Category',
    'certs.learnMore':          'Learn more',
    'certs.compare':            'Compare',

    // ── Roadmap ──
    'roadmap.title':            'Career Roadmap',
    'roadmap.select':           'Select a path',

    // ── Resources ──
    'resources.title':          'Resources',
    'resources.search':         'Search resources...',
    'resources.bestFor':        'Best for',
    'resources.caution':        'Watch out',
    'resources.free':           'Free',
    'resources.paid':           'Paid',

    // ── Market ──
    'market.title':             'Market Intelligence',

    // ── Docs ──
    'docs.title':               'API Reference',

    // ── Error page ──
    'error.title':              'Something went wrong',
    'error.retry':              'Try again',
    'error.home':               'Back to Home',

    // ── Generic ──
    'generic.loading':          'Loading...',
    'generic.close':            'Close',
    'generic.cancel':           'Cancel',
    'generic.confirm':          'Confirm',
    'generic.back':             'Back',
    'generic.next':             'Next',
    'generic.save':             'Save',
    'generic.edit':             'Edit',
    'generic.delete':           'Delete',
    'generic.search':           'Search',
    'generic.filter':           'Filter',
    'generic.clear':            'Clear',
    'generic.submit':           'Submit',
    'generic.or':               'or',
  },

  PT_BR: {
    // ── Navigation ──
    'nav.home':             'Início',
    'nav.certifications':   'Certificações',
    'nav.roadmap':          'Roadmap',
    'nav.resources':        'Recursos',
    'nav.market':           'Mercado',
    'nav.teams':            'Times',
    'nav.profile':          'Perfil',
    'nav.docs':             'Docs da API',
    'nav.threatUniverse':   'Universo de Ameaças',
    'nav.logout':           'Sair',
    'nav.admin':            'Admin',

    // ── Footer ──
    'footer.careers':       'Carreiras',
    'footer.portal':        'Portal',
    'footer.docs':          'Docs',
    'footer.copyright':     '© {year} CYBERSEC HUB · signal > noise',
    'footer.tagline':       'Feito para profissionais de segurança — não só para colecionadores de certificações.',
    'footer.certifications':'Certificações',
    'footer.roadmap':       'Roadmap',
    'footer.resources':     'Recursos',
    'footer.market':        'Mercado',
    'footer.home':          'Início',
    'footer.profile':       'Perfil',
    'footer.apiRef':        'API Reference',

    // ── Auth — Login ──
    'auth.identify':            'IDENTIFICAR',
    'auth.identifier':          'Identificador',
    'auth.passphrase':          'Mín. 12 chars · maiúscula · minúscula · símbolo',
    'auth.rememberDevice':      'Lembrar este dispositivo',
    'auth.rememberDeviceHint':  '· Somente em dispositivos confiáveis',
    'auth.authenticate':        'AUTENTICAR',
    'auth.authenticating':      'AUTENTICANDO...',
    'auth.usePasskey':          'Usar passkey',
    'auth.forgotPassphrase':    'Esqueceu a senha?',
    'auth.newHere':             'Novo aqui?',
    'auth.register':            'Cadastre-se →',
    'auth.channelReady':        'Canal seguro pronto',
    'auth.error.credentials':   'Não foi possível verificar as credenciais.',
    'auth.error.rateLimit':     'Muitas tentativas. Tente novamente mais tarde.',
    'auth.error.session':       'Sessão não pôde ser estabelecida. Tente novamente.',
    'auth.error.connection':    'Erro de conexão. Tente novamente.',
    // strength labels
    'auth.strength.weak':       'fraca',
    'auth.strength.fair':       'regular',
    'auth.strength.good':       'boa',
    'auth.strength.strong':     'forte',
    'auth.strength.chars':      '12+ chars',
    'auth.strength.upper':      'Maiúscula',
    'auth.strength.number':     'Número',
    'auth.strength.symbol':     'Símbolo',
    // handshake steps
    'auth.hs.init':             'Iniciando canal seguro...',
    'auth.hs.negotiate':        'Negociando conjunto de cifras...',
    'auth.hs.verify':           'Verificando credenciais...',
    'auth.hs.established':      'Sessão estabelecida ✓',

    // ── Auth — Register ──
    'register.title':           'CRIAR CONTA',
    'register.name':            'Nome de exibição',
    'register.email':           'Endereço de e-mail',
    'register.passphrase':      'Senha',
    'register.confirm':         'Confirmar senha',
    'register.submit':          'CRIAR CONTA',
    'register.submitting':      'CRIANDO...',
    'register.haveAccount':     'Já tem uma conta?',
    'register.signIn':          'Entrar →',

    // ── Teams badges (login bottom) ──
    'team.red.label':           'RED TEAM',
    'team.red.desc':            'Heurísticas adversariais ativas',
    'team.blue.label':          'BLUE TEAM',
    'team.blue.desc':           'Verificações defensivas de sessão ativas',
    'team.purple.label':        'PURPLE TEAM',
    'team.purple.desc':         'Telemetria e registro de melhoria',

    // ── Teams page ──
    'teams.title':              'Times',
    'teams.subtitle':           'Red · Blue · Purple',
    'teams.red.tagline':        'Pense como o atacante.',
    'teams.blue.tagline':       'Detectar. Conter. Responder.',
    'teams.purple.tagline':     'Feche o ciclo.',
    'teams.does':               'Faz',
    'teams.doesNot':            'Não faz',
    'teams.certifications':     'Certificações',
    'teams.skills':             'Habilidades principais',
    'teams.viewRoadmap':        'Ver roadmap',

    // ── Threat Universe ──
    'tu.title':                 'Universo de Ameaças',
    'tu.today':                 'Hoje:',
    'tu.study':                 'Estudo',
    'tu.lab':                   '1 Lab',
    'tu.risk':                  'Risco:',
    'tu.low':                   'Baixo',
    'tu.search':                'Buscar no universo...',
    'tu.youAreHere':            'VOCÊ ESTÁ AQUI',
    'tu.attack':                'ATACAR',
    'tu.attackSub':             'RED TEAM',
    'tu.defend':                'DEFENDER',
    'tu.defendSub':             'BLUE TEAM',
    'tu.improve':               'MELHORAR',
    'tu.improveSub':            'PURPLE TEAM',
    'tu.noResult':              'Nenhum nó encontrado.',
    'tu.selectNode':            'Selecione um nó para explorar',
    'tu.selectNodeSub':         'Clique em qualquer item do universo para carregar o contexto aqui.',
    'tu.severity':              'Severidade',
    'tu.confidence':            'Confiança',
    'tu.action1':               'Iniciar Lab',
    'tu.action2':               'Ler Relatório',
    'tu.action3':               'Adicionar Notas',

    // ── Home / Hub ──
    'home.welcome':             'Bem-vindo de volta',
    'home.portal':              'Universo de Ameaças',
    'home.portal.sub':          'Portal Galático',
    'home.portal.desc':         'Navegue no universo de ameaças, labs e missões no modo Red/Blue/Purple.',
    'home.certs':               'Certificações',
    'home.certs.desc':          'Explore certificações de cibersegurança: SEC+, CEH, CISSP, OSCP e muito mais.',
    'home.roadmap':             'Roadmap',
    'home.roadmap.desc':        'Plano de carreira do seu perfil atual até Security Engineer.',
    'home.resources':           'Recursos',
    'home.resources.desc':      'Materiais de estudo, labs, guias e ferramentas curados.',
    'home.market':              'Mercado',
    'home.market.desc':         'Dados salariais, demanda por função e região, certificações que valem a pena.',
    'home.teams':               'Times',
    'home.teams.desc':          'Entenda em profundidade os papéis dos times Red, Blue e Purple.',

    // ── Signal Lost (mobile gate) ──
    'signal.status':            'SINAL PERDIDO',
    'signal.subtext':           'viewport de espectro completo necessária',
    'signal.riddle':            'o sigilo paciente desperta o olho silencioso',

    // ── Profile ──
    'profile.title':            'Perfil',
    'profile.goal':             'Objetivo de carreira',
    'profile.experience':       'Nível de experiência',
    'profile.save':             'Salvar alterações',
    'profile.saving':           'Salvando...',

    // ── Certifications ──
    'certs.title':              'Certificações',
    'certs.search':             'Buscar certificações...',
    'certs.filter.all':         'Todas',
    'certs.filter.level':       'Nível',
    'certs.filter.category':    'Categoria',
    'certs.learnMore':          'Saiba mais',
    'certs.compare':            'Comparar',

    // ── Roadmap ──
    'roadmap.title':            'Roadmap de Carreira',
    'roadmap.select':           'Selecione um caminho',

    // ── Resources ──
    'resources.title':          'Recursos',
    'resources.search':         'Buscar recursos...',
    'resources.bestFor':        'Ideal para',
    'resources.caution':        'Atenção',
    'resources.free':           'Gratuito',
    'resources.paid':           'Pago',

    // ── Market ──
    'market.title':             'Inteligência de Mercado',

    // ── Docs ──
    'docs.title':               'API Reference',

    // ── Error page ──
    'error.title':              'Algo deu errado',
    'error.retry':              'Tentar novamente',
    'error.home':               'Voltar ao início',

    // ── Generic ──
    'generic.loading':          'Carregando...',
    'generic.close':            'Fechar',
    'generic.cancel':           'Cancelar',
    'generic.confirm':          'Confirmar',
    'generic.back':             'Voltar',
    'generic.next':             'Próximo',
    'generic.save':             'Salvar',
    'generic.edit':             'Editar',
    'generic.delete':           'Excluir',
    'generic.search':           'Buscar',
    'generic.filter':           'Filtrar',
    'generic.clear':            'Limpar',
    'generic.submit':           'Enviar',
    'generic.or':               'ou',
  },
} as const;

export type TranslationKey = keyof typeof translations['EN'];

// ── Context ────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === 'EN' || stored === 'PT_BR') {
        setLocaleState(stored);
      }
    } catch {
      // localStorage not available (SSR/incognito edge case)
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // noop
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const dict = translations[locale] as Record<string, string>;
      let str = dict[key] ?? (translations['EN'] as Record<string, string>)[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
