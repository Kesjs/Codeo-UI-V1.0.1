'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Type,
  Box,
  Layers,
  Code2,
  Copy,
  Check,
  Sparkles,
  Zap,
  Grid,
  Circle,
  Square,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const colorTokens = [
  { name: 'Codeo Green', value: 'hsl(123.8, 69.2%, 50.4%)', css: '--codeo-green', usage: 'Couleur principale du branding' },
  { name: 'Codeo Light BG', value: 'rgba(44, 255, 0, 0.04)', css: '--codeo-light-bg', usage: 'Fond léger pour éléments verts' },
  { name: 'Primary', value: 'hsl(var(--primary))', css: '--primary', usage: 'Couleur primaire du thème' },
  { name: 'Secondary', value: 'hsl(var(--secondary))', css: '--secondary', usage: 'Couleur secondaire' },
  { name: 'Accent', value: 'hsl(var(--accent))', css: '--accent', usage: 'Couleur d\'accentuation' },
]

const typographyScale = [
  { name: 'H1', size: '2.25rem', weight: 'font-black', lineHeight: '1.2', example: 'Heading 1' },
  { name: 'H2', size: '1.875rem', weight: 'font-bold', lineHeight: '1.3', example: 'Heading 2' },
  { name: 'H3', size: '1.5rem', weight: 'font-semibold', lineHeight: '1.4', example: 'Heading 3' },
  { name: 'Body', size: '1rem', weight: 'font-medium', lineHeight: '1.6', example: 'Body text avec une ligne de hauteur confortable pour la lisibilité' },
  { name: 'Small', size: '0.875rem', weight: 'font-normal', lineHeight: '1.5', example: 'Small text' },
  { name: 'Caption', size: '0.75rem', weight: 'font-normal', lineHeight: '1.4', example: 'Caption text' },
]

const spacingScale = [
  { name: 'xs', value: '0.25rem', pixels: '4px' },
  { name: 'sm', value: '0.5rem', pixels: '8px' },
  { name: 'md', value: '1rem', pixels: '16px' },
  { name: 'lg', value: '1.5rem', pixels: '24px' },
  { name: 'xl', value: '2rem', pixels: '32px' },
  { name: '2xl', value: '3rem', pixels: '48px' },
]

const borderRadiusScale = [
  { name: 'sm', value: 'calc(var(--radius) - 4px)', pixels: '~2px', usage: 'Éléments subtils' },
  { name: 'md', value: 'calc(var(--radius) - 2px)', pixels: '~4px', usage: 'Éléments secondaires' },
  { name: 'DEFAULT', value: 'var(--radius)', pixels: '4px', usage: 'Éléments standard' },
  { name: 'lg', value: 'var(--radius)', pixels: '4px', usage: 'Composants principaux' },
  { name: 'xl', value: '0.75rem', pixels: '12px', usage: 'Cartes et sections' },
  { name: '2xl', value: '2rem', pixels: '32px', usage: 'Cartes Dashboard/Workbench (Soft Premium)' },
  { name: 'full', value: '9999px', pixels: '∞', usage: 'Éléments ronds (avatars, badges)' },
]

export default function DesignSystemPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(tokenName)
    toast.success(`Token ${tokenName} copié !`)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-codeo-green/10 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-codeo-green" />
            </div>
            Design System
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Référence complète des tokens, composants et guidelines du design system Codeo UI
          </p>
        </div>
      </motion.div>

      {/* Couleurs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-codeo-green/10 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-codeo-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Couleurs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tokens de couleur du design system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="group relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-codeo-green/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{token.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{token.usage}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(token.css, token.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  {copiedToken === token.name ? (
                    <Check className="w-4 h-4 text-codeo-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
              <div
                className="w-full h-16 rounded-lg mb-2 border border-slate-200 dark:border-slate-700"
                style={{ backgroundColor: token.value.includes('hsl') ? token.value : token.value }}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Valeur:</span>
                  <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {token.value}
                  </code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">CSS:</span>
                  <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {token.css}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Typographie */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Type className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Typographie</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Échelle typographique et styles de texte</p>
          </div>
        </div>

        <div className="space-y-4">
          {typographyScale.map((scale) => (
            <div
              key={scale.name}
              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className={`${scale.size} ${scale.weight} text-slate-900 dark:text-white mb-2`} style={{ lineHeight: scale.lineHeight }}>
                    {scale.example}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-1 ml-4">
                  <div className="font-medium">{scale.name}</div>
                  <div>{scale.size}</div>
                  <div>{scale.weight}</div>
                  <div>line-height: {scale.lineHeight}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Espacements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Grid className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Espacements</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Système d'espacement cohérent</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {spacingScale.map((spacing) => (
            <div
              key={spacing.name}
              className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="text-center mb-3">
                <div className="w-full bg-codeo-green/20 rounded mb-2" style={{ height: spacing.value }} />
                <div className="font-semibold text-slate-900 dark:text-white text-sm">{spacing.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <div>{spacing.value}</div>
                  <div>{spacing.pixels}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Bordures & Arrondis */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Square className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bordures & Arrondis</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Système d'arrondis pour le look "Soft Premium"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {borderRadiusScale.map((radius) => (
            <div
              key={radius.name}
              className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="mb-3">
                <div
                  className="w-20 h-20 bg-codeo-green/20 border-2 border-codeo-green/50 mx-auto"
                  style={{ borderRadius: radius.value === 'var(--radius)' ? '4px' : radius.value === '9999px' ? '50%' : radius.value }}
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{radius.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div>{radius.value}</div>
                  <div>{radius.pixels}</div>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 italic">{radius.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Composants */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <Box className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Composants UI</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Bibliothèque de composants Shadcn UI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Button', icon: Zap, description: 'Boutons avec variantes (default, outline, ghost)' },
            { name: 'Card', icon: Layers, description: 'Cartes avec header, content, footer' },
            { name: 'Input', icon: Code2, description: 'Champs de saisie avec validation' },
            { name: 'Select', icon: Grid, description: 'Sélecteurs déroulants' },
            { name: 'Dropdown', icon: Circle, description: 'Menus déroulants contextuels' },
            { name: 'Tooltip', icon: Sparkles, description: 'Infobulles au survol' },
          ].map((component) => (
            <div
              key={component.name}
              className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-codeo-green/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-codeo-green/10 rounded-lg flex items-center justify-center">
                  <component.icon className="w-5 h-5 text-codeo-green" />
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">{component.name}</div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{component.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Guidelines */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-codeo-green/5 to-codeo-green/10 rounded-2xl border border-codeo-green/20 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-codeo-green" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Guidelines</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <Minus className="w-4 h-4 mt-1 text-codeo-green flex-shrink-0" />
            <p>Utiliser <code className="bg-white/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">rounded-2xl</code> (32px) pour les cartes Dashboard/Workbench</p>
          </div>
          <div className="flex items-start gap-2">
            <Minus className="w-4 h-4 mt-1 text-codeo-green flex-shrink-0" />
            <p>Utiliser <code className="bg-white/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">font-black</code> pour les titres H1/H2</p>
          </div>
          <div className="flex items-start gap-2">
            <Minus className="w-4 h-4 mt-1 text-codeo-green flex-shrink-0" />
            <p>Utiliser <code className="bg-white/50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">font-medium</code> pour le body text</p>
          </div>
          <div className="flex items-start gap-2">
            <Minus className="w-4 h-4 mt-1 text-codeo-green flex-shrink-0" />
            <p>Respecter les transitions spring (stiffness: 100, damping: 20) pour l'effet "Soft"</p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
