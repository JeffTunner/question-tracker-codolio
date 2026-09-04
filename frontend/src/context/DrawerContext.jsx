// src/context/DrawerContext.jsx
import React, { createContext, useContext, useState } from 'react'

const DrawerContext = createContext({
  selectedQuestion: null,
  openDrawer: (question) => {},
  closeDrawer: () => {}
})

export function DrawerProvider({ children }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const openDrawer = (question) => setSelectedQuestion(question)
  const closeDrawer = () => setSelectedQuestion(null)

  return (
    <DrawerContext.Provider value={{ selectedQuestion, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = () => useContext(DrawerContext)
