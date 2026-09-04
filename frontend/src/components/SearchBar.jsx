// src/components/SearchBar.jsx
import React from 'react'
import { useTrackerStore } from '../store/useTrackerStore'

export default function SearchBar() {
  const searchTerm = useTrackerStore(state => state.searchTerm)
  const difficultyFilter = useTrackerStore(state => state.difficultyFilter)
  const setSearchTerm = useTrackerStore(state => state.setSearchTerm)
  const setDifficultyFilter = useTrackerStore(state => state.setDifficultyFilter)

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-zinc-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[rgb(245,124,6)] focus:border-transparent transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Difficulty Filter Chips */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-zinc-800 p-1 border border-slate-200 dark:border-zinc-700 rounded-xl">
        {['All', 'Easy', 'Medium', 'Hard'].map(diff => {
          const isActive = difficultyFilter === diff
          let activeClass = 'bg-[rgb(245,124,6)] text-white shadow-xs'
          if (diff === 'Easy' && isActive) activeClass = 'bg-emerald-500 text-white shadow-xs'
          if (diff === 'Medium' && isActive) activeClass = 'bg-amber-500 text-white shadow-xs'
          if (diff === 'Hard' && isActive) activeClass = 'bg-rose-500 text-white shadow-xs'

          return (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                isActive
                  ? activeClass
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-700/60'
              }`}
            >
              {diff}
            </button>
          )
        })}
      </div>
    </div>
  )
}
