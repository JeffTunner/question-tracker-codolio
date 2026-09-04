// src/components/QuestionList.jsx
import React from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import QuestionItem from './QuestionItem'
import { useTrackerStore } from '../store/useTrackerStore'

export default function QuestionList({ questions, parentId, parentType }) {
  const reorderQuestions = useTrackerStore(state => state.reorderQuestions)
  const searchTerm = useTrackerStore(state => state.searchTerm)
  const difficultyFilter = useTrackerStore(state => state.difficultyFilter)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id)
      const newIndex = questions.findIndex(q => q.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(questions, oldIndex, newIndex).map((q, idx) => ({
          ...q,
          position: idx
        }))
        reorderQuestions(reordered)
      }
    }
  }

  // Apply search and difficulty filters
  const filtered = questions.filter(q => {
    const matchesTerm = searchTerm
      ? (q.title && q.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (q.link && q.link.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesTerm && matchesDifficulty
  })

  if (filtered.length === 0 && questions.length > 0 && (searchTerm || difficultyFilter !== 'All')) {
    return (
      <div className="py-2 text-center text-xs text-slate-400 italic">
        No questions matching filter in this section
      </div>
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filtered.map(q => q.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {filtered
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map(question => (
              <QuestionItem key={question.id} question={question} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
