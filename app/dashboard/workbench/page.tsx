"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Sparkles, Upload, Download, Copy, Cpu, Activity, ChevronRight, 
  CheckCircle, X, Loader2, GitBranch, Lock, Crown, Zap, Code2, 
  Atom, Globe, Triangle, Palette, Eye, FileJson, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlan } from '../layout';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-slate-500" />
        <p className="text-sm text-slate-500">Chargement de l'éditeur...</p>
      </div>
    </div>
  ),
});

type PlanType = "starter" | "pro" | "business";
type FrameworkType = "react" | "nextjs" | "vue" | "html" | "tailwind";
type StyleEngine = "tailwind" | "css-modules" | "styled-components";

interface WorkbenchConfig {
  framework: FrameworkType;
  styleEngine: StyleEngine;
  enableAnimations: boolean;
  enableAccessibility: boolean;
  enableSecurity: boolean;
  enableDesignSystem: boolean;
  darkMode: boolean;
  mobile: boolean;
  useTypeScript: boolean;
  componentName: string;
}

interface GenerationLog {
  id: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
}

const planConfigs = {
  starter: {
    name: "Codeo Starter",
    engine: "V-AST Standard",
    status: "Traitement intelligent",
    statusColor: "text-green-600",
    frameworks: ["react", "html"] as FrameworkType[],
    styleEngines: ["tailwind"] as StyleEngine[],
    logs: ["🧠 Analyse...", "🎨 Extraction...", "⚡ Génération...", "✅ Finalisation..."],
  },
  pro: {
    name: "Codeo Pro",
    engine: "V-AST Turbo v4.2",
    status: "Accélération GPU Active",
    statusColor: "text-amber-600",
    frameworks: ["react", "nextjs", "vue", "html"] as FrameworkType[],
    styleEngines: ["tailwind", "css-modules", "styled-components"] as StyleEngine[],
    logs: ["🚀 Analyse deep learning...", "🎨 Tokens design...", "✨ Finalisation premium..."],
  },
  business: {
    name: "Codeo Enterprise",
    engine: "V-AST Enterprise Custom",
    status: "Instance Dédiée - Latence Zéro",
    statusColor: "text-purple-600",
    frameworks: ["react", "nextjs", "vue", "html"] as FrameworkType[],
    styleEngines: ["tailwind", "css-modules", "styled-components"] as StyleEngine[],
    logs: ["🔍 Analyse patterns...", "🛡️ Sécurité...", "🏢 Finalisation enterprise..."],
  },
};

const planColors = {
  starter: { bg: "green", text: "green-600" },
  pro: { bg: "amber", text: "amber-600" },
  business: { bg: "purple", text: "purple-600" },
};

const getFrameworkIcon = (framework: FrameworkType) => {
  const className = "w-4 h-4";
  switch (framework) {
    case "react": return <Atom className={`${className} text-blue-500`} />;
    case "nextjs": return <Globe className={`${className} text-black dark:text-white`} />;
    case "vue": return <Triangle className={`${className} text-green-500`} />;
    case "html": return <Code2 className={`${className} text-orange-500`} />;
    case "tailwind": return <Palette className={`${className} text-cyan-500`} />;
    default: return null;
  }
};

export default function WorkbenchPage() {
  const { activePlan } = usePlan();
  const config = planConfigs[activePlan as PlanType];

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isConfigPanelCollapsed, setIsConfigPanelCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [areLogsCollapsed, setAreLogsCollapsed] = useState(false);

  const [workbenchConfig, setWorkbenchConfig] = useState<WorkbenchConfig>({
    framework: config.frameworks[0],
    styleEngine: config.styleEngines[0],
    enableAnimations: false,
    enableAccessibility: false,
    enableSecurity: false,
    enableDesignSystem: false,
    darkMode: true,
    mobile: false,
    useTypeScript: true,
    componentName: "MyComponent",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setWorkbenchConfig(prev => ({
      ...prev,
      framework: config.frameworks.includes(prev.framework) ? prev.framework : config.frameworks[0],
      styleEngine: config.styleEngines.includes(prev.styleEngine) ? prev.styleEngine : config.styleEngines[0],
    }));
  }, [activePlan, config]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setUploadedImage(ev.target?.result as string);
        toast.success("Image uploadée avec succès !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = ev => {
        setUploadedImage(ev.target?.result as string);
        toast.success("Image déposée avec succès !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const generateCode = async () => {
    if (!uploadedImage) {
      toast.error("Veuillez d'abord uploader une image !");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setLogs([]);

    for (let i = 0; i < config.logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const log: GenerationLog = {
        id: `${Date.now()}-${i}`,
        message: config.logs[i],
        timestamp: new Date(),
        type: i === config.logs.length - 1 ? "success" : "info",
      };
      setLogs(prev => [...prev, log]);
      setGenerationProgress(((i + 1) / config.logs.length) * 100);
    }

    const mockCode = `// Composant généré avec ${config.engine}
import React${workbenchConfig.useTypeScript ? ", { useState }" : ""} from 'react';

const ${workbenchConfig.componentName} = () => {
  return (
    <div className="p-6 rounded-xl ${workbenchConfig.darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}">
      <h2 className="text-xl font-bold mb-4">${workbenchConfig.componentName}</h2>
      <p>Composant généré par ${config.engine} avec ${workbenchConfig.framework}</p>
    </div>
  );
};

export default ${workbenchConfig.componentName};
`;

    setGeneratedCode(mockCode);
    setIsGenerating(false);
    toast.success("Code généré avec succès !");
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success("Code copié !");
    }
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workbenchConfig.componentName}.${workbenchConfig.useTypeScript ? "tsx" : "jsx"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Fichier téléchargé !");
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* HEADER */}
        <header className="flex-shrink-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-3 flex items-center justify-between max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-6 flex-wrap">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-${planColors[activePlan as PlanType].bg}-50 to-${planColors[activePlan as PlanType].bg}-100 dark:from-${planColors[activePlan as PlanType].bg}-950/40 dark:to-${planColors[activePlan as PlanType].bg}-900/30 border border-${planColors[activePlan as PlanType].bg}-200 dark:border-${planColors[activePlan as PlanType].bg}-800`}>
                <Cpu className={`w-6 h-6 text-${planColors[activePlan as PlanType].text}`} />
                <div>
                  <p className="font-bold text-base leading-tight">{config.name}</p>
                  <p className={`text-xs ${config.statusColor} font-medium`}>{config.engine} · {config.status}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* GAUCHE - Upload - 35% */}
          <div className="hidden md:flex md:w-[35%] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Upload Design</h2>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 min-h-[400px] flex items-center justify-center ${
                    isDragging ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.01] shadow-lg" : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {uploadedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={uploadedImage} 
                        alt="Design uploadé" 
                        className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-500 hover:scale-105" 
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-4 right-4 z-10 shadow-md" 
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-16 h-16 mx-auto mb-6 text-slate-400" />
                      <p className="text-lg font-medium mb-3">Glissez-déposez votre image ici</p>
                      <p className="text-sm text-slate-500 mb-8">ou cliquez pour parcourir</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        size="lg" 
                        className="shadow-md"
                      >
                        Parcourir les fichiers
                      </Button>
                    </div>
                  )}
                </div>

                {uploadedImage && (
                  <div className="flex justify-center gap-4 mt-8">
                    <Button 
                      size="lg" 
                      onClick={generateCode} 
                      disabled={isGenerating} 
                      className="shadow-lg min-w-[200px]"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Générer le code
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DROITE - Code - 65% */}
          <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-950">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="justify-start px-6 py-2 border-b bg-transparent h-12 items-center">
                <TabsTrigger value="code" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 h-8">
                  <Code2 className="w-4 h-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={!generatedCode} className="h-8">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="h-full mt-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                {generatedCode ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Code2 className="w-5 h-5" />
                          <span className="font-semibold">Code généré</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyCode}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copier
                          </Button>
                          <Button size="sm" onClick={downloadCode}>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <MonacoEditor
                        language={workbenchConfig.useTypeScript ? "typescript" : "javascript"}
                        theme="vs-dark"
                        value={generatedCode}
                        height="100%"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    <div className="text-center max-w-md px-6">
                      <Code2 className="w-16 h-16 mx-auto mb-6 opacity-50" />
                      <p className="text-xl font-medium mb-4">Prêt à générer</p>
                      <p className="text-base">Upload une image puis cliquez sur "Générer le code"</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="h-full mt-0 p-6 overflow-auto flex items-center justify-center">
                <div className="text-center text-slate-500 max-w-md">
                  <Eye className="w-16 h-16 mx-auto mb-6 opacity-50" />
                  <p className="text-xl font-medium mb-4">Aperçu en direct</p>
                  <p className="text-sm mt-2">Fonctionnalité preview à venir</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* PANNEAU CONFIGURATION */}
          <motion.div
            className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-md"
            animate={{ width: isConfigPanelCollapsed ? 64 : 320 }}
            transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.9 }}
          >
            {/* Header du panneau */}
            <div className="flex-shrink-0 h-12 border-b border-slate-200 dark:border-slate-800 flex items-center">
              {isConfigPanelCollapsed ? (
                <Button
                  variant="ghost"
                  className="w-full h-full rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                  onClick={() => setIsConfigPanelCollapsed(false)}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full px-5">
                  <h2 className="text-lg font-semibold tracking-tight">Configuration</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsConfigPanelCollapsed(true)} className="border-t border-slate-200 dark:border-slate-800 h-8 w-8">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Contenu du panneau - seulement visible quand non réduit */}
            {!isConfigPanelCollapsed && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <Card className={`p-5 bg-gradient-to-br from-${planColors[activePlan as PlanType].bg}-50 to-transparent dark:from-${planColors[activePlan as PlanType].bg}-950/30 border-${planColors[activePlan as PlanType].bg}-200 dark:border-${planColors[activePlan as PlanType].bg}-800`}>
                  <div className="flex items-center gap-4">
                    <Cpu className={`w-8 h-8 text-${planColors[activePlan as PlanType].text}`} />
                    <div>
                      <p className="font-bold text-lg">{config.name}</p>
                      <p className={`text-sm ${config.statusColor}`}>{config.engine}</p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium">Framework</Label>
                    <Select 
                      value={workbenchConfig.framework} 
                      onValueChange={(v: FrameworkType) => setWorkbenchConfig(prev => ({ ...prev, framework: v }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {config.frameworks.map((f: FrameworkType) => (
                          <SelectItem key={f} value={f}>
                            <div className="flex items-center gap-2">
                              {getFrameworkIcon(f)}
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {activePlan === "starter" && <p className="text-xs text-slate-500 mt-1">Next.js et Vue disponibles en Pro ✨</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Style Engine</Label>
                    <Select 
                      value={workbenchConfig.styleEngine} 
                      onValueChange={(v: StyleEngine) => setWorkbenchConfig(prev => ({ ...prev, styleEngine: v }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {config.styleEngines.map((s: StyleEngine) => (
                          <SelectItem key={s} value={s}>
                            {s === "css-modules" ? "CSS Modules" : s === "styled-components" ? "Styled Components" : "Tailwind"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Nom du composant</Label>
                    <Input
                      className="mt-1.5"
                      value={workbenchConfig.componentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkbenchConfig(prev => ({ ...prev, componentName: e.target.value }))}
                      placeholder="MyComponent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ts" className="text-sm font-medium">TypeScript</Label>
                      <Switch
                        id="ts"
                        checked={workbenchConfig.useTypeScript}
                        onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, useTypeScript: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark" className="text-sm font-medium">Dark Mode</Label>
                      <Switch
                        id="dark"
                        checked={workbenchConfig.darkMode}
                        onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, darkMode: v }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile" className="text-sm font-medium">Preview Mobile</Label>
                    <Switch
                      id="mobile"
                      checked={workbenchConfig.mobile}
                      onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, mobile: v }))}
                    />
                  </div>

                  {/* Fonctionnalités Pro */}
                  <Card className={`p-5 ${activePlan === "starter" ? "opacity-50" : ""} bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold">Fonctionnalités Pro</h3>
                      {activePlan === "starter" && <Lock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className={activePlan === "starter" ? "text-slate-500" : ""}>Animations fluides</Label>
                        <Switch
                          checked={workbenchConfig.enableAnimations}
                          onCheckedChange={activePlan !== "starter" ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, enableAnimations: v })) : undefined}
                          disabled={activePlan === "starter"}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className={activePlan === "starter" ? "text-slate-500" : ""}>Accessibilité ARIA</Label>
                        <Switch
                          checked={workbenchConfig.enableAccessibility}
                          onCheckedChange={activePlan !== "starter" ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, enableAccessibility: v })) : undefined}
                          disabled={activePlan === "starter"}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Fonctionnalités Business */}
                  <Card className={`p-5 ${activePlan !== "business" ? "opacity-50" : ""} bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">Fonctionnalités Business</h3>
                      {activePlan !== "business" && <Lock className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className={activePlan !== "business" ? "text-slate-500" : ""}>Sécurité entreprise</Label>
                        <Switch
                          checked={workbenchConfig.enableSecurity}
                          onCheckedChange={activePlan === "business" ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, enableSecurity: v })) : undefined}
                          disabled={activePlan !== "business"}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className={activePlan !== "business" ? "text-slate-500" : ""}>Design System synchronisé</Label>
                        <Switch
                          checked={workbenchConfig.enableDesignSystem}
                          onCheckedChange={activePlan === "business" ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, enableDesignSystem: v })) : undefined}
                          disabled={activePlan !== "business"}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* FOOTER LOGS */}
        <motion.div 
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-md"
          animate={{ height: areLogsCollapsed ? 48 : 128 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        >
          {/* Header des logs avec bouton de réduction */}
          <div className="flex-shrink-0 h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <h4 className="font-semibold text-base">Logs de génération</h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAreLogsCollapsed(!areLogsCollapsed)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-10 w-10"
            >
              <motion.div
                animate={{ rotate: areLogsCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {areLogsCollapsed ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </motion.div>
            </Button>
          </div>

          {/* Contenu des logs */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-shrink-0 p-4">
              {isGenerating && (
                <div className="flex items-center gap-4 text-sm mb-3">
                  <Progress value={generationProgress} className="w-32 h-2" />
                  <span className="font-medium">{Math.round(generationProgress)}%</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence mode="popLayout">
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-start gap-3 py-1"
                  >
                    {log.type === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-500 mt-0.5 animate-pulse flex-shrink-0" />
                    )}
                    <span className="flex-1 leading-relaxed text-sm">{log.message}</span>
                    <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                      {log.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {logs.length === 0 && (
                <div className="text-center text-slate-500 italic py-6 text-sm">
                  Les logs s'afficheront ici pendant la génération
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <Toaster position="bottom-center" richColors closeButton />
      </div>
    </TooltipProvider>
  );
}
