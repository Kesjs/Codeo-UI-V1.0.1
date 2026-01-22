'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  dashboardBg: string
}

interface ThemeSettings {
  colors: ThemeColors
  radius: number
  spacingScale: number
}

interface ThemeContextType {
  theme: ThemeSettings
  updateColor: (key: keyof ThemeColors, value: string) => void
  updateRadius: (value: number) => void
  updateSpacingScale: (value: number) => void
  resetTheme: () => void
  exportTailwindConfig: () => string
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: 'hsl(123.8, 69.2%, 50.4%)', // Codeo Green
    secondary: 'hsl(220, 14.3%, 95.9%)',
    accent: 'hsl(220, 14.3%, 95.9%)',
    dashboardBg: 'rgba(44, 255, 0, 0.04)' // Codeo Light BG
  },
  radius: 32, // Soft Premium default
  spacingScale: 1 // Base scale multiplier
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('codeo-theme')
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme(parsedTheme)
      } catch (error) {
        console.error('Erreur lors du chargement du thème:', error)
      }
    }
  }, [])

  // Appliquer les variables CSS dans le :root
  useEffect(() => {
    const root = document.documentElement
    
    // Appliquer les couleurs
    root.style.setProperty('--primary', theme.colors.primary)
    root.style.setProperty('--secondary', theme.colors.secondary)
    root.style.setProperty('--accent', theme.colors.accent)
    root.style.setProperty('--dashboard-bg', theme.colors.dashboardBg)
    
    // Appliquer l'arrondi
    root.style.setProperty('--radius', `${theme.radius}px`)
    
    // Appliquer l'échelle d'espacement
    root.style.setProperty('--spacing-scale', theme.spacingScale.toString())
    
    // Sauvegarder dans localStorage
    localStorage.setItem('codeo-theme', JSON.stringify(theme))
  }, [theme])

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }))
  }

  const updateRadius = (value: number) => {
    setTheme(prev => ({
      ...prev,
      radius: value
    }))
  }

  const updateSpacingScale = (value: number) => {
    setTheme(prev => ({
      ...prev,
      spacingScale: value
    }))
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
  }

  const exportTailwindConfig = () => {
    const config = {
      theme: {
        extend: {
          colors: {
            primary: theme.colors.primary,
            secondary: theme.colors.secondary,
            accent: theme.colors.accent,
            'dashboard-bg': theme.colors.dashboardBg
          },
          borderRadius: {
            'DEFAULT': `${theme.radius}px`,
            'theme': `${theme.radius}px`
          },
          spacing: {
            'scale': `${theme.spacingScale}rem`
          }
        }
      }
    }
    
    return `module.exports = ${JSON.stringify(config, null, 2)}`
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      updateColor,
      updateRadius,
      updateSpacingScale,
      resetTheme,
      exportTailwindConfig
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
