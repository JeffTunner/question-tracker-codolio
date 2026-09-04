// src/components/SearchBar.jsx
import React from 'react'
import { useTrackerStore } from '../store/useTrackerStore'

export default function SearchBar() {
  const searchTerm = useTrackerStore(state => state.searchTerm)
  const difficultyFilter = useTrackerStore(state => state.difficultyFilter)
  const setSearchTerm = useTrackerStore(state => state.setSearchTerm)
  const setDifficultyFilter = useTrackerStore(state => state.setDifficultyFilter)

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search questions..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="px-2 py-1 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={difficultyFilter}
        onChange={e => setDifficultyFilter(e.target.value)}
        className="px-2 py-1 rounded bg-gray-700 text-white focus:outline-none"
      >
        <option value="All">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  )
}
