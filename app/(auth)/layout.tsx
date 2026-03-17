import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'CYBER PORTAL — Identify',
  description: 'Secure authentication portal',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
