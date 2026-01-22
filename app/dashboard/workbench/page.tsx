"use client";

import React from 'react';
import { useState } from 'react';
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Crown, Zap, Upload, History, MessageSquare, Settings, ChevronRight, ChevronLeft,
  FileText, Image, Code as CodeIcon, Eye, Smartphone, Tablet, Monitor, Sparkles,
  Palette, Accessibility, Github, Play, Trash2, Atom, Layers, Zap as ZapIcon,
  Folder, RotateCcw
} from 'lucide-react';
import { LanguageSelector } from '@/components/dashboard/LanguageSelector';
import { FrameworkSelector, FrameworkOption } from '@/components/dashboard/FrameworkSelector';
import { StylingSelector, StylingOption } from '@/components/dashboard/StylingSelector';
import { usePlan } from '../layout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WorkbenchState = "empty" | "editing";

interface WorkbenchFile {
  id: string;
  name: string;
  type: "image" | "code";
  size: string;
  timestamp: Date;
}

interface VersionHistory {
  id: string;
  name: string;
  framework: string;
  styling: string;
  thumbnail: string;
  code: string;
  timestamp: Date;
  isActive?: boolean;
}

export default function WorkbenchPage() {
  const { activePlan } = usePlan();
  const [workbenchState, setWorkbenchState] = useState<WorkbenchState>("empty");
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<WorkbenchFile | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  // Build Settings
  const [selectedFramework, setSelectedFramework] = useState<string>("React");
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'javascript'>('typescript');
  const [selectedStyling, setSelectedStyling] = useState<string>("Tailwind CSS");
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);

  // Viewport selection
  const [selectedViewport, setSelectedViewport] = useState<string>("desktop");

  // Live Preview animation
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewAnimationStep, setPreviewAnimationStep] = useState<number>(0);

  // Toolbar state
  const [isEditingProjectName, setIsEditingProjectName] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("untitled");

  // Framework options with colored Lucide icons
  const frameworkOptions: FrameworkOption[] = [
    {
      id: 'react',
      name: 'React',
      description: 'Composants modulaires avec hooks modernes',
      icon: Atom,
      iconColor: '#61DAFB',
      badge: 'beta'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      description: 'Framework React avec SSR et optimisations',
      icon: ZapIcon,
      iconColor: "#000000"
    },
    {
      id: "vue",
      name: "Vue",
      description: "Framework progressif et adaptable",
      icon: Layers,
      iconColor: "#4FC08D"
    },
    {
      id: "svelte",
      name: "Svelte",
      description: "Framework compilé pour performances optimales",
      icon: Sparkles,
      iconColor: "#FF3E00",
      badge: "beta"
    }
  ];

  const stylingOptions: StylingOption[] = [
    {
      id: "tailwind",
      name: "Tailwind CSS",
      description: "Framework CSS utilitaire pour styling rapide",
      icon: Palette,
      iconColor: "#06B6D4",
      badge: 'popular'
    },
    {
      id: "css-modules",
      name: "CSS Modules",
      description: "CSS scoped avec modules JavaScript",
      icon: CodeIcon,
      iconColor: "#F97316",
      badge: 'new'
    }
  ];

  // Historique des fichiers (Component 7)
  const [fileHistory] = useState<WorkbenchFile[]>([
    {
      id: "1",
      name: "dashboard-design.png",
      type: "image",
      size: "2.4 MB",
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: "2",
      name: "login-form.fig",
      type: "image",
      size: "1.8 MB",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]);

  // Historique des versions
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([
    {
      id: "v12",
      name: "Generation #12",
      framework: "React",
      styling: "Tailwind CSS",
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=60&fit=crop&crop=center",
      code: `import React from 'react';

export default function Component() {
  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">
        Latest Generated Component
      </h2>
      <p className="text-slate-600">
        This is the most recent version.
      </p>
    </div>
  );
}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      isActive: true
    },
    {
      id: "v11",
      name: "Generation #11",
      framework: "Next.js",
      styling: "Tailwind CSS",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=60&fit=crop&crop=center",
      code: `import React from 'react';

export default function Component() {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-medium">
        Previous Version
      </h3>
    </div>
  );
}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: "v10",
      name: "Generation #10",
      framework: "Vue",
      styling: "CSS Modules",
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=60&fit=crop&crop=center",
      code: `<template>
  <div class="component">
    <h2>Vue Component</h2>
  </div>
</template>`,
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    }
  ]);

  // Fonction pour charger une version depuis l'historique
  const loadVersion = (version: VersionHistory) => {
    setVersionHistory(prev =>
      prev.map(v => ({ ...v, isActive: v.id === version.id }))
    );
    setGeneratedCode(version.code);
    toast.success(`Version ${version.name} chargée`);
  };

  // Fonction pour effacer tout l'historique
  const clearHistory = () => {
    setVersionHistory([]);
    toast.success("Historique effacé");
  };

  // Fonction pour formater la date relative
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  return (
    <div className="h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* LAYOUT GITHUB/VERCEL - 3 COLONNES */}
      <div className={`h-full grid transition-all duration-300 ${
        isRightSidebarCollapsed
          ? 'grid-cols-[280px_1fr_0px]'
          : 'grid-cols-[280px_1fr_320px]'
      }`}>
        {/* SIDEBAR GAUCHE (280px) - UPLOAD & HISTORIQUE */}
        <div className="bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">

          {/* Component 1: Upload Zone */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CodeIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Code</span>
              </div>

              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer"
                onClick={() => toast("Upload functionality coming soon")}
              >
                <Image className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Drop your design here</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG up to 10MB</p>
              </div>

              {uploadedFile && (
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {uploadedFile.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {uploadedFile.size} • {uploadedFile.timestamp.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Component 7: Historique */}
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Recent Files</span>
            </div>

            <div className="space-y-2">
              {fileHistory.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                    {file.type === "image" ? (
                      <Image className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <CodeIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {file.size} • {file.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Build Settings */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Build Settings</span>
            </div>

            <div className="space-y-3">
              {/* Framework Selector */}
              <FrameworkSelector
                value={selectedFramework}
                onValueChange={setSelectedFramework}
                options={frameworkOptions}
              />   
              {/* Language Selector */}
              <div className="mt-4">
                <LanguageSelector 
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                />
              </div>

              {/* Styling Selector */}
              <div className="mt-4">
                <StylingSelector 
                  value={selectedStyling}
                  onValueChange={setSelectedStyling}
                />
              </div>

              {/* Accessibility Mode */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Accessibility Mode
                  </span>
                </div>
                <button
                  onClick={() => setAccessibilityMode(!accessibilityMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-codeo-green focus:ring-offset-2 ${
                    accessibilityMode ? 'bg-codeo-green' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accessibilityMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE CENTRALE FLEXIBLE */}
        <div className="flex flex-col bg-white dark:bg-slate-900">

          {/* Component 2: Toolbar - GitHub/Vercel Style */}
          <TooltipProvider>
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between bg-white dark:bg-slate-900">
              {/* Navigation (Gauche) - Breadcrumb */}
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm">
                      <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-500 dark:text-slate-400">workbench</span>
                      <span className="text-slate-400 dark:text-slate-500">/</span>
                      {isEditingProjectName ? (
                        <input
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          onBlur={() => setIsEditingProjectName(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsEditingProjectName(false)}
                          className="bg-transparent border-none outline-none text-slate-900 dark:text-white font-medium px-1 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-slate-900 dark:text-white font-medium cursor-pointer hover:text-codeo-green transition-colors"
                          onClick={() => setIsEditingProjectName(true)}
                        >
                          {uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, "") : projectName}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Cliquez pour renommer le projet</p>
                  </TooltipContent>
                </Tooltip>

                {/* Séparateur */}
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Viewport Control (Centre) - Bouton unique avec dropdown */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg p-2 transition-colors flex items-center gap-2">
                          {selectedViewport === "mobile" && <Smartphone className="w-4 h-4" />}
                          {selectedViewport === "tablet" && <Tablet className="w-4 h-4" />}
                          {selectedViewport === "desktop" && <Monitor className="w-4 h-4" />}
                          <span className="text-xs font-medium capitalize">
                            {selectedViewport === "mobile" ? "Mobile" :
                             selectedViewport === "tablet" ? "Tablet" : "Desktop"}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Changer la vue ({selectedViewport})</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl">
                    <div className="p-2">
                      <button
                        onClick={() => setSelectedViewport("mobile")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          selectedViewport === "mobile"
                            ? 'bg-codeo-green/10 border border-codeo-green/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Mobile</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">375px</div>
                        </div>
                        {selectedViewport === "mobile" && (
                          <div className="ml-auto w-2 h-2 bg-codeo-green rounded-full"></div>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedViewport("tablet")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          selectedViewport === "tablet"
                            ? 'bg-codeo-green/10 border border-codeo-green/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <Tablet className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Tablet</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">768px</div>
                        </div>
                        {selectedViewport === "tablet" && (
                          <div className="ml-auto w-2 h-2 bg-codeo-green rounded-full"></div>
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedViewport("desktop")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          selectedViewport === "desktop"
                            ? 'bg-codeo-green/10 border border-codeo-green/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">Desktop</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">1440px</div>
                        </div>
                        {selectedViewport === "desktop" && (
                          <div className="ml-auto w-2 h-2 bg-codeo-green rounded-full"></div>
                        )}
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Séparateur */}
                <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Actions (Droite) */}
              <div className="flex items-center gap-3">
                {/* Historique */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors relative flex items-center justify-center"
                        >
                          <RotateCcw className="w-4 h-4" />
                          {versionHistory.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-codeo-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {versionHistory.length}
                            </span>
                          )}
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Historique des générations</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-80">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 mb-2">
                        Historique des générations
                      </div>
                      {versionHistory.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {versionHistory.map((version) => (
                            <button
                              key={version.id}
                              onClick={() => loadVersion(version)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                version.isActive
                                  ? 'bg-codeo-green/10 border border-codeo-green/20'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              <div className="w-10 h-8 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img 
                                  src={version.thumbnail} 
                                  alt={version.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                  {version.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {version.framework} • {version.styling}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500">
                                  {formatRelativeTime(version.timestamp)}
                                </div>
                              </div>
                              {version.isActive && (
                                <div className="w-2 h-2 bg-codeo-green rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Aucun historique disponible
                          </p>
                        </div>
                      )}
                      {versionHistory.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={clearHistory}
                            className="w-full flex items-center gap-2 p-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Effacer tout l'historique
                          </button>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* AI Chat */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                      className={`w-8 h-8 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                        isRightSidebarCollapsed
                          ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                          : 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{isRightSidebarCollapsed ? "Afficher l'IA" : "Masquer l'IA"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Export GitHub - Elite Mode */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => toast.success("Exporting to GitHub...")}
                      className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-5 h-5" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Exporter vers GitHub</p>
                  </TooltipContent>
                </Tooltip>

                {/* Start Editing */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setWorkbenchState(workbenchState === "empty" ? "editing" : "empty")}
                      className="h-10 px-4 bg-codeo-green hover:bg-codeo-green/90 text-white text-sm font-semibold rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {workbenchState === "empty" ? "Generate" : "Reset"}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{workbenchState === "empty" ? "Commencer l'édition" : "Réinitialiser"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>

          {/* Zone de contenu - Empty State OU SplitView */}
          <div className="flex-1 overflow-hidden">
            {workbenchState === "empty" ? (
              /* Component 8: Empty State */
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Ready to build
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Upload a design image to start generating clean, optimized code with our V-AST engine.
                  </p>
                  <button
                    onClick={() => setWorkbenchState("editing")}
                    className="px-6 py-3 bg-codeo-green text-white font-medium rounded-lg hover:bg-codeo-green/90 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            ) : (
              /* Component 5: SplitView - Éditeur + Preview */
              <div className="h-full flex">
                {/* Component 3: Éditeur */}
                <div className="flex-1 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <div className="h-full flex flex-col">
                    <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Component.tsx
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        42 lines
                      </span>
                    </div>
                    <div className="flex-1 bg-slate-900 p-4">
                      <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                        {`import React from 'react';

export default function Component() {
  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">
        Generated Component
      </h2>
      <p className="text-slate-600">
        This component was generated from your design.
      </p>
    </div>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Component 4: LivePreviewPanel */}
                <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col">
                  <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Live Preview
                    </span>
                    <button
                      onClick={() => {
                        setIsPreviewPlaying(!isPreviewPlaying);
                        if (!isPreviewPlaying) {
                          setPreviewAnimationStep(0);
                          // Animation sequence
                          setTimeout(() => setPreviewAnimationStep(1), 500);
                          setTimeout(() => setPreviewAnimationStep(2), 1000);
                          setTimeout(() => setPreviewAnimationStep(3), 1500);
                          setTimeout(() => {
                            setPreviewAnimationStep(0);
                            setIsPreviewPlaying(false);
                          }, 2500);
                        }
                      }}
                      className={`p-1.5 rounded border transition-colors ${
                        isPreviewPlaying
                          ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                          : 'bg-codeo-green/10 border-codeo-green/20 text-codeo-green hover:bg-codeo-green/20'
                      }`}
                      title={isPreviewPlaying ? "Stop Animation" : "Play Animation"}
                    >
                      <Play className={`w-3 h-3 ${isPreviewPlaying ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className={`
                      transition-all duration-500 ease-in-out
                      ${selectedViewport === 'mobile' ? 'max-w-sm scale-90' : ''}
                      ${selectedViewport === 'tablet' ? 'max-w-md scale-95' : ''}
                      ${selectedViewport === 'desktop' ? 'max-w-lg scale-100' : ''}
                    `}>
                      <motion.div
                        className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg"
                        animate={{
                          scale: isPreviewPlaying && previewAnimationStep === 1 ? 1.05 : 1,
                          rotate: isPreviewPlaying && previewAnimationStep === 2 ? 2 : 0,
                          y: isPreviewPlaying && previewAnimationStep === 3 ? -10 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Animated Header */}
                        <motion.h2
                          className="text-xl font-bold mb-4 text-slate-900 dark:text-white"
                          animate={{
                            color: isPreviewPlaying && previewAnimationStep === 1 ? '#22c55e' : undefined
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {isPreviewPlaying && previewAnimationStep >= 1 ? '✨ Component Animé' : 'Generated Component'}
                        </motion.h2>

                        {/* Animated Content */}
                        <motion.div
                          className="space-y-3"
                          animate={{
                            opacity: isPreviewPlaying && previewAnimationStep >= 2 ? 1 : 0.7
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                            animate={{
                              x: isPreviewPlaying && previewAnimationStep === 3 ? 10 : 0,
                              backgroundColor: isPreviewPlaying && previewAnimationStep === 3 ? '#dcfce7' : undefined
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="w-8 h-8 bg-codeo-green rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {isPreviewPlaying && previewAnimationStep >= 2 ? '✓' : '1'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-900 dark:text-white">
                                {isPreviewPlaying && previewAnimationStep >= 2 ? 'Composant optimisé' : 'Loading component...'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {selectedFramework} + {selectedStyling}
                              </p>
                            </div>
                          </motion.div>

                          {isPreviewPlaying && previewAnimationStep >= 3 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                            >
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">✓</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-green-800 dark:text-green-200">
                                  Animation terminée !
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  Composant prêt pour {selectedViewport}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Viewport Info */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Viewport: {selectedViewport}</span>
                            <span>Framework: {selectedFramework}</span>
                          </div>
                          {accessibilityMode && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                              <Accessibility className="w-3 h-3" />
                              <span>Accessibility Mode Enabled</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>      

        {/* SIDEBAR DROITE (320px) - IA CHAT & OPTIONS */}
        <div className={`bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ${
          isRightSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-80'
        }`}>

          {/* Component 6: IA Chat */}
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">AI Assistant</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  "Hello! I'm your AI assistant. How can I help you with your design?"
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 block">
                  2 minutes ago
                </span>
              </div>

              <div className="bg-codeo-green/10 rounded-lg p-3 border border-codeo-green/20">
                <p className="text-sm text-codeo-green">
                  "Can you help me optimize this component for better performance?"
                </p>
                <span className="text-xs text-codeo-green/70 mt-2 block">
                  Just now
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Quick Actions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toast("Optimizing component...")}
                  className="px-3 py-1.5 bg-codeo-green/10 hover:bg-codeo-green/20 border border-codeo-green/20 hover:border-codeo-green/30 rounded-full text-xs font-medium text-codeo-green transition-colors"
                >
                  Optimize
                </button>
                <button
                  onClick={() => toast("Refactoring code...")}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 transition-colors"
                >
                  Refactor
                </button>
                <button
                  onClick={() => toast("Adding dark mode...")}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Add Dark Mode
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <input
                type="text"
                placeholder="Ask the AI assistant..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-codeo-green/50 focus:border-codeo-green"
              />
            </div>
          </div>

          {/* Options avancées */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Advanced Options</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Auto-save</span>
                <div className="w-8 h-4 bg-codeo-green rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Dark mode</span>
                <div className="w-8 h-4 bg-slate-300 dark:bg-codeo-green rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 dark:right-0.5 dark:left-auto"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Minimap</span>
                <div className="w-8 h-4 bg-codeo-green rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}