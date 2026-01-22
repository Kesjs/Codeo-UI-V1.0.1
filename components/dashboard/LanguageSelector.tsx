"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileType, Code } from 'lucide-react';

// Icônes pour TypeScript et JavaScript
const TypeScriptIcon = ({ className = '' }) => (
  <FileType className={className} />
);

const JavaScriptIcon = ({ className = '' }) => (
  <Code className={className} />
);

type Language = 'typescript' | 'javascript';

const languageOptions = [
  {
    value: 'typescript' as const,
    label: 'TypeScript',
    description: 'TypeScript avec vérification de type',
    icon: TypeScriptIcon,
    color: '#3178C6'
  },
  {
    value: 'javascript' as const,
    label: 'JavaScript',
    description: 'JavaScript standard (ES6+)',
    icon: JavaScriptIcon,
    color: '#10B981' // Vert émeraude pour JavaScript
  }
];

interface LanguageSelectorProps {
  value: Language;
  onValueChange: (value: Language) => void;
  className?: string;
}

export function LanguageSelector({ value, onValueChange, className }: LanguageSelectorProps) {
  const selectedOption = languageOptions.find(opt => opt.value === value) || languageOptions[0];
  const Icon = selectedOption.icon;

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
        Langage
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
          <SelectValue asChild>
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${value === 'typescript' ? 'text-[#3178C6]' : 'text-[#F7DF1E]'}`} />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedOption.label}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
          {languageOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:bg-slate-50 dark:focus:bg-slate-700/50 transition-colors duration-150"
              >
                <div className="flex items-start gap-3 w-full">
                  <OptionIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${option.value === 'typescript' ? 'text-[#3178C6]' : 'text-[#F7DF1E]'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
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
      </Select>
    </div>
  );
}
