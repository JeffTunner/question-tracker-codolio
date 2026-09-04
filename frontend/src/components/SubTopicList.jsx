// src/components/SubTopicList.jsx
import React from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SubTopicItem from './SubTopicItem'
import { useTrackerStore } from '../store/useTrackerStore'

export default function SubTopicList({ topicId, subTopics }) {
  const reorderSubTopics = useTrackerStore(state => state.reorderSubTopics)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = subTopics.findIndex(st => st.id === active.id)
      const newIndex = subTopics.findIndex(st => st.id === over.id)
      const newOrdered = arrayMove(subTopics, oldIndex, newIndex)
      reorderSubTopics(newOrdered)
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={subTopics.map(st => st.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {subTopics
            .sort((a, b) => a.position - b.position)
            .map(sub => (
              <SubTopicItem key={sub.id} subTopic={sub} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
