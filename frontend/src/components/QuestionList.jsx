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
    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id)
      const newIndex = questions.findIndex(q => q.id === over.id)
      const newOrdered = arrayMove(questions, oldIndex, newIndex)
      reorderQuestions(newOrdered)
    }
  }

  // Apply search and difficulty filters
  const filtered = questions.filter(q => {
    const matchesTerm = searchTerm
      ? q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.link && q.link.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter
    return matchesTerm && matchesDifficulty
  })

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filtered.map(q => q.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {filtered
            .sort((a, b) => a.position - b.position)
            .map(question => (
              <QuestionItem key={question.id} question={question} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
