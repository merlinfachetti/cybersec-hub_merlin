// Mock de autenticação para MVP
// Em produção, substituir por NextAuth.js, Clerk ou similar

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  targetRole?: string;
  budget?: number;
  studyHoursPerWeek?: number;
  location?: string;
}

// Usuário mock para desenvolvimento
const MOCK_USER: User = {
  id: 'user_merlin_123',
  name: 'Merlin',
  email: 'merlin@example.com',
  role: 'Full-Stack Developer',
  targetRole: 'Security Engineer',
  budget: 5000,
  studyHoursPerWeek: 15,
  location: 'Europe',
};

export function getCurrentUser(): User {
  // Em produção, isso viria de uma sessão real
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return MOCK_USER;
}

export function updateUserProfile(updates: Partial<User>): User {
  const current = getCurrentUser();
  const updated = { ...current, ...updates };

  if (typeof window !== 'undefined') {
    localStorage.setItem('user_profile', JSON.stringify(updated));
  }

  return updated;
}

export function isAuthenticated(): boolean {
  // Sempre true no mock
  return true;
}
