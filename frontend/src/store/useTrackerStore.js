// src/store/useTrackerStore.js
import { create } from 'zustand'
import axios from 'axios'
import sampleData from '../data/sample-data.json'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

// Helper to parse sample data if backend is not available
const parseFallbackData = () => {
    try {
        const dataNode = sampleData?.data || sampleData
        const sheet = dataNode?.sheet || {}
        const rawQuestions = dataNode?.questions || []

        const topicOrder = sheet?.config?.topicOrder || []
        const topics = []
        const topicNameToId = {}

        topicOrder.forEach((tName, idx) => {
            const id = idx + 1
            topics.push({ id, name: tName, position: idx })
            topicNameToId[tName] = id
        })

        const subTopics = []
        const subTopicMap = {}
        let nextSubId = 1

        const questions = rawQuestions.map((q, idx) => {
            const topicName = q.topic || 'General'
            if (!topicNameToId[topicName]) {
                const newId = topics.length + 1
                topics.push({ id: newId, name: topicName, position: topics.length })
                topicNameToId[topicName] = newId
            }
            const topicId = topicNameToId[topicName]

            let subTopicId = null
            if (q.subTopic && typeof q.subTopic === 'string' && q.subTopic.trim()) {
                const subKey = `${topicId}_${q.subTopic.trim()}`
                if (!subTopicMap[subKey]) {
                    const sId = nextSubId++
                    const stObj = { id: sId, name: q.subTopic.trim(), topicId, position: subTopics.length }
                    subTopics.push(stObj)
                    subTopicMap[subKey] = sId
                }
                subTopicId = subTopicMap[subKey]
            }

            const problemInfo = q.questionId || {}
            const difficulty = problemInfo.difficulty || 'Medium'
            const link = problemInfo.problemUrl || q.resource || ''

            return {
                id: idx + 1,
                title: q.title || problemInfo.name || 'Untitled Problem',
                difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase(),
                link,
                resource: q.resource || '',
                solved: !!q.isSolved,
                topicId,
                subTopicId,
                position: idx
            }
        })

        return { topics, subTopics, questions }
    } catch (e) {
        console.error('Error parsing sample data:', e)
        return { topics: [], subTopics: [], questions: [] }
    }
}

export const useTrackerStore = create((set, get) => ({
    topics: [],      // [{ id, name, position }]
    subTopics: [],   // [{ id, name, topicId, position }]
    questions: [],   // [{ id, title, difficulty, link, topicId, subTopicId, position, solved }]
    loading: false,
    backendConnected: false,

    // search & filter state
    searchTerm: '',
    difficultyFilter: 'All',
    setSearchTerm: (term) => set({ searchTerm: term }),
    setDifficultyFilter: (filter) => set({ difficultyFilter: filter }),

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
                loading: false,
                backendConnected: true
            })
        } catch (e) {
            console.warn('Backend API not reachable, using seeded local dataset:', e.message)
            const fallback = parseFallbackData()
            set({
                topics: fallback.topics,
                subTopics: fallback.subTopics,
                questions: fallback.questions,
                loading: false,
                backendConnected: false
            })
        }
    },

    // ---- CRUD for Topics ----
    addTopic: async (name) => {
        const position = get().topics.length
        try {
            const res = await api.post('/topics', { name, position })
            set(state => ({ topics: [...state.topics, res.data] }))
        } catch (e) {
            const fakeId = Date.now()
            set(state => ({ topics: [...state.topics, { id: fakeId, name, position }] }))
        }
    },

    updateTopic: async (id, name) => {
        set(state => ({
            topics: state.topics.map(t => t.id === id ? { ...t, name } : t)
        }))
        try {
            await api.put(`/topics/${id}`, { name })
        } catch (e) {
            console.warn('Offline update for topic:', id)
        }
    },

    deleteTopic: async (id) => {
        set(state => ({
            topics: state.topics.filter(t => t.id !== id),
            subTopics: state.subTopics.filter(st => st.topicId !== id),
            questions: state.questions.filter(q => q.topicId !== id)
        }))
        try {
            await api.delete(`/topics/${id}`)
        } catch (e) {
            console.warn('Offline delete for topic:', id)
        }
    },

    // ---- CRUD for SubTopics ----
    addSubTopic: async (name, topicId) => {
        const position = get().subTopics.filter(st => st.topicId === topicId).length
        try {
            const res = await api.post('/subtopics', { name, topicId, position })
            set(state => ({ subTopics: [...state.subTopics, res.data] }))
        } catch (e) {
            const fakeId = Date.now()
            set(state => ({ subTopics: [...state.subTopics, { id: fakeId, name, topicId, position }] }))
        }
    },

    updateSubTopic: async (id, name) => {
        set(state => ({
            subTopics: state.subTopics.map(st => st.id === id ? { ...st, name } : st)
        }))
        try {
            await api.put(`/subtopics/${id}`, { name })
        } catch (e) {
            console.warn('Offline update for subtopic:', id)
        }
    },

    deleteSubTopic: async (id) => {
        set(state => ({
            subTopics: state.subTopics.filter(st => st.id !== id),
            questions: state.questions.map(q => q.subTopicId === id ? { ...q, subTopicId: null } : q)
        }))
        try {
            await api.delete(`/subtopics/${id}`)
        } catch (e) {
            console.warn('Offline delete for subtopic:', id)
        }
    },

    // ---- CRUD for Questions ----
    addQuestion: async (title, difficulty, link, topicId, subTopicId = null) => {
        const position = get().questions.filter(q => q.topicId === topicId && q.subTopicId === subTopicId).length
        try {
            const res = await api.post('/questions', { title, difficulty, link, topicId, subTopicId, position, solved: false })
            set(state => ({ questions: [...state.questions, res.data] }))
        } catch (e) {
            const fakeId = Date.now()
            set(state => ({
                questions: [...state.questions, {
                    id: fakeId,
                    title,
                    difficulty,
                    link,
                    topicId,
                    subTopicId,
                    position,
                    solved: false
                }]
            }))
        }
    },

    updateQuestion: async (id, fields) => {
        set(state => ({
            questions: state.questions.map(q => q.id === id ? { ...q, ...fields } : q)
        }))
        try {
            await api.put(`/questions/${id}`, fields)
        } catch (e) {
            console.warn('Offline update for question:', id)
        }
    },

    deleteQuestion: async (id) => {
        set(state => ({ questions: state.questions.filter(q => q.id !== id) }))
        try {
            await api.delete(`/questions/${id}`)
        } catch (e) {
            console.warn('Offline delete for question:', id)
        }
    },

    toggleSolved: async (id, solved) => {
        set(state => ({
            questions: state.questions.map(q => q.id === id ? { ...q, solved } : q)
        }))
        try {
            await api.put(`/questions/${id}`, { solved })
        } catch (e) {
            console.warn('Offline toggleSolved for question:', id)
        }
    },

    // ---- REORDER (drag-and-drop) ----
    reorderTopics: async (newOrderedTopics) => {
        const withPositions = newOrderedTopics.map((t, i) => ({ ...t, position: i }))
        set({ topics: withPositions })
        try {
            await api.put('/topics/reorder', withPositions)
        } catch (e) {
            console.warn('Offline reorder topics')
        }
    },

    reorderSubTopics: async (newOrderedSubTopics) => {
        const withPositions = newOrderedSubTopics.map((st, i) => ({ ...st, position: i }))
        set({ subTopics: withPositions })
        try {
            await api.put('/subtopics/reorder', withPositions)
        } catch (e) {
            console.warn('Offline reorder subtopics')
        }
    },

    reorderQuestions: async (newOrderedQuestions) => {
        const withPositions = newOrderedQuestions.map((q, i) => ({ ...q, position: i }))
        set({ questions: withPositions })
        try {
            await api.put('/questions/reorder', withPositions)
        } catch (e) {
            console.warn('Offline reorder questions')
        }
    },
}))