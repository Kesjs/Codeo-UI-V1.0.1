"use client";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  Sparkles,
  Upload,
  Download,
  Copy,
  Settings,
  Cpu,
  Activity,
  Clock,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  GitBranch,
  Lock,
  Crown,
  Zap,
  ShieldCheck,
  Code2,
  Atom,
  Globe,
  Triangle,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePlan } from '../layout';
import dynamic from 'next/dynamic';

// Lazy load Monaco
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

// Types
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

// Configurations par plan
const planConfigs = {
  starter: {
    name: "Starter",
    engine: "V-AST Standard",
    status: "Traitement classique",
    statusColor: "text-green-600",
    frameworks: ["react", "html"] as FrameworkType[],
    styleEngines: ["tailwind"] as StyleEngine[],
    logs: [
      "Analyse des formes géométriques...",
      "Détection des conteneurs principaux...",
      "Extraction de la palette de couleurs...",
      "Génération HTML sémantique...",
      "Application des styles Tailwind...",
      "✅ Finalisation du composant...",
    ],
  },
  pro: {
    name: "Pro",
    engine: "V-AST Turbo v4.2",
    status: "Priorité GPU Active",
    statusColor: "text-amber-600",
    frameworks: ["react", "nextjs", "vue", "html"] as FrameworkType[],
    styleEngines: ["tailwind", "css-modules", "styled-components"] as StyleEngine[],
    logs: [
      "🧠 Analyse deep learning des patterns UI...",
      "🎨 Extraction des tokens design...",
      "⚡ Optimisation Tailwind v4...",
      "🔧 Injection des hooks React...",
      "🎭 Ajout des micro-interactions...",
      "📊 Optimisation des performances...",
      "✨ Finalisation avec animations...",
    ],
  },
  business: {
    name: "Business",
    engine: "V-AST Enterprise Custom",
    status: "Instance Dédiée - Latence Zéro",
    statusColor: "text-purple-600",
    frameworks: ["react", "nextjs", "vue", "html"] as FrameworkType[],
    styleEngines: ["tailwind", "css-modules", "styled-components"] as StyleEngine[],
    logs: [
      "Analyse des patterns entreprise...",
      "Vérification conformité design system...",
      "Calcul structure sémantique accessible...",
      "Scan de sécurité intégré...",
      "Synchronisation tokens design...",
      "Génération optimisée GPU...",
      "Injection hooks React avancés...",
      "Validation SEO et performance...",
      "Finalisation composant enterprise...",
    ],
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
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [generationTime, setGenerationTime] = useState<string>("0.0");
  const [currentLog, setCurrentLog] = useState<string>("");
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isConfigPanelCollapsed, setIsConfigPanelCollapsed] = useState(false);

  const [workbenchConfig, setWorkbenchConfig] = useState<WorkbenchConfig>({
    framework: config.frameworks[0],
    styleEngine: config.styleEngines[0],
    enableAnimations: false,
    enableAccessibility: false,
    enableSecurity: false,
    enableDesignSystem: false,
    darkMode: false,
    mobile: false,
    useTypeScript: true,
    componentName: "MyComponent",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset framework/style quand le plan change
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = ev => {
        setUploadedImage(ev.target?.result as string);
        toast.success("Image déposée avec succès !");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Veuillez déposer une image valide");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const generateCode = async () => {
    if (!uploadedImage) {
      toast.error("Veuillez uploader une image d'abord");
      return;
    }

    setIsGenerating(true);
    setGenerationStartTime(Date.now());
    setLogs([]);
    setGeneratedCode("");
    setGenerationProgress(0);

    for (let i = 0; i < config.logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const log: GenerationLog = {
        id: `${Date.now()}-${i}`,
        message: config.logs[i],
        timestamp: new Date(),
        type: i === config.logs.length - 1 ? "success" : "info",
      };
      setLogs(prev => [...prev, log]);
      setCurrentLog(config.logs[i]);
      setGenerationProgress(((i + 1) / config.logs.length) * 100);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    const timeTaken = ((Date.now() - (generationStartTime || Date.now())) / 1000).toFixed(1);
    setGenerationTime(timeTaken);

    // Code mock avec les options activées
    const mockCode = `// Composant généré avec ${config.engine}
import React from 'react';
${workbenchConfig.enableAnimations ? "import { motion } from 'framer-motion';\n" : ""}

${workbenchConfig.useTypeScript ? `const ${workbenchConfig.componentName}: React.FC = () => {` : `function ${workbenchConfig.componentName}() {`}

  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Composant généré ✨</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>Framework : ${workbenchConfig.framework}</div>
        <div>Style : ${workbenchConfig.styleEngine}</div>
        ${workbenchConfig.enableAnimations ? "<div>Animations : Oui ✨</div>" : ""}
        ${workbenchConfig.enableAccessibility ? "<div>Accessibilité : Oui ♿</div>" : ""}
        ${workbenchConfig.enableSecurity ? "<div>Sécurité entreprise : Oui 🔒</div>" : ""}
        ${workbenchConfig.enableDesignSystem ? "<div>Design System synchronisé : Oui 🎨</div>" : ""}
      </div>
    </div>
  );
};

${workbenchConfig.useTypeScript ? "export default " + workbenchConfig.componentName + ";" : "export default " + workbenchConfig.componentName + ";"}
`;

    setGeneratedCode(mockCode);
    setGenerationProgress(100);
    setIsGenerating(false);
    setCurrentLog("");
    toast.success("Composant généré avec succès !");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copié !");
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workbenchConfig.componentName || "component"}.${workbenchConfig.useTypeScript ? "tsx" : "jsx"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Fichier téléchargé !");
  };

  const linesOfCode = generatedCode ? generatedCode.split("\n").length : 0;
  const bundleSize = generatedCode ? (generatedCode.length / 1024).toFixed(1) : "0";

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        {/* Zone principale */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Upload */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Uploader votre design</h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-slate-300"}`}
            >
              {uploadedImage ? (
                <div className="relative max-w-2xl mx-auto">
                  <img src={uploadedImage} alt="Design" className="max-h-96 mx-auto rounded-lg shadow-lg" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-16 h-16 mx-auto mb-6 text-slate-400" />
                  <p className="text-lg font-medium mb-2">Glissez-déposez votre image ici</p>
                  <p className="text-sm text-slate-500 mb-6">ou cliquez pour parcourir</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} size="lg">
                    Parcourir les fichiers
                  </Button>
                </div>
              )}
            </div>

            {uploadedImage && (
              <div className="flex justify-center gap-4 mt-8">
                <Button size="lg" onClick={generateCode} disabled={isGenerating}>
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

                {(activePlan === "pro" || activePlan === "business") && (
                  <Button variant="outline" size="lg" onClick={() => toast("Fonctionnalité à venir !")}>
                    <GitBranch className="mr-2 h-5 w-5" />
                    Commit to Git
                  </Button>
                )}
              </div>
            )}

            {generationTime !== "0.0" && !isGenerating && (
              <p className="text-center mt-6 text-sm text-slate-600">
                Généré en <span className="font-semibold">{generationTime}s</span>
              </p>
            )}
          </div>

          {/* Logs + progression */}
          {(isGenerating || generatedCode) && (
            <div className="px-8 pb-4">
              {isGenerating && (
                <div className="mb-6">
                  <Progress value={generationProgress} className="h-3" />
                  <p className="text-center mt-2 text-sm font-medium">{Math.round(generationProgress)} %</p>
                </div>
              )}

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Logs de génération
                </h3>
                <div className="space-y-3">
                  <AnimatePresence>
                    {logs.map(log => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        {log.type === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        ) : (
                          <Activity className="w-4 h-4 text-blue-500 mt-0.5 animate-pulse" />
                        )}
                        <span className="flex-1">{log.message}</span>
                        <span className="text-xs text-slate-500">
                          {log.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isGenerating && currentLog && (
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{currentLog}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Éditeur de code */}
          {generatedCode && (
            <div className="flex-1 px-8 pb-8">
              <div className="h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Code2 className="w-5 h-5" />
                    <span className="font-semibold">Code généré</span>
                    <span className="text-sm text-slate-500">
                      {linesOfCode} lignes • {bundleSize} KB
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button onClick={downloadCode}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <MonacoEditor
                    language={workbenchConfig.useTypeScript ? "typescript" : "javascript"}
                    theme="vs-dark"
                    value={generatedCode}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau latéral collapsible à droite */}
        <motion.div
          className="bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
          animate={{ width: isConfigPanelCollapsed ? 48 : 320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        >
          {/* Header / bouton collapse */}
          <div className="h-12 border-b border-slate-200 dark:border-slate-700 flex items-center">
            {isConfigPanelCollapsed ? (
              <Button
                variant="ghost"
                className="w-full h-full rounded-none justify-center"
                onClick={() => setIsConfigPanelCollapsed(false)}
              >
                <motion.div animate={{ rotate: 180 }}>
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full px-4">
                <h2 className="text-lg font-semibold">Configuration</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-16 h-10"
                  onClick={() => setIsConfigPanelCollapsed(true)}
                >
                  <motion.div animate={{ rotate: 0 }}>
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </div>
            )}
          </div>

          {/* Contenu du panneau */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-6 transition-opacity ${isConfigPanelCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {/* Carte moteur IA */}
            <Card className={`p-4 bg-gradient-to-r from-${planColors[activePlan as PlanType].bg}-100 to-transparent dark:from-${planColors[activePlan as PlanType].bg}-900/30 border border-${planColors[activePlan as PlanType].bg}-200 dark:border-${planColors[activePlan as PlanType].bg}-800`}>
              <div className="flex items-center gap-3">
                <Cpu className={`w-8 h-8 text-${planColors[activePlan as PlanType].text}`} />
                <div>
                  <p className="font-semibold text-lg">{config.name}</p>
                  <p className={`text-sm ${config.statusColor}`}>{config.engine}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{config.status}</p>
            </Card>

            {/* Options de base */}
            <div className="space-y-5">
              <div>
                <Label>Framework</Label>
                <Select value={workbenchConfig.framework} onValueChange={(v: FrameworkType) => setWorkbenchConfig(prev => ({ ...prev, framework: v }))}>
                  <SelectTrigger>
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
                <Label>Style Engine</Label>
                <Select value={workbenchConfig.styleEngine} onValueChange={(v: StyleEngine) => setWorkbenchConfig(prev => ({ ...prev, styleEngine: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.styleEngines.map((s: StyleEngine) => (
                      <SelectItem key={s} value={s}>{s === "css-modules" ? "CSS Modules" : s === "styled-components" ? "Styled Components" : "Tailwind"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nom du composant</Label>
                <Input
                  value={workbenchConfig.componentName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkbenchConfig(prev => ({ ...prev, componentName: e.target.value }))}
                  placeholder="MyComponent"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ts">TypeScript</Label>
                <Switch id="ts" checked={workbenchConfig.useTypeScript} onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, useTypeScript: v }))} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark">Dark Mode</Label>
                <Switch id="dark" checked={workbenchConfig.darkMode} onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, darkMode: v }))} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="mobile">Preview Mobile</Label>
                <Switch id="mobile" checked={workbenchConfig.mobile} onCheckedChange={(v: boolean) => setWorkbenchConfig(prev => ({ ...prev, mobile: v }))} />
              </div>
            </div>

            {/* Section Pro */}
            <div className={`rounded-lg p-4 border ${activePlan === "starter" ? "opacity-50" : ""} bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800`}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold">Fonctionnalités Pro</h3>
                {activePlan === "starter" && <Lock className="w-4 h-4 text-amber-600" />}
              </div>
              <div className="space-y-4">
                {(["enableAnimations", "enableAccessibility"] as const).map(key => {
                  const canUse = activePlan === "pro" || activePlan === "business";
                  const labels = { enableAnimations: "Animations fluides", enableAccessibility: "Accessibilité ARIA" };
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <Label className={!canUse ? "text-slate-500" : ""}>{labels[key]}</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Switch
                              checked={workbenchConfig[key]}
                              onCheckedChange={canUse ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, [key]: v })) : undefined}
                              disabled={!canUse}
                            />
                          </div>
                        </TooltipTrigger>
                        {!canUse && <TooltipContent>Disponible en plan Pro</TooltipContent>}
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section Business */}
            <div className={`rounded-lg p-4 border ${activePlan !== "business" ? "opacity-50" : ""} bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800`}>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Fonctionnalités Business</h3>
                {activePlan !== "business" && <Lock className="w-4 h-4 text-purple-600" />}
              </div>
              <div className="space-y-4">
                {(["enableSecurity", "enableDesignSystem"] as const).map(key => {
                  const canUse = activePlan === "business";
                  const labels = { enableSecurity: "Sécurité entreprise", enableDesignSystem: "Design System synchronisé" };
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <Label className={!canUse ? "text-slate-500" : ""}>{labels[key]}</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Switch
                              checked={workbenchConfig[key]}
                              onCheckedChange={canUse ? (v: boolean) => setWorkbenchConfig(prev => ({ ...prev, [key]: v })) : undefined}
                              disabled={!canUse}
                            />
                          </div>
                        </TooltipTrigger>
                        {!canUse && <TooltipContent>Disponible en plan Business</TooltipContent>}
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Toaster position="bottom-center" />
    </TooltipProvider>
  );
}
