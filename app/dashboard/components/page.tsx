'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Eye,
  Copy,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  Package,
  Navigation,
  FileText,
  Megaphone,
  Table,
  Plus,
  Sparkles
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ComponentType = 'all' | 'navigation' | 'forms' | 'marketing' | 'tables'
type SortOption = 'recent' | 'name' | 'framework'

interface Component {
  id: string
  name: string
  type: ComponentType
  framework: string
  thumbnail: string
  updatedAt: string
}

// Données factices
const mockComponents: Component[] = [
  { id: '1', name: 'Navigation Bar', type: 'navigation', framework: 'React', thumbnail: '', updatedAt: '2024-01-15' },
  { id: '2', name: 'Login Form', type: 'forms', framework: 'Vue', thumbnail: '', updatedAt: '2024-01-14' },
  { id: '3', name: 'Hero Section', type: 'marketing', framework: 'React', thumbnail: '', updatedAt: '2024-01-13' },
  { id: '4', name: 'Data Table', type: 'tables', framework: 'Next.js', thumbnail: '', updatedAt: '2024-01-12' },
  { id: '5', name: 'Sidebar Menu', type: 'navigation', framework: 'React', thumbnail: '', updatedAt: '2024-01-11' },
  { id: '6', name: 'Contact Form', type: 'forms', framework: 'Vue', thumbnail: '', updatedAt: '2024-01-10' },
]

const typeLabels: Record<ComponentType, string> = {
  all: 'Tous',
  navigation: 'Navigation',
  forms: 'Formulaires',
  marketing: 'Marketing',
  tables: 'Tableaux'
}

const typeIcons: Record<ComponentType, typeof Navigation> = {
  all: Package,
  navigation: Navigation,
  forms: FileText,
  marketing: Megaphone,
  tables: Table
}

export default function ComponentsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ComponentType>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [components] = useState<Component[]>(mockComponents)

  // Filtrer les composants
  const filteredComponents = components.filter(
    comp => selectedType === 'all' || comp.type === selectedType
  )

  // Trier les composants
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'framework':
        return a.framework.localeCompare(b.framework)
      case 'recent':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const handlePreview = (id: string) => {
    toast.success('Ouverture de la prévisualisation...')
  }

  const handleCopy = (id: string) => {
    toast.success('Code copié dans le presse-papiers')
  }

  const handleDelete = (id: string) => {
    toast.success('Composant supprimé')
  }

  // Si aucun composant
  if (components.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes composants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            0 composants sauvegardés
          </p>
        </div>

        {/* Onboarding contextuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center"
        >
          <div className="w-16 h-16 bg-codeo-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-codeo-green" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Votre coffre-fort est vide
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Les composants que vous générez dans le Workbench apparaîtront ici automatiquement.
          </p>
          <Button
            className="mt-6 bg-codeo-green hover:bg-codeo-green/90 text-white"
            onClick={() => router.push('/dashboard/workbench')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer mon premier composant
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes composants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {components.length} composant{components.length > 1 ? 's' : ''} sauvegardé{components.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Menu de tri */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {sortBy === 'recent' && 'Plus récents'}
                  {sortBy === 'name' && 'Nom (A-Z)'}
                  {sortBy === 'framework' && 'Framework'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Plus récents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Nom (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('framework')}>
                Framework
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bouton Nouveau */}
          <Button 
            className="bg-codeo-green hover:bg-codeo-green/90 text-white gap-2"
            onClick={() => router.push('/dashboard/workbench')}
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Barre de filtres (Chips) */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(typeLabels) as ComponentType[]).map((type) => {
          const Icon = typeIcons[type]
          const isActive = selectedType === type
          const count = type === 'all' 
            ? components.length 
            : components.filter(c => c.type === type).length

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-codeo-green text-white shadow-lg shadow-codeo-green/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-codeo-green/50 hover:text-codeo-green'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{typeLabels[type]}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }
              `}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grille de composants */}
      {sortedComponents.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Aucun composant trouvé pour ce filtre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              {/* Carte avec effet de verre */}
              <div className="
                relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700
                transition-all duration-300 overflow-hidden
                hover:border-codeo-green/50 hover:shadow-xl hover:shadow-codeo-green/10
                hover:scale-[1.02]
              ">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                  </div>
                  
                  {/* Overlay avec Preview central */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={() => handlePreview(component.id)}
                      className="bg-codeo-green hover:bg-codeo-green/90 text-white shadow-lg"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>

                  {/* Menu d'actions (More) */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleCopy(component.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copier le code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(component.id)}
                          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {component.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatDate(component.updatedAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">
                      {component.framework}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
