// src/components/QuestionItem.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function QuestionItem({ question }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(question.title || '')
  const [link, setLink] = useState(question.link || '')
  const [resource, setResource] = useState(question.resource || '')
  const [difficulty, setDifficulty] = useState(question.difficulty || 'Medium')

  const updateQuestion = useTrackerStore(state => state.updateQuestion)
  const deleteQuestion = useTrackerStore(state => state.deleteQuestion)
  const toggleSolved = useTrackerStore(state => state.toggleSolved)

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!title.trim()) return
    await updateQuestion(question.id, {
      title: title.trim(),
      link: link.trim(),
      resource: resource.trim(),
      difficulty
    })
    setEditing(false)
  }

  const handleDelete = async () => {
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
    opacity: isDragging ? 0.4 : 1,
  }

  const diffLower = (question.difficulty || 'Medium').toLowerCase()
  const diffBadge =
    diffLower === 'easy'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : diffLower === 'hard'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all duration-150 ${
        question.solved
          ? 'bg-slate-50/80 border-slate-200/80 text-slate-500'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm text-slate-800'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
        {/* Drag Handle */}
        <span
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-0.5 rounded touch-none"
          title="Drag to reorder question"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
          </svg>
        </span>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={!!question.solved}
          onChange={(e) => toggleSolved(question.id, e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600 transition-colors"
          title={question.solved ? 'Mark as unsolved' : 'Mark as solved'}
        />

        {/* Content */}
        {editing ? (
          <form onSubmit={handleSave} className="flex-1 flex flex-wrap items-center gap-2">
            <input
              className="flex-1 min-w-[180px] text-sm border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title"
              autoFocus
            />
            <input
              className="w-44 text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Problem URL"
            />
            <select
              className="text-xs border border-slate-300 rounded px-1.5 py-1 focus:outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button
              type="submit"
              className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
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
                className={`text-sm font-medium hover:underline truncate inline-flex items-center gap-1 ${
                  question.solved ? 'line-through text-slate-400 hover:text-slate-600' : 'text-slate-800 hover:text-blue-600'
                }`}
                title={question.title}
              >
                <span>{question.title}</span>
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <span
                onDoubleClick={() => setEditing(true)}
                className={`text-sm font-medium cursor-pointer truncate ${
                  question.solved ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
                title="Double click to edit"
              >
                {question.title}
              </span>
            )}

            {/* Video / Resource Link Badge */}
            {question.resource && (
              <a
                href={question.resource}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-100 transition-colors"
                title="View Video / Resource"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Video
              </a>
            )}

            {/* Difficulty Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${diffBadge}`}
            >
              {question.difficulty || 'Medium'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!editing && (
        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            title="Edit question"
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            title="Delete question"
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
