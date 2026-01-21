"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  History,
  Layout,
  Cpu,
  Folder,
  Palette,
  Activity,
  Users,
  Settings,
  Bell,
  User,
  Menu,
  ChevronDown,
  Search,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/app/dashboard/layout";
import { useSearch } from "@/contexts/SearchContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Import du type SearchResult depuis le contexte
interface SearchResult {
  id: string;
  type: "project" | "component" | "collection" | "user" | "setting";
  title: string;
  description: string;
  path: string;
  metadata?: {
    framework?: string;
    efficiency?: number;
    date?: string;
    tags?: string[];
  };
}

interface DynamicHeaderProps {
  onMenuClick?: () => void;
  onMenuClose?: () => void;
  isSidebarOpen?: boolean;
}

const sections = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    subtitle: "Vue d'ensemble de vos projets",
    icon: Layout,
    path: "/dashboard",
    color: "bg-blue-500",
  },
  {
    id: "workbench",
    title: "V-AST Workbench",
    subtitle: "Génération IA ultra-rapide",
    icon: Cpu,
    path: "/dashboard/workbench",
    color: "bg-codeo-green",
  },
  {
    id: "components",
    title: "Mes Composants",
    subtitle: "Bibliothèque réutilisable",
    icon: Folder,
    path: "/dashboard/components",
    color: "bg-purple-500",
  },
  {
    id: "collections",
    title: "Collections",
    subtitle: "Designs organisés",
    icon: Palette,
    path: "/dashboard/collections",
    color: "bg-pink-500",
  },
  {
    id: "team",
    title: "Équipe Business",
    subtitle: "Gestion collaborative",
    icon: Users,
    path: "/dashboard/team",
    color: "bg-indigo-500",
  },
  {
    id: "api",
    title: "API & Webhooks",
    subtitle: "Intégrations avancées",
    icon: Activity,
    path: "/dashboard/api",
    color: "bg-orange-500",
  },
];

export default function DynamicHeader({
  onMenuClick,
  onMenuClose,
  isSidebarOpen,
}: DynamicHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activePlan } = usePlan();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
  } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);
  const profileMenuRef = useRef<HTMLDivElement>(null!);
  const notificationMenuRef = useRef<HTMLDivElement>(null!);
  const searchResultsRef = useRef<HTMLDivElement>(null!);

  // Fermer les menus quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationMenuOpen(false);
      }
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsSearchResultsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ouvrir/fermer les résultats de recherche
  useEffect(() => {
    setIsSearchResultsOpen(searchQuery.length > 0 && searchResults.length > 0);
  }, [searchQuery, searchResults]);

  const currentSection =
    sections.find((section) => section.path === pathname) || sections[0];
  const Icon = currentSection?.icon;

  // Crédits selon le plan
  const getCredits = () => {
    switch (activePlan) {
      case "starter":
        return { used: 8, total: 10, label: "scans restants" };
      case "pro":
        return { used: 47, total: Infinity, label: "scans utilisés" };
      case "business":
        return { used: 142, total: Infinity, label: "scans utilisés" };
      default:
        return { used: 0, total: 10, label: "scans" };
    }
  };

  const credits = getCredits();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40"
    >
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Menu hamburger à gauche - visible sur mobile */}
          <button
            onClick={() =>
              isSidebarOpen
                ? onMenuClose && onMenuClose()
                : onMenuClick && onMenuClick()
            }
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Nom de la section active avec trait - caché sur mobile */}
          <div className="hidden sm:flex flex-col items-center min-w-0 flex-shrink-0 w-[120px] relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate">
                {currentSection?.title}
              </span>
            </button>
            <div
              className={`absolute -bottom-3 left-0 right-0 h-0.5 bg-codeo-green transition-all duration-200 ${pathname === currentSection?.path ? "opacity-100" : "opacity-0"}`}
            ></div>
          </div>

          {/* Barre de recherche - centrée */}
          <div
            className="relative flex-1 max-w-md mx-auto"
            ref={searchResultsRef}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Rechercher dans votre espace..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                autoFocus={false}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Résultats de recherche dropdown */}
            <AnimatePresence>
              {isSearchResultsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      Recherche en cours...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((result: SearchResult) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            router.push(result.path);
                            clearSearch();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {result.type === "project" && (
                                <Folder className="w-4 h-4 text-blue-500" />
                              )}
                              {result.type === "component" && (
                                <Layout className="w-4 h-4 text-purple-500" />
                              )}
                              {result.type === "collection" && (
                                <Palette className="w-4 h-4 text-pink-500" />
                              )}
                              {result.type === "user" && (
                                <Users className="w-4 h-4 text-green-500" />
                              )}
                              {result.type === "setting" && (
                                <Settings className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                                {result.description}
                              </div>
                              {result.metadata?.framework && (
                                <div className="text-xs text-codeo-green mt-1">
                                  {result.metadata.framework}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      Aucun résultat trouvé pour "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions utilisateur - fixées à droite */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 w-[120px] sm:w-auto justify-end">
            {/* Crédits (desktop) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <Zap className="w-4 h-4 text-codeo-green" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {credits.total === Infinity
                    ? "Illimités"
                    : `${credits.used}/${credits.total}`}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {credits.label}
                </div>
              </div>
            </div>

            {/* Menu déroulant notifications */}
            <div className="relative" ref={notificationMenuRef}>
              <button
                onClick={() =>
                  setIsNotificationMenuOpen(!isNotificationMenuOpen)
                }
                className="relative h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Menu déroulant notifications */}
              <AnimatePresence>
                {isNotificationMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    {/* En-tête notifications */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="font-medium text-slate-900 dark:text-white">
                        Notifications
                      </div>
                      <button className="text-xs text-codeo-green hover:text-codeo-green/70">
                        Tout marquer comme lu
                      </button>
                    </div>

                    {/* Liste des notifications */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-codeo-green/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-codeo-green" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              Scan IA terminé
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Votre projet "Dashboard Pro" a été scanné avec
                              succès
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Il y a 2 minutes
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              Nouveau membre
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Marie a rejoint votre équipe Business
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Il y a 15 minutes
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              API activée
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Vos webhooks sont maintenant actifs
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Il y a 1 heure
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                      <button className="w-full text-center text-sm text-codeo-green hover:text-codeo-green/70 py-1">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu déroulant profil */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-1 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-codeo-green to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <span className="hidden sm:block font-medium text-sm text-slate-700 dark:text-slate-300">
                  Jean Dupont
                </span>
                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Menu déroulant profil */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    {/* En-tête profil */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-codeo-green to-green-600 flex items-center justify-center text-white font-semibold">
                          JD
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            Jean Dupont
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            jean.dupont@email.com
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Options du menu */}
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Mon Profil</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Paramètres</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <Zap className="w-4 h-4 text-codeo-green" />
                        <span>Facturation</span>
                      </button>
                      <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-red-600">
                        <Settings className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
