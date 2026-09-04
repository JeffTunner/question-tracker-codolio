// src/components/SubTopicItem.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import QuestionList from './QuestionList'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function SubTopicItem({ subTopic }) {
  const [isOpen, setIsOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(subTopic.name)
  const [showAddQ, setShowAddQ] = useState(false)

  const updateSubTopic = useTrackerStore(state => state.updateSubTopic)
  const deleteSubTopic = useTrackerStore(state => state.deleteSubTopic)
  const addQuestion = useTrackerStore(state => state.addQuestion)

  const questions = useTrackerStore(state =>
    state.questions
      .filter(q => q.subTopicId === subTopic.id)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
  )

  const solvedCount = questions.filter(q => q.solved).length
  const totalCount = questions.length

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!name.trim()) return
    await updateSubTopic(subTopic.id, name.trim())
    setEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete sub-topic "${subTopic.name}" and its questions?`)) {
      await deleteSubTopic(subTopic.id)
    }
  }

  // Add question form for this sub-topic
  const [newQ, setNewQ] = useState({ title: '', difficulty: 'Easy', link: '' })
  const handleAddQuestion = async e => {
    e.preventDefault()
    const { title, difficulty, link } = newQ
    if (!title.trim()) return
    await addQuestion(title.trim(), difficulty, link.trim(), subTopic.topicId, subTopic.id)
    setNewQ({ title: '', difficulty: 'Easy', link: '' })
    setShowAddQ(false)
  }

  // DnD sortable support
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subTopic.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-slate-50/70 border border-slate-200/90 rounded-lg p-3 shadow-xs hover:border-slate-300 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
            title={isOpen ? 'Collapse sub-topic' : 'Expand sub-topic'}
          >
            <svg
              className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {editing ? (
            <form onSubmit={handleSave} className="flex items-center space-x-2 flex-1">
              <input
                className="text-sm font-semibold border border-blue-400 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="text-xs text-slate-500">Cancel</button>
            </form>
          ) : (
            <div className="flex items-center space-x-2 truncate">
              <h4
                className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 truncate"
                onDoubleClick={() => setEditing(true)}
                title="Double click to edit sub-topic name"
              >
                {subTopic.name}
              </h4>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-full">
                {solvedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowAddQ(!showAddQ)}
            title="Add problem to sub-topic"
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => setEditing(true)}
            title="Edit sub-topic"
            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            title="Delete sub-topic"
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <span {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-1 touch-none" title="Drag to reorder sub-topic">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
            </svg>
          </span>
        </div>
      </div>

      {/* Inline Add Question Form */}
      {showAddQ && (
        <form onSubmit={handleAddQuestion} className="mt-3 p-3 bg-white border border-blue-200 rounded-lg space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>Add Problem to {subTopic.name}</span>
            <button type="button" onClick={() => setShowAddQ(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              className="sm:col-span-2 text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Question Title (e.g. Invert Binary Tree)"
              value={newQ.title}
              onChange={e => setNewQ({ ...newQ, title: e.target.value })}
              autoFocus
            />
            <select
              className="text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none"
              value={newQ.difficulty}
              onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Practice Link (e.g. https://leetcode.com/...)"
              value={newQ.link}
              onChange={e => setNewQ({ ...newQ, link: e.target.value })}
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {isOpen && (
        <div className="mt-2 pl-2 sm:pl-3 border-l-2 border-slate-200 space-y-1.5">
          <QuestionList questions={questions} parentId={subTopic.id} parentType="subtopic" />
        </div>
      )}
    </div>
  )
}
