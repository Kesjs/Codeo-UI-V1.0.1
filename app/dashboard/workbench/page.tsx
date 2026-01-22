"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Crown, Zap, Upload, History, MessageSquare, Settings, ChevronRight, ChevronLeft, FileText, Image, Code, Eye } from 'lucide-react';
import { usePlan } from '../layout';

type PlanType = "starter" | "pro" | "business";

type WorkbenchState = "empty" | "editing";

interface WorkbenchFile {
  id: string;
  name: string;
  type: "image" | "code";
  size: string;
  timestamp: Date;
}

export default function WorkbenchPage() {
  const { activePlan } = usePlan();
  const [workbenchState, setWorkbenchState] = useState<WorkbenchState>("empty");
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<WorkbenchFile | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");

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
                <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Upload Design</span>
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
                      <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
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
        </div>

        {/* ZONE CENTRALE FLEXIBLE */}
        <div className="flex flex-col bg-white dark:bg-slate-900">

          {/* Component 2: Toolbar */}
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4">
              {/* Breadcrumb style GitHub */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 dark:text-slate-400">workbench</span>
                <span className="text-slate-400 dark:text-slate-500">/</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, "") : "untitled"}
                </span>
              </div>

              {/* Status indicator */}
              {workbenchState === "editing" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Ready</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View toggles */}
              {workbenchState === "editing" && (
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                  <button className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-l-lg">
                    <Code className="w-4 h-4 inline mr-2" />
                    Code
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-r-lg">
                    <Eye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                </div>
              )}

              {/* Toggle sidebar droite - Assistant IA */}
              <button
                onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  isRightSidebarCollapsed
                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                    : 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                }`}
                title={isRightSidebarCollapsed ? "Show AI Assistant" : "Hide AI Assistant"}
              >
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {isRightSidebarCollapsed ? (
                    <ChevronLeft className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </div>
              </button>

              {/* Actions */}
              <button
                onClick={() => setWorkbenchState(workbenchState === "empty" ? "editing" : "empty")}
                className="px-4 py-2 bg-codeo-green text-white text-sm font-medium rounded-lg hover:bg-codeo-green/90 transition-colors"
              >
                {workbenchState === "empty" ? "Start Editing" : "Reset"}
              </button>
            </div>
          </div>

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
                    Start Building
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

                {/* Component 4: Preview */}
                <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col">
                  <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Preview
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="p-6 bg-white rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                        Generated Component
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        This component was generated from your design.
                      </p>
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

      <Toaster position="bottom-center" richColors closeButton />
    </div>
  );
}