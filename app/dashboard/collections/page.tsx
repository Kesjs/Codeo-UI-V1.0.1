'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Code2,
  Folder,
  Clock,
  User,
  Tag,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Upload,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface Collection {
  id: string
  name: string
  description: string
  items: number
  updated: string
  createdAt: string
  creator: {
    name: string
    avatar: string
  }
  color: string
  frameworks: string[]
  thumbnail?: string
  tags: string[]
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [filterFramework, setFilterFramework] = useState<string>('all')
  const [filterByItems, setFilterByItems] = useState<number | null>(null)
  const collectionsRef = useRef<HTMLDivElement | null>(null)

  // Données enrichies avec nouvelles propriétés
  const collections: Collection[] = [
    {
      id: '1',
      name: 'Composants UI',
      description: 'Collection de composants réutilisables pour interfaces modernes',
      items: 24,
      updated: '2h ago',
      createdAt: '2024-01-15',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
      frameworks: ['React', 'Next.js', 'TypeScript'],
      tags: ['UI', 'Components', 'Design System'],
      thumbnail: undefined
    },
    {
      id: '2',
      name: 'Templates',
      description: 'Modèles de pages prêts à l\'emploi',
      items: 12,
      updated: '1j',
      createdAt: '2024-02-01',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      frameworks: ['React', 'Vue'],
      tags: ['Templates', 'Pages'],
      thumbnail: undefined
    },
    {
      id: '3',
      name: 'Formulaires',
      description: 'Composants de formulaires avec validation',
      items: 8,
      updated: '3j',
      createdAt: '2024-02-10',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      frameworks: ['React', 'TypeScript'],
      tags: ['Forms', 'Validation'],
      thumbnail: undefined
    },
    {
      id: '4',
      name: 'Navigation',
      description: 'Menus, sidebars et composants de navigation',
      items: 5,
      updated: '1 sem.',
      createdAt: '2024-02-20',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      frameworks: ['React', 'Next.js'],
      tags: ['Navigation', 'Menu'],
      thumbnail: undefined
    },
    {
      id: '5',
      name: 'Tableaux',
      description: 'Composants de tableaux de données avec tri et filtres',
      items: 7,
      updated: '2 sem.',
      createdAt: '2024-03-01',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      frameworks: ['React', 'TypeScript'],
      tags: ['Tables', 'Data'],
      thumbnail: undefined
    },
    {
      id: '6',
      name: 'Modales',
      description: 'Dialogs, modales et overlays interactifs',
      items: 3,
      updated: '3 sem.',
      createdAt: '2024-03-10',
      creator: {
        name: 'Ken Kennedy',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      frameworks: ['React'],
      tags: ['Modals', 'Dialogs'],
      thumbnail: undefined
    },
  ]

  // Calcul des statistiques
  const totalItems = collections.reduce((sum, col) => sum + col.items, 0)
  const totalFrameworks = new Set(collections.flatMap(col => col.frameworks)).size
  const averageItems = collections.length > 0 ? Math.round(totalItems / collections.length) : 0

  // Filtrage et tri
  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesFramework = filterFramework === 'all' || collection.frameworks.includes(filterFramework)
      const matchesItems = filterByItems === null || collection.items >= filterByItems
      return matchesSearch && matchesFramework && matchesItems
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updated).getTime() - new Date(a.updated).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'items':
          return b.items - a.items
        default:
          return 0
      }
    })

  const formatRelativeTime = (timeStr: string) => {
    return timeStr // On garde le format existant pour simplifier
  }

  // Fonction pour filtrer par nombre d'éléments et scroller
  const handleFilterByItems = (minItems: number) => {
    setFilterByItems(minItems)
    // Scroller vers les collections après un court délai
    setTimeout(() => {
      if (collectionsRef.current) {
        collectionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Si aucune collection
  if (collections.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-codeo-green/10 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-codeo-green" />
              </div>
              Collections
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Organisez et gérez vos composants en collections
            </p>
          </div>
          <Button className="bg-codeo-green hover:bg-codeo-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle collection
          </Button>
        </motion.div>

        {/* Empty State avec onboarding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center"
        >
          <div className="w-20 h-20 bg-codeo-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderKanban className="w-10 h-10 text-codeo-green" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
            Commencez par organiser votre travail
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            Créez des collections pour regrouper vos composants et faciliter leur gestion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              className="bg-codeo-green hover:bg-codeo-green/90 text-white"
              onClick={() => toast.success('Création d\'une nouvelle collection...')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une collection
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Import de modèles...')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer des modèles
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec icône */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-codeo-green/10 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-codeo-green" />
            </div>
            Collections
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Organisez et gérez vos composants en collections
          </p>
        </div>
        <Button className="bg-codeo-green hover:bg-codeo-green/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle collection
        </Button>
      </motion.div>

      {/* Statistiques en cartes - Interactives */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-codeo-green/50 hover:shadow-lg transition-all duration-200"
          onClick={() => {
            setFilterByItems(null)
            toast.info('Affichage de toutes les collections')
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total collections</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{collections.length}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-codeo-green/30" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-blue-500/50 hover:shadow-lg transition-all duration-200"
          onClick={() => handleFilterByItems(10)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total éléments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalItems}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-500/30" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-purple-500/50 hover:shadow-lg transition-all duration-200"
          onClick={() => {
            setFilterFramework('all')
            toast.info('Affichage de tous les frameworks')
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Frameworks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalFrameworks}</p>
            </div>
            <Code2 className="w-8 h-8 text-purple-500/30" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-amber-500/50 hover:shadow-lg transition-all duration-200"
          onClick={() => handleFilterByItems(averageItems)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Moyenne/collection</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {averageItems}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-amber-500/30" />
          </div>
        </motion.div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-codeo-green transition-colors duration-200 z-10 pointer-events-none" />
            <Input
              placeholder="Rechercher une collection..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-codeo-green/50 border border-slate-200 dark:border-slate-700 transition-colors duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>
          <Select value={filterFramework} onValueChange={setFilterFramework}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tous les frameworks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les frameworks</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Next.js">Next.js</SelectItem>
              <SelectItem value="Vue">Vue</SelectItem>
              <SelectItem value="TypeScript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="items">Nombre d'éléments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filterByItems !== null && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Filtre actif: {filterByItems}+ éléments
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setFilterByItems(null)}
            >
              Réinitialiser
            </Button>
          </div>
        )}
      </div>

      {/* Grille de collections */}
      <div ref={collectionsRef}>
        {filteredCollections.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Folder className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Aucune collection trouvée</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Aucune collection ne correspond à votre recherche ou filtre.
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterFramework('all'); setFilterByItems(null) }}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Effet de stack - visible au hover */}
                  <div className="absolute -top-2 left-4 right-4 h-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -top-1 left-2 right-2 h-full bg-slate-300/30 dark:bg-slate-600/30 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Carte principale avec hover glow */}
                  <div className="
                    relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
                    transition-all duration-300 overflow-hidden
                    group-hover:border-codeo-green/50 group-hover:shadow-xl
                    group-hover:scale-[1.02]
                  ">
                    {/* Hover Glow basé sur le gradient */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                      style={{
                        background: collection.color.includes('blue') 
                          ? 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))'
                          : collection.color.includes('green')
                          ? 'linear-gradient(to bottom right, rgba(34, 197, 94, 0.15), rgba(20, 184, 166, 0.15))'
                          : collection.color.includes('orange')
                          ? 'linear-gradient(to bottom right, rgba(249, 115, 22, 0.15), rgba(220, 38, 38, 0.15))'
                          : collection.color.includes('indigo')
                          ? 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.15), rgba(37, 99, 235, 0.15))'
                          : collection.color.includes('pink')
                          ? 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.15), rgba(225, 29, 72, 0.15))'
                          : 'linear-gradient(to bottom right, rgba(234, 179, 8, 0.15), rgba(217, 119, 6, 0.15))'
                      }}
                    />

                    {/* Thumbnail avec couleur de fond */}
                    <div className={`relative h-32 ${collection.color} overflow-hidden`}>
                      {collection.thumbnail ? (
                        <img 
                          src={collection.thumbnail} 
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderKanban className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      {/* Actions au survol */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white/90 hover:bg-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white/90 hover:bg-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                      {/* Badge nombre d'éléments */}
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {collection.items}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate mb-1">
                            {collection.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                            {collection.description}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ouvrir
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Frameworks */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {collection.frameworks.map((framework, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-600"
                          >
                            <Code2 className="w-3 h-3" />
                            {framework}
                          </span>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {collection.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-codeo-green/10 text-codeo-green px-2 py-0.5 rounded border border-codeo-green/20"
                          >
                            <Tag className="w-2.5 h-2.5 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                        {collection.tags.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5">
                            +{collection.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer avec créateur et date */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <img
                            src={collection.creator.avatar}
                            alt={collection.creator.name}
                            className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600"
                          />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {collection.creator.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(collection.updated)}
                        </div>
                      </div>
                    </div>

                    {/* Lien vers la collection */}
                    <div className="absolute inset-0 cursor-pointer" />
                  </div>
                </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
