// src/components/QuestionDetailDrawer.jsx
import React, { useState, useEffect } from 'react'
import { useDrawer } from '../context/DrawerContext'
import { useTrackerStore } from '../store/useTrackerStore'
import { getPlatformInfo } from '../utils/platform'

export default function QuestionDetailDrawer() {
  const { selectedQuestion, closeDrawer } = useDrawer()
  const questions = useTrackerStore(state => state.questions)
  const updateQuestion = useTrackerStore(state => state.updateQuestion)
  const toggleSolved = useTrackerStore(state => state.toggleSolved)

  // Get freshest version of question from store
  const currentQ = selectedQuestion ? questions.find(q => q.id === selectedQuestion.id) || selectedQuestion : null
  const [noteText, setNoteText] = useState('')
  const [saveStatus, setSaveStatus] = useState(false)

  useEffect(() => {
    if (currentQ) {
      setNoteText(currentQ.notes || '')
      setSaveStatus(false)
    }
  }, [currentQ?.id, currentQ?.notes])

  if (!currentQ) return null

  const platform = getPlatformInfo(currentQ.link)
  const diffLower = (currentQ.difficulty || 'Medium').toLowerCase()
  const diffColor =
    diffLower === 'easy'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
      : diffLower === 'hard'
      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'

  const handleSaveNotes = async () => {
    await updateQuestion(currentQ.id, { notes: noteText })
    setSaveStatus(true)
    setTimeout(() => setSaveStatus(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Slide-in Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-slate-200 dark:border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-zinc-800 bg-[rgb(255,237,213)]/40 dark:bg-zinc-800/40 flex items-start justify-between">
            <div className="space-y-1.5 flex-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffColor}`}>
                  {currentQ.difficulty || 'Medium'}
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                  <img src={platform.icon} alt={platform.name} className="w-3.5 h-3.5 object-contain" />
                  <span>{platform.name}</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {currentQ.title}
              </h2>
            </div>

            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              title="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Quick Status & Links Card */}
            <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 border border-slate-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Status</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!currentQ.solved}
                    onChange={(e) => toggleSolved(currentQ.id, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[rgb(245,124,6)] focus:ring-[rgb(245,124,6)] accent-[rgb(245,124,6)] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                    {currentQ.solved ? 'Solved ✅' : 'Unsolved ⏳'}
                  </span>
                </label>
              </div>

              {currentQ.link && (
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-700">
                  <a
                    href={currentQ.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white btn-3d"
                  >
                    <span>Solve on {platform.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {currentQ.resource && (
                <div>
                  <a
                    href={currentQ.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                    <span>Watch Solution Walkthrough</span>
                  </a>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[rgb(245,124,6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>My Notes & Key Insights</span>
                </label>
                {saveStatus && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                    Saved!
                  </span>
                )}
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your approach, time/space complexity, edge cases, or key takeaways..."
                rows={7}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgb(245,124,6)] focus:bg-white dark:focus:bg-zinc-900 transition-all font-mono leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white btn-3d"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-center text-xs text-slate-400">
            Codolio Question Detail • Press anywhere outside to close
          </div>
        </div>
      </div>
    </div>
  )
}
