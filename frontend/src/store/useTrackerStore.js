// src/store/useTrackerStore.js
import { create } from 'zustand'
import axios from 'axios'
import sampleData from '../data/sample-data.json'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

export const useTrackerStore = create((set, get) => ({
    topics: [],      // [{ id, name, position }]
    subTopics: [],   // [{ id, name, topicId, position }]
    questions: [],   // [{ id, title, difficulty, link, topicId, subTopicId, position, solved? }]
    loading: false,

    // ---- LOAD ----
    fetchAll: async () => {
        set({ loading: true })
        try {
            const [topicsRes, subTopicsRes, questionsRes] = await Promise.all([
                api.get('/topics'),
                api.get('/subtopics'),
                api.get('/questions')
            ])
            set({
                topics: topicsRes.data,
                subTopics: subTopicsRes.data,
                questions: questionsRes.data,
                loading: false
            })
        } catch (e) {
            // fallback to local sample data
            const { topics, subTopics, questions } = sampleData
            set({ topics, subTopics, questions, loading: false })
        }
    },
    // search & filter state
    searchTerm: '',
    difficultyFilter: 'All',
    setSearchTerm: (term) => set({ searchTerm: term }),
    setDifficultyFilter: (filter) => set({ difficultyFilter: filter }),

    // ---- CRUD for Topics ----
    addTopic: async (name) => {
        const res = await api.post('/topics', { name, position: get().topics.length })
        set(state => ({ topics: [...state.topics, res.data] }))
    },
    updateTopic: async (id, name) => {
        await api.put(`/topics/${id}`, { name })
        set(state => ({
            topics: state.topics.map(t => t.id === id ? { ...t, name } : t)
        }))
    },
    deleteTopic: async (id) => {
        await api.delete(`/topics/${id}`)
        set(state => ({
            topics: state.topics.filter(t => t.id !== id),
            subTopics: state.subTopics.filter(st => st.topicId !== id),
            questions: state.questions.filter(q => q.topicId !== id)
        }))
    },

    // ---- CRUD for SubTopics ----
    addSubTopic: async (name, topicId) => {
        const position = get().subTopics.filter(st => st.topicId === topicId).length
        const res = await api.post('/subtopics', { name, topicId, position })
        set(state => ({ subTopics: [...state.subTopics, res.data] }))
    },
    updateSubTopic: async (id, name) => {
        await api.put(`/subtopics/${id}`, { name })
        set(state => ({
            subTopics: state.subTopics.map(st => st.id === id ? { ...st, name } : st)
        }))
    },
    deleteSubTopic: async (id) => {
        await api.delete(`/subtopics/${id}`)
        set(state => ({
            subTopics: state.subTopics.filter(st => st.id !== id),
            questions: state.questions.map(q => q.subTopicId === id ? { ...q, subTopicId: null } : q)
        }))
    },

    // ---- CRUD for Questions ----
    addQuestion: async (title, difficulty, link, topicId, subTopicId = null) => {
        const position = get().questions.filter(q => q.topicId === topicId && q.subTopicId === subTopicId).length
        const res = await api.post('/questions', { title, difficulty, link, topicId, subTopicId, position })
        set(state => ({ questions: [...state.questions, res.data] }))
    },
    updateQuestion: async (id, fields) => {
        await api.put(`/questions/${id}`, fields)
        set(state => ({
            questions: state.questions.map(q => q.id === id ? { ...q, ...fields } : q)
        }))
    },
    deleteQuestion: async (id) => {
        await api.delete(`/questions/${id}`)
        set(state => ({ questions: state.questions.filter(q => q.id !== id) }))
    },
    toggleSolved: async (id, solved) => {
        // optimistic update
        set(state => ({
            questions: state.questions.map(q => q.id === id ? { ...q, solved } : q)
        }))
        // persist solved flag (backend may ignore extra field)
        await api.put(`/questions/${id}`, { solved })
    },

    // ---- REORDER (drag-and-drop) ----
    reorderTopics: async (newOrderedTopics) => {
        const withPositions = newOrderedTopics.map((t, i) => ({ ...t, position: i }))
        set({ topics: withPositions })
        await api.put('/topics/reorder', withPositions)
    },
    reorderSubTopics: async (newOrderedSubTopics) => {
        const withPositions = newOrderedSubTopics.map((st, i) => ({ ...st, position: i }))
        set({ subTopics: withPositions })
        await api.put('/subtopics/reorder', withPositions)
    },
    reorderQuestions: async (newOrderedQuestions) => {
        const withPositions = newOrderedQuestions.map((q, i) => ({ ...q, position: i }))
        set({ questions: withPositions })
        await api.put('/questions/reorder', withPositions)
    },
}))