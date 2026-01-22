"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Crown, Zap } from 'lucide-react';
import { usePlan } from '../layout';

type PlanType = "starter" | "pro" | "business";

export default function WorkbenchPage() {
  const { activePlan } = usePlan();

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* HEADER PROFESSIONNEL - RESPONSIVE */}
      <header className="flex-shrink-0 z-30 bg-white/95 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Logo et titre principal */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/30 border border-green-200 dark:border-green-800`}>
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-sm sm:text-base leading-tight">Codeo AI</p>
                <p className="text-xs text-green-600 font-medium">Traitement intelligent</p>
              </div>
            </div>
          </div>

          {/* Desktop - Éléments centraux */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Statistiques de génération */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div className="hidden lg:block text-sm">
                <span className="font-medium text-green-700 dark:text-green-300">
                  21 lignes
                </span>
                <span className="text-green-600 dark:text-green-400 ml-1">
                  · 0.6 KB
                </span>
              </div>
            </div>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Mode {activePlan === "starter" ? "Standard" : activePlan === "pro" ? "Turbo" : "Enterprise"}
              </span>
            </div>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-slate-700">
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div className="w-5 h-0.5 bg-current mb-1"></div>
              <div className="w-5 h-0.5 bg-current mb-1"></div>
              <div className="w-5 h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
      </header>

      {/* TITRE DESCRIPTIF - STYLE TABLEAU DE BORD */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 bg-white border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                Workbench IA
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Transformez vos designs UI en code propre et optimisé avec notre moteur de vision V-AST. Upload une image et générez instantanément des composants React, Vue ou HTML.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-codeo-green/10 border border-codeo-green/20 rounded-lg">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-codeo-green">
                  V-AST Standard
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mode {activePlan === "starter" ? "Standard" : activePlan === "pro" ? "Turbo" : "Enterprise"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL SIMPLIFIÉ - MODE STANDARD UNIQUEMENT */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="text-center max-w-md px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="w-12 h-12 text-amber-500" />
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mode Standard</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">V-AST Basic Engine</p>
            </div>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Fonctionnalité de génération de code disponible dans les plans Pro et Business.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Upgrade pour débloquer</span>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" richColors closeButton />
    </div>
  );
}