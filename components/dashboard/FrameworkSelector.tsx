"use client";

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FrameworkOption {
  id: string;
  name: string;
  description: string;
  icon: any; // Utilisation de 'any' pour simplifier avec les icônes Lucide
  iconColor: string;
  badge?: 'alpha' | 'beta';
}

interface FrameworkSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FrameworkOption[];
  className?: string;
}

export function FrameworkSelector({ value, onValueChange, options, className }: FrameworkSelectorProps) {
  const selectedOption = options.find(opt => opt.name === value) || options[0];
  const Icon = selectedOption.icon;

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
        Framework
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
                    selectedOption.badge === 'beta'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  }`}>
                    {selectedOption.badge.toUpperCase()}
                  </span>
                )}
              </span>
            </div>
          </SelectValue>

          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
            {options.map((option) => {
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
                            option.badge === 'beta'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          }`}>
                            {option.badge.toUpperCase()}
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
