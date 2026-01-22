'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SearchResult {
  id: string
  type: 'project' | 'component' | 'collection' | 'user' | 'setting'
  title: string
  description: string
  path: string
  metadata?: {
    framework?: string
    efficiency?: number
    date?: string
    tags?: string[]
  }
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  isSearching: boolean
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// Données mock pour la recherche globale
const mockGlobalData: SearchResult[] = [
  // Projets
  { id: '1', type: 'project', title: 'Système Analytics v2', description: 'Dashboard analytics avec React et Tailwind', path: '/dashboard', metadata: { framework: 'React', efficiency: 98, date: '15 Jan 2026', tags: ['dashboard', 'analytics'] } },
  { id: '2', type: 'project', title: 'Shopify Checkout UI', description: 'Interface de paiement e-commerce', path: '/dashboard', metadata: { framework: 'Next.js', efficiency: 94, date: '10 Jan 2026', tags: ['ecommerce', 'payment'] } },
  { id: '3', type: 'project', title: 'Dashboard Admin RH', description: 'Système de gestion RH', path: '/dashboard', metadata: { framework: 'Vue', efficiency: 95, date: '05 Jan 2026', tags: ['admin', 'hr'] } },
  
  // Composants
  { id: '4', type: 'component', title: 'Button Component', description: 'Bouton réutilisable avec variants', path: '/dashboard/components', metadata: { framework: 'React', tags: ['ui', 'button'] } },
  { id: '5', type: 'component', title: 'Modal Dialog', description: 'Modal accessible et responsive', path: '/dashboard/components', metadata: { framework: 'React', tags: ['modal', 'dialog'] } },
  { id: '6', type: 'component', title: 'Data Table', description: 'Tableau de données avec tri et filtrage', path: '/dashboard/components', metadata: { framework: 'Vue', tags: ['table', 'data'] } },
  
  // Collections
  { id: '7', type: 'collection', title: 'UI Kit Complete', description: 'Collection complète d\'interfaces', path: '/dashboard/collections', metadata: { tags: ['ui-kit', 'complete'] } },
  { id: '8', type: 'collection', title: 'E-commerce Templates', description: 'Templates boutique en ligne', path: '/dashboard/collections', metadata: { tags: ['ecommerce', 'templates'] } },
  
  // Utilisateurs (pour plan Business)
  { id: '9', type: 'user', title: 'Marie Dubois', description: 'Développeuse Frontend Senior', path: '/dashboard/team', metadata: { tags: ['developer', 'frontend'] } },
  { id: '10', type: 'user', title: 'Thomas Martin', description: 'UX Designer', path: '/dashboard/team', metadata: { tags: ['designer', 'ux'] } },
  
  // Paramètres
  { id: '11', type: 'setting', title: 'API Keys', description: 'Gestion des clés API', path: '/dashboard/api', metadata: { tags: ['api', 'security'] } },
  { id: '12', type: 'setting', title: 'Webhooks Configuration', description: 'Configuration des webhooks', path: '/dashboard/api', metadata: { tags: ['webhooks', 'integration'] } },
]

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Recherche globale en temps réel
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    // Simuler un délai de recherche
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const filtered = mockGlobalData.filter(item => {
        // Recherche dans le titre
        if (item.title.toLowerCase().includes(query)) return true
        // Recherche dans la description
        if (item.description.toLowerCase().includes(query)) return true
        // Recherche dans les tags
        if (item.metadata?.tags?.some(tag => tag.toLowerCase().includes(query))) return true
        // Recherche dans le framework
        if (item.metadata?.framework?.toLowerCase().includes(query)) return true
        // Recherche dans le type
        if (item.type.toLowerCase().includes(query)) return true
        
        return false
      })

      // Trier par pertinence (titre correspondant en premier)
      const sorted = filtered.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(query)
        const bTitleMatch = b.title.toLowerCase().includes(query)
        
        if (aTitleMatch && !bTitleMatch) return -1
        if (!aTitleMatch && bTitleMatch) return 1
        
        return 0
      })

      setSearchResults(sorted.slice(0, 8)) // Limiter à 8 résultats
      setIsSearching(false)
    }, 300) // Délai de 300ms pour éviter trop de recherches

    return () => clearTimeout(timer)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
