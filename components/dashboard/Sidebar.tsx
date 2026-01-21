"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus,
  LayoutDashboard,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Code,
  Users,
  Terminal,
  Cpu,
  History,
  FolderKanban,
  Palette,
  Zap,
  Home,
  Briefcase,
  Settings,
  Globe,
  Key,
  HelpCircle,
  Activity,
} from "lucide-react";
import Logo from "@/components/Logo";
import { usePlan } from "@/app/dashboard/layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { activePlan } = usePlan();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Gestion du dépliage des sections
  const [openSections, setOpenSections] = useState({
    generation: true, // Seule la section principale est dépliée par défaut
    library: false, // Fermées pour une interface plus épurée
    inspiration: false, // Fermées pour une interface plus épurée
    infra: false, // Fermé par défaut
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => {
      // Crée un nouvel objet avec toutes les sections fermées
      const newState = Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {} as typeof openSections,
      );

      // Ouvre uniquement la section cliquée si elle était fermée
      return {
        ...newState,
        [section]: !prev[section],
      };
    });
  };

  const handleLogout = () => router.push("/login");

  const handleNewProject = () => {
    router.push("/dashboard/workbench");
  };

  // Fonction pour vérifier l'accès selon le badge et le plan
  const hasAccess = (badge: string | undefined, plan: string): boolean => {
    if (!badge) return true; // Pas de badge = accès libre
    if (badge === "Bientôt") return false; // Toujours bloqué
    if (badge === "Business" && plan === "business") return true;
    if (badge === "Pro" && (plan === "pro" || plan === "business")) return true;
    return false;
  };

  // Composant pour les en-têtes de section
  const SectionHeader = ({
    title,
    isOpen,
    onToggle,
    icon: Icon,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    icon: any;
  }) => {
    const sectionHeaderContent = (
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-all duration-200 group hover:bg-codeo-green/5 rounded-lg ${isCollapsed ? "lg:flex-col lg:justify-center" : ""}`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "lg:flex-col" : "gap-2"}`}
        >
          <Icon className="h-4.5 w-4.5" />
          <span
            className={`transition-all duration-500 ease-out ${isCollapsed ? "lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:absolute" : "lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:relative"}`}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          className={`h-4.5 w-4.5 transition-all duration-500 ease-out ${isOpen ? "rotate-180" : ""} ${isCollapsed ? "lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:absolute" : "lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:relative"}`}
        />
      </button>
    );

    // Si la sidebar est réduite, ajouter un tooltip
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{sectionHeaderContent}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-slate-900 text-white text-sm font-medium"
            >
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return sectionHeaderContent;
  };

  // Composant pour les items de navigation
  const NavItem = ({ item }: { item: any }) => {
    const itemHasAccess = hasAccess(item.badge, activePlan);
    const isBlocked = item.badge && !itemHasAccess;

    const navItemContent = (
      <Link
        href={item.href}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (isBlocked) {
            e.preventDefault();
            alert(`Fonctionnalité ${item.badge} disponible prochainement !`);
          } else {
            // Fermer la sidebar mobile après le clic
            onClose();
          }
        }}
        className={`
          flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 no-underline group list-none relative
          ${
            item.current
              ? "bg-codeo-green text-white font-medium shadow-md shadow-codeo-green/25 border border-codeo-green/20"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }
            ${isBlocked ? "cursor-not-allowed opacity-70" : ""}
          ${isCollapsed ? "lg:flex-col lg:justify-center lg:items-center" : ""}
        `}
      >
        {/* Indicateur actif */}
        {item.current && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
        )}
        <div
          className={`flex items-center ${isCollapsed ? "lg:flex-col" : "gap-3"}`}
        >
          <item.icon
            className={`h-4 w-4 transition-colors ${item.current ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
          />
          <span
            className={`text-[14px] font-medium leading-none transition-all duration-500 ease-out ${isCollapsed ? "lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:absolute" : "lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:relative"}`}
          >
            {item.name}
          </span>
        </div>
        {item.badge && (
          <span
            className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border
            ${
              item.badge === "Bientôt"
                ? "bg-slate-100 text-slate-400 border-slate-200"
                : "bg-codeo-green/10 text-codeo-green border-codeo-green/20"
            }
          `}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );

    // Si la sidebar est réduite, ajouter un tooltip
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{navItemContent}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-slate-900 text-white text-sm font-medium"
            >
              <p>{item.name}</p>
              {item.badge && (
                <p
                  className={`text-xs mt-1 ${
                    item.badge === "Bientôt"
                      ? "text-slate-400"
                      : "text-codeo-green"
                  }`}
                >
                  {item.badge}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return navItemContent;
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div className="relative">
        <aside
          className={`
        fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200 h-screen lg:h-full flex flex-col
        transform transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-16" : "lg:w-[260px]"} w-64
      `}
        >
          {/* HEADER : LOGO & ENGINE STATUS - FIXÉ EN HAUT */}
          <div
            className={`border-b border-slate-200 bg-white flex-shrink-0 h-28`}
          >
            <div className="px-5 pt-5 pb-6">
              <Link
                href="/"
                className="flex items-center justify-center no-underline transition-opacity hover:opacity-80"
              >
                <div
                  className={`font-black text-slate-900 tracking-tight text-center ${!isCollapsed ? "text-xl" : "lg:text-2xl text-xl"}`}
                >
                  {!isCollapsed ? (
                    <>
                      Code<span className="text-codeo-green">o</span> U
                      <span className="text-codeo-green">I</span>
                    </>
                  ) : (
                    <>
                      <span className="lg:hidden">
                        Code<span className="text-codeo-green">o</span> U
                        <span className="text-codeo-green">I</span>
                      </span>
                      <span className="hidden lg:inline text-codeo-green">
                        C
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </div>
            <div
              className={`bg-slate-50 px-5 py-2 border-t border-slate-100 ${isCollapsed ? "lg:hidden" : ""}`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="relative flex items-center justify-center h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-codeo-green animate-ping opacity-25" />
                  <span className="relative h-2 w-2 rounded-full bg-codeo-green" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  V-AST Neural Engine
                </p>
              </div>
            </div>
          </div>

          {/* BOUTON PILULE - DESKTOP */}
          <div className="hidden lg:flex absolute top-48 -right-3 z-50">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="group w-6 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    hover:bg-slate-50 dark:hover:bg-slate-700 dark:hover:border-slate-600
                    rounded-full transition-all duration-300 flex items-center justify-center
                    focus:outline-none overflow-hidden"
                    aria-label={
                      isCollapsed
                        ? "Agrandir la barre latérale"
                        : "Réduire la barre latérale"
                    }
                  >
                    <div
                      className={`transform transition-transform duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-600 dark:text-slate-300 transition-colors duration-200"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-slate-900 text-white text-sm font-medium"
                >
                  <p>
                    {isCollapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* ACTION : NOUVEAU PROJET */}
          <div
            className={`px-3 pb-4 pt-6 flex-shrink-0 ${isCollapsed ? "lg:px-2" : ""}`}
          >
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleNewProject}
                      className={`w-full border border-codeo-green text-codeo-green bg-codeo-green/5 hover:bg-codeo-green/10 rounded-lg px-3 py-2.5 font-medium text-[13px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isCollapsed ? "lg:flex-col" : ""}`}
                    >
                      <Plus className="h-4 w-4" />
                      <span
                        className={`transition-all duration-500 ease-out ${isCollapsed ? "lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:absolute" : "lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:relative"}`}
                      >
                        Nouveau Projet
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white text-sm font-medium"
                  >
                    <p>Nouveau Projet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                onClick={handleNewProject}
                className={`w-full border border-codeo-green text-codeo-green bg-codeo-green/5 hover:bg-codeo-green/10 rounded-lg px-3 py-2.5 font-medium text-[13px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isCollapsed ? "lg:flex-col" : ""}`}
              >
                <Plus className="h-4 w-4" />
                <span
                  className={`transition-all duration-500 ease-out ${isCollapsed ? "lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:absolute" : "lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:relative"}`}
                >
                  Nouveau Projet
                </span>
              </button>
            )}
          </div>

          {/* NAVIGATION AREA (Invisible Scroll) */}
          <div
            className="flex-1 px-3 overflow-y-auto space-y-4 pt-8 min-h-0"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;  // Chrome/Safari/Opera
            }
          `}</style>

            {/* SECTION: GÉNÉRATION (Le Core Business) */}
            <div className="list-none">
              <SectionHeader
                title="Génération"
                isOpen={openSections.generation}
                onToggle={() => toggleSection("generation")}
                icon={Zap}
              />
              {openSections.generation && (
                <div className="space-y-1 pl-3 ml-1 border-l-2 border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-200">
                  <NavItem
                    item={{
                      name: "Tableau de bord",
                      href: "/dashboard",
                      icon: LayoutDashboard,
                      current: pathname === "/dashboard",
                    }}
                  />
                  <NavItem
                    item={{
                      name: "Workbench",
                      href: "/dashboard/workbench",
                      icon: Cpu,
                      current: pathname === "/dashboard/workbench",
                    }}
                  />
                </div>
              )}
            </div>

            {/* SECTION: BIBLIOTHÈQUE (Gestion des Assets) */}
            <div className="list-none">
              <SectionHeader
                title="Ma Bibliothèque"
                isOpen={openSections.library}
                onToggle={() => toggleSection("library")}
                icon={FolderKanban}
              />
              {openSections.library && (
                <div className="space-y-1 pl-3 ml-1 border-l-2 border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-200">
                  <NavItem
                    item={{
                      name: "Mes Composants",
                      href: "/dashboard/components",
                      icon: Code,
                      current: pathname === "/dashboard/components",
                    }}
                  />
                  <NavItem
                    item={{
                      name: "Collections",
                      href: "/dashboard/collections",
                      icon: Folder,
                      current: pathname === "/dashboard/collections",
                    }}
                  />
                  <NavItem
                    item={{
                      name: "Design System",
                      href: "#",
                      icon: Palette,
                      badge: "Bientôt",
                    }}
                  />
                </div>
              )}
            </div>

            {/* SECTION: INSPIRATION & MODÈLES */}
            <div className="list-none">
              <SectionHeader
                title="V-AST Vault"
                isOpen={openSections.inspiration}
                onToggle={() => toggleSection("inspiration")}
                icon={Briefcase}
              />
              {openSections.inspiration && (
                <div className="space-y-1 pl-3 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <NavItem
                    item={{
                      name: "Templates IA",
                      href: "#",
                      icon: Sparkles,
                      badge: "Bientôt",
                    }}
                  />
                </div>
              )}
            </div>

            {/* SECTION: INFRASTRUCTURE (Scale & Pro) */}
            <div className="list-none">
              <SectionHeader
                title="Infrastructure"
                isOpen={openSections.infra}
                onToggle={() => toggleSection("infra")}
                icon={Activity}
              />
              {openSections.infra && (
                <div className="space-y-1 pl-3 ml-1 border-l-2 border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-200">
                  <NavItem
                    item={{
                      name: "Équipe",
                      href: "/dashboard/team",
                      icon: Users,
                      badge: "Business",
                      current: pathname === "/dashboard/team",
                    }}
                  />
                  <NavItem
                    item={{
                      name: "API & Webhooks",
                      href: "/dashboard/api",
                      icon: Terminal,
                      badge: "Pro",
                      current: pathname === "/dashboard/api",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* FOOTER: BOUTONS PARAMÈTRES ET DÉCONNEXION */}
          <div
            className={`p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 flex-shrink-0 ${isCollapsed ? "lg:px-2" : ""}`}
          >
            {/* Bouton Paramètres */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push("/dashboard/settings")}
                    className={`w-full flex items-center p-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group ${isCollapsed ? "lg:px-2 justify-center" : "lg:px-3"}`}
                  >
                    <div
                      className="relative
                    flex items-center justify-center
                    w-9 h-9 bg-white border border-slate-200 rounded-xl
                    shadow-sm group-hover:shadow transition-all duration-200
                    text-slate-500 group-hover:text-codeo-green"
                    >
                      <Settings className="h-4 w-4 transition-colors" />
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-codeo-green transition-colors">
                        Paramètres
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white text-sm font-medium"
                  >
                    <p>Paramètres</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {/* Bouton Déconnexion */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center p-2.5 rounded-xl hover:bg-red-50 transition-all cursor-pointer group ${isCollapsed ? "lg:px-2 justify-center" : "lg:px-3"}`}
                  >
                    <div
                      className="relative
                    flex items-center justify-center
                    w-9 h-9 bg-white border border-red-100 rounded-xl
                    shadow-sm group-hover:shadow transition-all duration-200
                    text-red-400 group-hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 transition-colors" />
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium text-red-500 group-hover:text-red-600 transition-colors">
                        Déconnexion
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white text-sm font-medium"
                  >
                    <p>Déconnexion</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </aside>
      </div>
    </>
  );
}
