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
      <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search problems or topics..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center space-x-1 bg-slate-800/80 p-1 border border-slate-700/80 rounded-lg">
        {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              difficultyFilter === diff
                ? diff === 'Easy'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : diff === 'Medium'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : diff === 'Hard'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>
    </div>
  )
}
