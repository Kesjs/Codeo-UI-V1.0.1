'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, ChevronDown, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm relative">
          <User className="h-4 w-4 text-slate-600" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-codeo-green border-2 border-white rounded-full" />
        </div>
        <span className="hidden md:inline-flex items-center text-sm font-medium text-slate-700">
          Ken Kennedy
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in-80">
          <div className="p-4 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">Ken Kennedy</p>
            <p className="text-xs text-slate-500">ken@example.com</p>
            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-codeo-green/10 text-codeo-green">
              Early Adopter
            </span>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-4 w-4 text-slate-500" />
              Paramètres du compte
            </Link>
            <Link
              href="/help"
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="mr-3 h-4 w-4 text-slate-500" />
              Aide & Support
            </Link>
          </div>
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-slate-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
