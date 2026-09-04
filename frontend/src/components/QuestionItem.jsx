// src/components/QuestionItem.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function QuestionItem({ question }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(question.title)
  const [link, setLink] = useState(question.link)
  const [difficulty, setDifficulty] = useState(question.difficulty)

  const updateQuestion = useTrackerStore(state => state.updateQuestion)
  const deleteQuestion = useTrackerStore(state => state.deleteQuestion)
  const toggleSolved = useTrackerStore(state => state.toggleSolved)

  const handleSave = async () => {
    await updateQuestion(question.id, { title, link, difficulty })
    setEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Delete this question?')) {
      await deleteQuestion(question.id)
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-gray-50 rounded p-2 border flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span {...listeners} className="cursor-move text-gray-400" title="Drag to reorder">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
        </span>
        <input type="checkbox" checked={!!question.solved} onChange={e => toggleSolved(question.id, e.target.checked)} className="h-4 w-4" />
        {editing ? (
          <input
            className="border rounded px-1 py-0"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        ) : (
          <a href={question.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onDoubleClick={() => setEditing(true)}>
            {question.title}
          </a>
        )}
        <span className="px-1 py-0 text-sm bg-gray-200 rounded">{question.difficulty}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => setEditing(true)} title="Edit" className="text-gray-600 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" /></svg>
        </button>
        <button onClick={handleDelete} title="Delete" className="text-gray-600 hover:text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  )
}
