// Funções de formatação

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  const locale =
    currency === 'BRL' ? 'pt-BR' : currency === 'EUR' ? 'de-DE' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLevel(level: string): string {
  const levels: Record<string, string> = {
    ENTRY: 'Entry',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
  };
  return levels[level] || level;
}

export function formatCategory(category: string): string {
  const categories: Record<string, string> = {
    OFFENSIVE_SECURITY: 'Offensive Security',
    DEFENSIVE_SECURITY: 'Defensive Security',
    GOVERNANCE_RISK: 'Governance & Risk',
    CLOUD_SECURITY: 'Cloud Security',
    APPLICATION_SECURITY: 'Application Security',
    NETWORK_SECURITY: 'Network Security',
    FORENSICS: 'Forensics',
    INCIDENT_RESPONSE: 'Incident Response',
    SECURITY_ENGINEERING: 'Security Engineering',
    THREAT_INTELLIGENCE: 'Threat Intelligence',
  };
  return categories[category] || category;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    ENTRY: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    INTERMEDIATE:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ADVANCED:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    EXPERT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    OFFENSIVE_SECURITY: '🎯',
    DEFENSIVE_SECURITY: '🛡️',
    GOVERNANCE_RISK: '⚖️',
    CLOUD_SECURITY: '☁️',
    APPLICATION_SECURITY: '💻',
    NETWORK_SECURITY: '🌐',
    FORENSICS: '🔍',
    INCIDENT_RESPONSE: '🚨',
    SECURITY_ENGINEERING: '⚙️',
    THREAT_INTELLIGENCE: '🧠',
  };
  return icons[category] || '🔐';
}
