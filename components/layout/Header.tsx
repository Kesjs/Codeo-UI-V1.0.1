'use client'

import Link from 'next/link'
import { Menu, X, LayoutDashboard, Sparkles, Zap, CreditCard, ChevronDown, FileText, HelpCircle, Newspaper, BookOpen } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Logo from '@/components/Logo'

/**
 * Header Codeo UI - Version Finale Optimisée
 * Modifs : Bordure scroll subtile, nettoyage des liens, lueur logo statique.
 */

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const resourcesButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Nettoyage lors du démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen])

  // Fermer le dropdown ressources lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      setIsResourcesOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  // Cleanup du timeout lors du démontage
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Scroll spy pour détecter la section active
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['workflow-section', 'engine', 'pricing']
      const scrollPosition = window.scrollY + 150 // Offset pour le header

      let currentSection = ''

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId)
        if (section) {
          const sectionTop = section.offsetTop - 150 // Ajuster pour l'offset
          const sectionHeight = section.offsetHeight

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId
          }
        }
      })

      console.log('Scroll position:', scrollPosition, 'Current section:', currentSection)
      if (currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    // Délai pour s'assurer que le DOM est chargé
    const timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Appeler une fois au chargement
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const underlineClass = "relative no-underline outline-none border-none ring-0 decoration-transparent after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-codeo-green after:transition-all after:duration-300 hover:after:w-full hover:text-codeo-green";

  // Gestion du dropdown ressources avec délai
  const openResourcesDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (resourcesButtonRef.current) {
      const rect = resourcesButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + rect.width / 2 + window.scrollX
      })
    }
    setIsResourcesOpen(true)
  }

  const closeResourcesDropdown = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsResourcesOpen(false)
    }, 150) // Délai de 150ms pour permettre la transition
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 border-b-2 border-slate-200/80 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl py-1 shadow-sm' 
        : 'bg-white py-3'
    }`}>
      <div className="w-full px-6 lg:px-8 xl:px-12 relative h-16">
        {/* --- ZONE LOGO - GAUCHE --- */}
        <div className="absolute left-0 top-0 h-full flex items-center">
          <Link
            href="/"
            className="relative flex items-center transition-transform hover:scale-[1.02] outline-none border-none decoration-transparent ring-0 focus:ring-0"
          >
            {/* Lueur fixe derrière le logo */}
            <div className="absolute inset-0 bg-codeo-green/15 blur-2xl rounded-full scale-150" />

            <div className="relative w-48 h-12 flex items-center justify-start overflow-hidden">
              <Logo />
            </div>
          </Link>
        </div>

        {/* --- NAVIGATION DESKTOP - CENTRE --- */}
        <nav className="hidden md:flex items-center gap-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <a
            href="#workflow-section"
            className={`flex items-center gap-2.5 text-sm font-bold transition-colors decoration-transparent ${
              activeSection === 'workflow-section'
                ? 'text-codeo-green'
                : `text-slate-700 ${underlineClass}`
            }`}
          >
            <Zap className="h-4 w-4" /> Workflow
          </a>

          <a
            href="#engine"
            className={`flex items-center gap-2.5 text-sm font-bold transition-colors decoration-transparent ${
              activeSection === 'engine'
                ? 'text-codeo-green'
                : `text-slate-700 ${underlineClass}`
            }`}
          >
            <Sparkles className="h-4 w-4" /> Engine
          </a>

          <a
            href="#pricing"
            className={`flex items-center gap-2.5 text-sm font-bold transition-colors decoration-transparent ${
              activeSection === 'pricing'
                ? 'text-codeo-green'
                : `text-slate-700 ${underlineClass}`
            }`}
          >
            <CreditCard className="h-4 w-4" /> Pricing
          </a>

          {/* DROPDOWN RESSOURCES */}
          <div
            className="relative resources-dropdown"
            onMouseEnter={openResourcesDropdown}
            onMouseLeave={closeResourcesDropdown}
          >
            <button
              ref={resourcesButtonRef}
              className={`flex items-center gap-2.5 text-sm font-bold transition-colors decoration-transparent ${
                isResourcesOpen
                  ? 'text-codeo-green'
                  : `text-slate-700 ${underlineClass}`
              }`}
            >
              <BookOpen className="h-4 w-4" /> Ressources
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - Portal */}
            {isResourcesOpen && createPortal(
              <div
                className="fixed w-52 bg-white rounded-xl shadow-2xl border border-slate-200/50 py-3 backdrop-blur-sm opacity-100 scale-100 transition-all duration-200 ease-out z-[9999]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  transform: 'translateX(-50%)'
                }}
                onMouseEnter={openResourcesDropdown}
                onMouseLeave={closeResourcesDropdown}
              >
                <a
                  href="/docs"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 hover:text-codeo-green hover:bg-slate-50/80 transition-all duration-200 no-underline"
                  onClick={() => setIsResourcesOpen(false)}
                >
                  <FileText className="h-4 w-4" />
                  Documentation
                </a>
                <a
                  href="/help"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 hover:text-codeo-green hover:bg-slate-50/80 transition-all duration-200 no-underline"
                  onClick={() => setIsResourcesOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" />
                  Aide
                </a>
                <a
                  href="/blog"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-700 hover:text-codeo-green hover:bg-slate-50/80 transition-all duration-200 no-underline"
                  onClick={() => setIsResourcesOpen(false)}
                >
                  <Newspaper className="h-4 w-4" />
                  Blog
                </a>
              </div>,
              document.body
            )}
          </div>
        </nav>

        {/* --- ACTIONS DESKTOP - DROITE --- */}
        <div className="hidden md:absolute md:right-6 md:top-0 md:h-full md:flex md:items-center md:gap-5">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-codeo-green bg-transparent hover:bg-slate-50 border border-slate-200 hover:border-codeo-green/30 rounded-xl transition-all duration-300 no-underline outline-none ring-0"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="px-7 py-3 bg-codeo-green text-white text-sm font-extrabold rounded-xl shadow-[0_8px_20px_-6px_rgba(0,209,255,0.3)] hover:shadow-[0_8px_25px_-4px_rgba(0,209,255,0.4)] hover:bg-opacity-95 hover:-translate-y-0.5 transition-all duration-300 no-underline outline-none border-none ring-0 active:scale-95"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/workspace"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all no-underline shadow-lg shadow-slate-200"
            >
              <LayoutDashboard className="h-4 w-4 text-codeo-green" /> Workspace
            </Link>
          )}
        </div>

        {/* --- MOBILE TOGGLE - DROITE --- */}
        <button
          className="md:hidden absolute right-0 top-0 h-full flex items-center p-2 text-slate-700 outline-none border-none ring-0 focus:ring-0 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-7 w-7 animate-in fade-in duration-200" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* --- FOND SEMI-TRANSPARENT --- */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* --- MENU MOBILE --- */}
      {isMenuOpen && (
        <div className="md:hidden fixed right-0 top-0 h-screen w-4/5 max-w-sm bg-white z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
          {/* Bouton de fermeture */}
          <button 
            className="absolute right-6 top-6 p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <Link href="#workflow" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-extrabold text-slate-900 border-b border-slate-50 py-4 no-underline outline-none decoration-transparent">
            <Zap className="text-codeo-green h-6 w-6" /> Workflow
          </Link>
          <Link href="#engine" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-extrabold text-slate-900 border-b border-slate-50 py-4 no-underline outline-none decoration-transparent">
            <Sparkles className="text-codeo-green h-6 w-6" /> Engine
          </Link>
          <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-extrabold text-slate-900 border-b border-slate-50 py-4 no-underline outline-none decoration-transparent">
            <CreditCard className="text-codeo-green h-6 w-6" /> Pricing
          </Link>
          
          <div className="mt-auto flex flex-col gap-3">
            <Link 
              href="/login" 
              onClick={() => setIsMenuOpen(false)} 
              className="w-full py-4 text-center font-extrabold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl no-underline outline-none hover:bg-slate-50 hover:text-codeo-green active:bg-slate-100 transition-colors duration-200"
            >
              Log In
            </Link>
            <Link 
              href="/register" 
              onClick={() => setIsMenuOpen(false)} 
              className="w-full py-4 text-center font-extrabold text-white bg-codeo-green rounded-2xl shadow-lg no-underline outline-none hover:bg-codeo-green/90 active:bg-codeo-green/80 transition-colors duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header