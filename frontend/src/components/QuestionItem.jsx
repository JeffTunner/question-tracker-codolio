// src/components/QuestionItem.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import { useDrawer } from '../context/DrawerContext'
import { getPlatformInfo } from '../utils/platform'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function QuestionItem({ question }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(question.title || '')
  const [link, setLink] = useState(question.link || '')
  const [difficulty, setDifficulty] = useState(question.difficulty || 'Medium')

  const updateQuestion = useTrackerStore(state => state.updateQuestion)
  const deleteQuestion = useTrackerStore(state => state.deleteQuestion)
  const toggleSolved = useTrackerStore(state => state.toggleSolved)
  const { openDrawer } = useDrawer()

  const platform = getPlatformInfo(question.link)

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!title.trim()) return
    await updateQuestion(question.id, {
      title: title.trim(),
      link: link.trim(),
      difficulty
    })
    setEditing(false)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete question "${question.title}"?`)) {
      await deleteQuestion(question.id)
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  const diffLower = (question.difficulty || 'Medium').toLowerCase()
  const diffBadge =
    diffLower === 'easy'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
      : diffLower === 'hard'
      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'

  const handleRowClick = (e) => {
    // Open drawer when clicking the row background (unless clicking input, button, link, or during edit)
    if (editing) return
    const tag = e.target.tagName.toLowerCase()
    if (tag === 'input' || tag === 'button' || tag === 'a' || tag === 'select' || e.target.closest('button') || e.target.closest('a')) {
      return
    }
    openDrawer(question)
  }

  return (
    <div
      id={`q-${question.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={handleRowClick}
      className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
        question.solved
          ? 'bg-slate-50/70 dark:bg-zinc-900/60 border-slate-200/70 dark:border-zinc-800/80 text-slate-400 dark:text-zinc-500'
          : 'bg-white dark:bg-zinc-800/90 border-slate-200 dark:border-zinc-700/80 hover:border-[rgb(245,124,6)]/40 hover:bg-[rgb(255,237,213)]/20 dark:hover:bg-zinc-800 shadow-2xs hover:shadow-xs text-slate-800 dark:text-zinc-100'
      }`}
    >
      <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
        {/* Drag Handle */}
        <span
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-300 p-0.5 rounded touch-none flex-shrink-0"
          title="Drag to reorder"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
          </svg>
        </span>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={!!question.solved}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => toggleSolved(question.id, e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 dark:border-zinc-600 text-[rgb(245,124,6)] focus:ring-[rgb(245,124,6)] accent-[rgb(245,124,6)] cursor-pointer flex-shrink-0"
          title={question.solved ? 'Mark as unsolved' : 'Mark as solved'}
        />

        {/* Platform Icon */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
          title={`Platform: ${platform.name}`}
        >
          <img
            src={platform.icon}
            alt={platform.name}
            className="w-4 h-4 object-contain rounded-xs"
          />
        </div>

        {/* Question Title & Content */}
        {editing ? (
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex flex-wrap items-center gap-2"
          >
            <input
              className="flex-1 min-w-[160px] text-xs sm:text-sm border border-[rgb(245,124,6)] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[rgb(245,124,6)] bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title"
              autoFocus
            />
            <input
              className="w-36 text-xs border border-slate-300 dark:border-zinc-700 rounded-lg px-2 py-1 focus:outline-none bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Problem URL"
            />
            <select
              className="text-xs border border-slate-300 dark:border-zinc-700 rounded-lg px-1.5 py-1 focus:outline-none bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button
              type="submit"
              className="px-2 py-1 text-xs font-bold bg-[rgb(245,124,6)] text-white rounded-lg hover:bg-orange-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {question.link ? (
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`text-xs sm:text-sm font-semibold hover:underline truncate inline-flex items-center gap-1 ${
                  question.solved
                    ? 'line-through text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                    : 'text-slate-800 dark:text-zinc-100 hover:text-[rgb(245,124,6)]'
                }`}
                title={question.title}
              >
                <span>{question.title}</span>
                <svg className="w-3 h-3 flex-shrink-0 text-slate-400 group-hover:text-[rgb(245,124,6)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <span
                onDoubleClick={() => setEditing(true)}
                className={`text-xs sm:text-sm font-semibold truncate ${
                  question.solved ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-100'
                }`}
                title="Double click to edit"
              >
                {question.title}
              </span>
            )}

            {/* Notes Indicator Pill */}
            {question.notes && (
              <span
                onClick={(e) => { e.stopPropagation(); openDrawer(question); }}
                className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                title="Has personal notes"
              >
                📝 Notes
              </span>
            )}

            {/* Video Link */}
            {question.resource && (
              <a
                href={question.resource}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
                title="Watch video solution"
              >
                <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Video
              </a>
            )}

            {/* Difficulty Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${diffBadge}`}>
              {question.difficulty || 'Medium'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!editing && (
        <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {/* Detail drawer button */}
          <button
            onClick={(e) => { e.stopPropagation(); openDrawer(question); }}
            title="Open question details & notes"
            className="p-1 rounded-lg text-slate-400 hover:text-[rgb(245,124,6)] hover:bg-[rgb(255,237,213)] dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            title="Edit question"
            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            title="Delete question"
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
