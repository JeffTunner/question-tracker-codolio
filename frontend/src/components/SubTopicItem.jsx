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

  const updateSubTopic = useTrackerStore(state => state.updateSubTopic)
  const deleteSubTopic = useTrackerStore(state => state.deleteSubTopic)
  const addQuestion = useTrackerStore(state => state.addQuestion)

  const questions = useTrackerStore(state =>
    state.questions
      .filter(q => q.subTopicId === subTopic.id)
      .sort((a, b) => a.position - b.position)
  )

  const handleSave = async () => {
    await updateSubTopic(subTopic.id, name)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Delete this sub‑topic and its questions?')) {
      await deleteSubTopic(subTopic.id)
    }
  }

  // Add question form for this sub‑topic
  const [newQ, setNewQ] = useState({ title: '', difficulty: 'Easy', link: '' })
  const handleAddQuestion = async e => {
    e.preventDefault()
    const { title, difficulty, link } = newQ
    if (!title.trim()) return
    await addQuestion(title.trim(), difficulty, link.trim(), subTopic.topicId, subTopic.id)
    setNewQ({ title: '', difficulty: 'Easy', link: '' })
  }

  // DnD sortable support (drag handle)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: subTopic.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-gray-50 rounded p-3 border">
      <div className="flex items-center justify-between" >
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsOpen(!isOpen)} className="text-sm">{isOpen ? '▼' : '▶'}</button>
          {editing ? (
            <input
              className="border rounded px-2 py-1"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <h4 className="font-medium" onDoubleClick={() => setEditing(true)}>{subTopic.name}</h4>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setEditing(true)} title="Edit" className="text-gray-600 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" /></svg>
          </button>
          <button onClick={handleDelete} title="Delete" className="text-gray-600 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <span {...listeners} className="cursor-move text-gray-400" title="Drag to reorder">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="mt-3 space-y-2">
          <QuestionList questions={questions} parentId={subTopic.id} parentType="subtopic" />
          <form onSubmit={handleAddQuestion} className="flex flex-col space-y-2 mt-2">
            <input className="border rounded px-2 py-1" placeholder="Title" value={newQ.title} onChange={e => setNewQ({ ...newQ, title: e.target.value })} />
            <input className="border rounded px-2 py-1" placeholder="Link" value={newQ.link} onChange={e => setNewQ({ ...newQ, link: e.target.value })} />
            <select className="border rounded px-2 py-1" value={newQ.difficulty} onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded self-start">Add Question</button>
          </form>
        </div>
      )}
    </div>
  )
}
