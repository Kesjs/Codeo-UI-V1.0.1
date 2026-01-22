"use client";

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Brush, PaintBucket, PenTool, Type, Layers, Zap } from 'lucide-react';

export interface StylingOption {
  id: string;
  name: string;
  description: string;
  icon: any; // Utilisation de 'any' pour simplifier avec les icônes Lucide
  iconColor: string;
  badge?: 'new' | 'popular';
}

interface StylingSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const stylingOptions: StylingOption[] = [
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Framework CSS utilitaire pour un développement rapide et personnalisable',
    icon: Palette,
    iconColor: '#38BDF8',
    badge: 'popular'
  },
  {
    id: 'css',
    name: 'CSS Modules',
    description: 'Styles CSS scopés aux composants',
    icon: Brush,
    iconColor: '#2563EB'
  },
  {
    id: 'sass',
    name: 'Sass/SCSS',
    description: 'Préprocesseur CSS avec des fonctionnalités avancées',
    icon: PaintBucket,
    iconColor: '#CC6699'
  },
  {
    id: 'styled',
    name: 'Styled Components',
    description: 'CSS-in-JS avec support de thming',
    icon: PenTool,
    iconColor: '#DB7093',
    badge: 'new'
  },
  {
    id: 'emotion',
    name: 'Emotion',
    description: 'CSS-in-JS performant et flexible',
    icon: Type,
    iconColor: '#D97706'
  },
  {
    id: 'vanilla',
    name: 'Vanilla Extract',
    description: 'CSS de type 1er type avec typage fort',
    icon: Layers,
    iconColor: '#7C3AED'
  },
  {
    id: 'unocss',
    name: 'UnoCSS',
    description: 'Framework CSS utilitaire atomique à la demande',
    icon: Zap,
    iconColor: '#4F46E5',
    badge: 'new'
  }
];

export function StylingSelector({ value, onValueChange, className }: StylingSelectorProps) {
  const selectedOption = stylingOptions.find(opt => opt.name === value) || stylingOptions[0];
  const Icon = selectedOption.icon;

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
        Styling
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
          <SelectValue asChild>
            <div className="flex items-center gap-3">
              <Icon 
                className="w-5 h-5 flex-shrink-0"
                style={{ color: selectedOption.iconColor }}
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedOption.name}
                {selectedOption.badge && (
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedOption.badge === 'popular'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  }`}>
                    {selectedOption.badge === 'popular' ? 'POPULAIRE' : 'NOUVEAU'}
                  </span>
                )}
              </span>
            </div>
          </SelectValue>

          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-[300px] overflow-y-auto">
            {stylingOptions.map((option) => {
              const OptionIcon = option.icon;
              return (
                <SelectItem
                  key={option.id}
                  value={option.name}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:bg-slate-50 dark:focus:bg-slate-700/50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-3 w-full">
                    <OptionIcon
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: option.iconColor }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {option.name}
                        </span>
                        {option.badge && (
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                            option.badge === 'popular'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          }`}>
                            {option.badge === 'popular' ? 'POPULAIRE' : 'NOUVEAU'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  );
}

export default StylingSelector;
