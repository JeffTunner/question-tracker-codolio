// src/store/useTrackerStore.js
import { create } from 'zustand'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

export const useTrackerStore = create((set, get) => ({
    topics: [],      // [{ id, name, position }]
    subTopics: [],   // [{ id, name, topicId, position }]
    questions: [],   // [{ id, title, difficulty, link, topicId, subTopicId, position }]
    loading: false,

    // ---- LOAD ----
    fetchAll: async () => {
        set({ loading: true })
        const [topics, subTopics, questions] = await Promise.all([
            api.get('/topics'), api.get('/subtopics'), api.get('/questions')
        ])
        set({ topics: topics.data, subTopics: subTopics.data, questions: questions.data, loading: false })
    },

    // ---- CRUD (pattern is identical for all 3 entities) ----
    addTopic: async (name) => {
        const res = await api.post('/topics', { name, position: get().topics.length })
        set(state => ({ topics: [...state.topics, res.data] }))
    },
    updateTopic: async (id, name) => {
        await api.put(`/topics/${id}`, { name })
        set(state => ({ topics: state.topics.map(t => t.id === id ? { ...t, name } : t) }))
    },
    deleteTopic: async (id) => {
        await api.delete(`/topics/${id}`)
        set(state => ({ topics: state.topics.filter(t => t.id !== id) }))
    },
    // addSubTopic/updateSubTopic/deleteSubTopic and
    // addQuestion/updateQuestion/deleteQuestion: same 3-line pattern, just different endpoint + payload

    // ---- REORDER (drag-and-drop) ----
    reorderTopics: async (newOrderedTopics) => {
        // newOrderedTopics = the array dnd-kit gives you after a drag, already reordered
        const withPositions = newOrderedTopics.map((t, i) => ({ ...t, position: i }))
        set({ topics: withPositions })            // optimistic: update UI instantly
        await api.put('/topics/reorder', withPositions)  // persist in background
    },
}))