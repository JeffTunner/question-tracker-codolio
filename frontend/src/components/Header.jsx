// src/components/Header.jsx
import React from 'react'
import SearchBar from './SearchBar'
import { useTrackerStore } from '../store/useTrackerStore'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const questions = useTrackerStore(state => state.questions)
  const backendConnected = useTrackerStore(state => state.backendConnected)
  const { darkMode, toggleDarkMode } = useTheme()

  const solvedCount = questions.filter(q => q.solved).length
  // Client-side derived streak count (e.g. at least 1 solved gives active streak, proportional to solved)
  const streakCount = solvedCount > 0 ? Math.min(Math.max(Math.floor(solvedCount / 3), 1), 30) : 0

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-xs sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Brand Logo & Wordmark & Streak */}
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="flex items-center space-x-2.5">
              <img
                src="/codolio_logo.svg"
                alt="Codolio Logo"
                className="w-9 h-9 object-contain rounded-xl p-1 bg-[rgb(255,237,213)] dark:bg-zinc-800 border border-[rgb(245,124,6)]/30 shadow-xs"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight">
                    <span className="text-slate-900 dark:text-white">Cod</span>
                    <span className="text-[rgb(245,124,6)]">olio</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${backendConnected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {backendConnected ? 'Connected' : 'Local'}
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Pill & Theme Toggle (Mobile/Desktop) */}
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[rgb(255,237,213)] dark:bg-zinc-800 border border-[rgb(245,124,6)]/40 shadow-xs"
                title="Current Streak"
              >
                <span className="text-sm">🔥</span>
                <span className="text-xs font-black text-[rgb(245,124,6)]">{streakCount}</span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors shadow-xs"
                title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* SearchBar */}
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
