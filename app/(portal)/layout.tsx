import type { Metadata } from 'next';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'CYBER PORTAL — Threat Universe',
  description: 'Threat Intelligence & Learning Platform',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
