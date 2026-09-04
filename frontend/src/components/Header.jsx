// src/components/Header.jsx
import React from 'react'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">Question Tracker</h1>
      <SearchBar />
    </header>
  )
}
