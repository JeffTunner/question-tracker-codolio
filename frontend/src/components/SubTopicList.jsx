// src/components/SubTopicList.jsx
import React from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SubTopicItem from './SubTopicItem'
import { useTrackerStore } from '../store/useTrackerStore'

export default function SubTopicList({ topicId, subTopics }) {
  const reorderSubTopics = useTrackerStore(state => state.reorderSubTopics)
  const allSubTopics = useTrackerStore(state => state.subTopics)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = subTopics.findIndex(st => st.id === active.id)
      const newIndex = subTopics.findIndex(st => st.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(subTopics, oldIndex, newIndex).map((st, idx) => ({
          ...st,
          position: idx
        }))
        reorderSubTopics(reordered)
      }
    }
  }

  if (!subTopics || subTopics.length === 0) return null

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={subTopics.map(st => st.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {subTopics
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map(sub => (
              <SubTopicItem key={sub.id} subTopic={sub} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
