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
  const [showAddSub, setShowAddSub] = useState(false)
  const [showAddQ, setShowAddQ] = useState(false)

  const updateTopic = useTrackerStore(state => state.updateTopic)
  const deleteTopic = useTrackerStore(state => state.deleteTopic)
  const addSubTopic = useTrackerStore(state => state.addSubTopic)
  const addQuestion = useTrackerStore(state => state.addQuestion)

  const subTopics = useTrackerStore(state =>
    state.subTopics.filter(st => st.topicId === topic.id).sort((a, b) => (a.position || 0) - (b.position || 0))
  )
  const directQuestions = useTrackerStore(state =>
    state.questions.filter(q => q.topicId === topic.id && !q.subTopicId).sort((a, b) => (a.position || 0) - (b.position || 0))
  )
  const allTopicQuestions = useTrackerStore(state =>
    state.questions.filter(q => q.topicId === topic.id)
  )

  const solvedCount = allTopicQuestions.filter(q => q.solved).length
  const totalCount = allTopicQuestions.length
  const progressPercent = totalCount ? Math.round((solvedCount / totalCount) * 100) : 0

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: topic.id
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!name.trim()) return
    await updateTopic(topic.id, name.trim())
    setEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete topic "${topic.name}" and all associated questions?`)) {
      await deleteTopic(topic.id)
    }
  }

  // Inline add sub-topic
  const [newSubName, setNewSubName] = useState('')
  const handleAddSub = async e => {
    e.preventDefault()
    if (!newSubName.trim()) return
    await addSubTopic(newSubName.trim(), topic.id)
    setNewSubName('')
    setShowAddSub(false)
  }

  // Inline add question
  const [newQ, setNewQ] = useState({ title: '', difficulty: 'Easy', link: '' })
  const handleAddQuestion = async e => {
    e.preventDefault()
    const { title, difficulty, link } = newQ
    if (!title.trim()) return
    await addQuestion(title.trim(), difficulty, link.trim(), topic.id, null)
    setNewQ({ title: '', difficulty: 'Easy', link: '' })
    setShowAddQ(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-xl shadow-sm border border-slate-200/90 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Topic Card Header */}
      <div className="p-4 bg-gradient-to-r from-slate-50/90 to-white border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Expand toggle, Topic Title & Stats */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              title={isOpen ? 'Collapse topic' : 'Expand topic'}
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {editing ? (
              <form onSubmit={handleSave} className="flex items-center space-x-2 flex-1 max-w-md">
                <input
                  className="w-full text-base font-bold border border-blue-400 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="text-xs text-slate-500 px-2 py-1.5">Cancel</button>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-2 truncate">
                <h2
                  className="text-base sm:text-lg font-bold text-slate-900 cursor-pointer hover:text-blue-600 truncate transition-colors"
                  onDoubleClick={() => setEditing(true)}
                  title="Double click to edit topic name"
                >
                  {topic.name}
                </h2>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {solvedCount} / {totalCount} Solved
                  </span>
                  {totalCount > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      progressPercent === 100
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {progressPercent}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions and Drag Handle */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => { setShowAddSub(!showAddSub); if (!isOpen) setIsOpen(true); }}
              title="Add Sub-topic"
              className="p-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden md:inline">Sub-topic</span>
            </button>

            <button
              onClick={() => { setShowAddQ(!showAddQ); if (!isOpen) setIsOpen(true); }}
              title="Add Problem to Topic"
              className="p-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">Question</span>
            </button>

            <button
              onClick={() => setEditing(true)}
              title="Edit topic"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              title="Delete topic"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <span
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 touch-none"
              title="Drag to reorder topic"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
              </svg>
            </span>
          </div>
        </div>

        {/* Topic Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Forms & Body */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-white">
          {/* Inline Add Sub-topic Form */}
          {showAddSub && (
            <form onSubmit={handleAddSub} className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-2 animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-semibold text-blue-900">
                <span>Create New Sub-topic under {topic.name}</span>
                <button type="button" onClick={() => setShowAddSub(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  className="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  placeholder="Sub-topic title (e.g. Kadane's Algorithm Variations)"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create Sub-topic
                </button>
              </div>
            </form>
          )}

          {/* Inline Add Question Form */}
          {showAddQ && (
            <form onSubmit={handleAddQuestion} className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-2 animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-semibold text-blue-900">
                <span>Add Question directly to {topic.name}</span>
                <button type="button" onClick={() => setShowAddQ(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  className="sm:col-span-2 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  placeholder="Question Title (e.g. Two Sum)"
                  value={newQ.title}
                  onChange={e => setNewQ({ ...newQ, title: e.target.value })}
                  autoFocus
                />
                <select
                  className="text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none bg-white"
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
                  className="flex-1 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  placeholder="Problem URL (e.g. https://leetcode.com/problems/two-sum)"
                  value={newQ.link}
                  onChange={e => setNewQ({ ...newQ, link: e.target.value })}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add Question
                </button>
              </div>
            </form>
          )}

          {/* Sub-topics list */}
          {subTopics.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sub-topics</h3>
              <SubTopicList topicId={topic.id} subTopics={subTopics} />
            </div>
          )}

          {/* Direct Questions */}
          {directQuestions.length > 0 && (
            <div className="space-y-2">
              {subTopics.length > 0 && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Problems</h3>
              )}
              <QuestionList questions={directQuestions} parentId={topic.id} parentType="topic" />
            </div>
          )}

          {subTopics.length === 0 && directQuestions.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
              No questions or sub-topics yet. Click <span className="font-semibold text-blue-600">Question</span> or <span className="font-semibold text-blue-600">Sub-topic</span> above to add one!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
