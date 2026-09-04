// src/components/Header.jsx
import React from 'react'
import SearchBar from './SearchBar'
import { useTrackerStore } from '../store/useTrackerStore'

export default function Header() {
  const questions = useTrackerStore(state => state.questions)
  const backendConnected = useTrackerStore(state => state.backendConnected)

  const total = questions.length
  const solved = questions.filter(q => q.solved).length
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0

  const easyTotal = questions.filter(q => q.difficulty?.toLowerCase() === 'easy').length
  const easySolved = questions.filter(q => q.difficulty?.toLowerCase() === 'easy' && q.solved).length

  const medTotal = questions.filter(q => q.difficulty?.toLowerCase() === 'medium').length
  const medSolved = questions.filter(q => q.difficulty?.toLowerCase() === 'medium' && q.solved).length

  const hardTotal = questions.filter(q => q.difficulty?.toLowerCase() === 'hard').length
  const hardSolved = questions.filter(q => q.difficulty?.toLowerCase() === 'hard' && q.solved).length

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl sticky top-0 z-50 backdrop-blur-md bg-slate-900/90">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src="/codolio_logo.svg"
              alt="Codolio Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-md bg-slate-800/80 p-1 border border-slate-700/60"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Codolio Question Tracker
                </h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  backendConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {backendConnected ? 'API Connected' : 'Local Seed'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Track, organize & master your DSA interview preparation</p>
            </div>
          </div>

          <SearchBar />
        </div>

        {/* Progress & Stats Card */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 font-medium">
              <span>Overall Progress</span>
              <span className="text-blue-400 font-bold">{percent}%</span>
            </div>
            <div className="mt-2 w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-1 text-slate-300 font-semibold">{solved} / {total} Solved</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-emerald-400 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span> Easy
            </span>
            <div className="text-lg font-bold text-slate-100">{easySolved} <span className="text-xs font-normal text-slate-400">/ {easyTotal}</span></div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${easyTotal ? (easySolved / easyTotal) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-amber-400 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span> Medium
            </span>
            <div className="text-lg font-bold text-slate-100">{medSolved} <span className="text-xs font-normal text-slate-400">/ {medTotal}</span></div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${medTotal ? (medSolved / medTotal) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-rose-400 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-400 mr-1.5"></span> Hard
            </span>
            <div className="text-lg font-bold text-slate-100">{hardSolved} <span className="text-xs font-normal text-slate-400">/ {hardTotal}</span></div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-rose-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${hardTotal ? (hardSolved / hardTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
