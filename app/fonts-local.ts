// Self-hosted fonts configuration - Plus fiable et rapide que Google Fonts
// Évite tous les problèmes de fetch réseau pendant build/dev

export const inter = {
  variable: '--font-inter',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontWeight: '400 700',
  fontStyle: 'normal',
  fontDisplay: 'swap',
};

export const jetbrainsMono = {
  variable: '--font-jetbrains-mono', 
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontWeight: '400 700',
  fontStyle: 'normal',
  fontDisplay: 'swap',
};

// Alternative : Si tu veux garder next/font/google mais avec fallback robustes
/*
import { Inter, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['system-ui', 'sans-serif'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
  fallback: ['ui-monospace', 'monospace'],
});
*/
