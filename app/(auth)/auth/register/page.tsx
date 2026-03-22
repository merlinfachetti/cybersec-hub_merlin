import { Suspense } from 'react';
import RegisterClient from './register-client';

export const metadata = {
  title: 'CYBERSEC HUB — Cadastre-se',
  description: 'Crie sua conta e inicie sua trilha em cybersecurity.',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: '#060610', height: '100vh' }} />}>
      <RegisterClient />
    </Suspense>
  );
}
