// src/components/TopicItem.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import SubTopicList from './SubTopicList'
import QuestionList from './QuestionList'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TopicItem({ topic }) {
  const [isOpen, setIsOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(topic.name)
  const updateTopic = useTrackerStore(state => state.updateTopic)
  const deleteTopic = useTrackerStore(state => state.deleteTopic)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const addSubTopic = useTrackerStore(state => state.addSubTopic)
  const addQuestion = useTrackerStore(state => state.addQuestion)

  const subTopics = useTrackerStore(state =>
    state.subTopics.filter(st => st.topicId === topic.id).sort((a, b) => a.position - b.position)
  )
  const questions = useTrackerStore(state =>
    state.questions.filter(q => q.topicId === topic.id && !q.subTopicId).sort((a, b) => a.position - b.position)
  )

  const solvedCount = useTrackerStore(state =>
    state.questions.filter(q => q.topicId === topic.id && q.solved).length
  )
  const totalCount = useTrackerStore(state =>
    state.questions.filter(q => q.topicId === topic.id).length
  )

  const handleSave = async () => {
    await updateTopic(topic.id, name)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Delete this topic and all its sub‑topics/questions?')) {
      await deleteTopic(topic.id)
    }
  }

  // Inline add sub‑topic form
  const [newSubName, setNewSubName] = useState('')
  const handleAddSub = async e => {
    e.preventDefault()
    if (!newSubName.trim()) return
    await addSubTopic(newSubName.trim(), topic.id)
    setNewSubName('')
  }

  // Inline add question form (no sub‑topic)
  const [newQ, setNewQ] = useState({ title: '', difficulty: 'Easy', link: '' })
  const handleAddQuestion = async e => {
    e.preventDefault()
    const { title, difficulty, link } = newQ
    if (!title.trim()) return
    await addQuestion(title.trim(), difficulty, link.trim(), topic.id, null)
    setNewQ({ title: '', difficulty: 'Easy', link: '' })
  }

  const progressPercent = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
            {isOpen ? '▼' : '▶'}
          </button>
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
            <h2 className="text-xl font-semibold" onDoubleClick={() => setEditing(true)}>
              {topic.name}
            </h2>
          )}
        </div>
        <div className="flex items-center space-x-2">
  <span {...listeners} className="cursor-move text-gray-400" title="Drag to reorder">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  </span>
  <button onClick={() => setEditing(true)} title="Edit" className="text-gray-600 hover:text-blue-600">
    {/* Pencil Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
    </svg>
  </button>
  <button onClick={handleDelete} title="Delete" className="text-gray-600 hover:text-red-600">
    {/* Trash Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Sub‑topics */}
          <div className="border-l-2 pl-2">
            <h3 className="font-medium mb-2">Sub‑topics</h3>
            <SubTopicList topicId={topic.id} subTopics={subTopics} />
            <form onSubmit={handleAddSub} className="flex items-center space-x-2 mt-2">
              <input
                className="flex-1 border rounded px-2 py-1"
                placeholder="New sub‑topic"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                Add
              </button>
            </form>
          </div>

          {/* Questions without sub‑topic */}
          <div className="border-l-2 pl-2 mt-4">
            <h3 className="font-medium mb-2">Questions</h3>
            <QuestionList
              questions={questions}
              parentId={topic.id}
              parentType="topic"
            />
            <form onSubmit={handleAddQuestion} className="flex flex-col space-y-2 mt-2">
              <input
                className="border rounded px-2 py-1"
                placeholder="Question title"
                value={newQ.title}
                onChange={e => setNewQ({ ...newQ, title: e.target.value })}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Link"
                value={newQ.link}
                onChange={e => setNewQ({ ...newQ, link: e.target.value })}
              />
              <select
                className="border rounded px-2 py-1"
                value={newQ.difficulty}
                onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded self-start">
                Add Question
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
