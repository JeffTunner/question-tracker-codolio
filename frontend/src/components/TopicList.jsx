// src/components/TopicList.jsx
import React, { useEffect } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import TopicItem from './TopicItem'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export default function TopicList() {
  const topics = useTrackerStore(state => state.topics)
  const questions = useTrackerStore(state => state.questions)
  const loading = useTrackerStore(state => state.loading)
  const fetchAll = useTrackerStore(state => state.fetchAll)
  const reorderTopics = useTrackerStore(state => state.reorderTopics)
  const searchTerm = useTrackerStore(state => state.searchTerm)
  const difficultyFilter = useTrackerStore(state => state.difficultyFilter)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = topics.findIndex(t => t.id === active.id)
      const newIndex = topics.findIndex(t => t.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrdered = arrayMove(topics, oldIndex, newIndex).map((t, idx) => ({
          ...t,
          position: idx
        }))
        reorderTopics(newOrdered)
      }
    }
  }

  // Filter topics: show topic if topic name matches OR if any question inside matches the search/difficulty filter
  const visibleTopics = topics.filter(topic => {
    if (!searchTerm && difficultyFilter === 'All') return true

    const topicNameMatches = searchTerm && topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (topicNameMatches && difficultyFilter === 'All') return true

    const topicQuestions = questions.filter(q => q.topicId === topic.id)
    const hasMatchingQuestion = topicQuestions.some(q => {
      const matchesTerm = searchTerm
        ? (q.title && q.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.link && q.link.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
      const matchesDiff = difficultyFilter === 'All' || q.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      return matchesTerm && matchesDiff
    })

    return topicNameMatches || hasMatchingQuestion
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[rgb(245,124,6)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Loading DSA Sheet...</p>
      </div>
    )
  }

  if (visibleTopics.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-[rgb(255,237,213)] dark:border-zinc-800 p-8 card-3d">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgb(255,237,213)] dark:bg-zinc-800 flex items-center justify-center text-[rgb(245,124,6)]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">No matching topics or questions found</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          {searchTerm || difficultyFilter !== 'All'
            ? 'Try adjusting your search keywords or clearing the difficulty filter.'
            : 'Get started by creating your first DSA topic above!'}
        </p>
      </div>
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibleTopics.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {visibleTopics
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map(topic => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
