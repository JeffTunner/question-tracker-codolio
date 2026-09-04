// src/components/TopicList.jsx
import React, { useEffect } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import TopicItem from './TopicItem'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export default function TopicList() {
  const topics = useTrackerStore(state => state.topics)
  const fetchAll = useTrackerStore(state => state.fetchAll)
  const reorderTopics = useTrackerStore(state => state.reorderTopics)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = topics.findIndex(t => t.id === active.id)
      const newIndex = topics.findIndex(t => t.id === over.id)
      const newOrdered = arrayMove(topics, oldIndex, newIndex)
      reorderTopics(newOrdered)
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={topics.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {topics
            .sort((a, b) => a.position - b.position)
            .map(topic => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
