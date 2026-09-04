// src/components/HeroSection.jsx
import React, { useState } from 'react'
import { useTrackerStore } from '../store/useTrackerStore'
import { useDrawer } from '../context/DrawerContext'

export default function HeroSection() {
  const questions = useTrackerStore(state => state.questions)
  const { openDrawer } = useDrawer()
  const [pickedMessage, setPickedMessage] = useState(null)

  const total = questions.length
  const solved = questions.filter(q => q.solved).length

  const easyQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'easy')
  const easyTotal = easyQuestions.length
  const easySolved = easyQuestions.filter(q => q.solved).length

  const medQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'medium')
  const medTotal = medQuestions.length
  const medSolved = medQuestions.filter(q => q.solved).length

  const hardQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'hard')
  const hardTotal = hardQuestions.length
  const hardSolved = hardQuestions.filter(q => q.solved).length

  // Hand-rolled SVG Progress Ring Calculations (3 nested concentric or segmented arcs)
  const size = 150
  const center = size / 2

  // Concentric ring radii & circumferences
  const rEasy = 60
  const cEasy = 2 * Math.PI * rEasy
  const strokeEasy = easyTotal ? (easySolved / easyTotal) * cEasy : 0

  const rMed = 48
  const cMed = 2 * Math.PI * rMed
  const strokeMed = medTotal ? (medSolved / medTotal) * cMed : 0

  const rHard = 36
  const cHard = 2 * Math.PI * rHard
  const strokeHard = hardTotal ? (hardSolved / hardTotal) * cHard : 0

  // "Pick a random question" handler
  const handlePickRandom = () => {
    const unsolved = questions.filter(q => !q.solved)
    const targetPool = unsolved.length > 0 ? unsolved : questions

    if (targetPool.length === 0) return

    const randomQuestion = targetPool[Math.floor(Math.random() * targetPool.length)]
    openDrawer(randomQuestion)
    setPickedMessage(`Picked: ${randomQuestion.title}`)
    setTimeout(() => setPickedMessage(null), 3000)

    // Optional: smooth scroll towards the element if present
    const el = document.getElementById(`q-${randomQuestion.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 card-3d border border-[rgb(255,237,213)] dark:border-zinc-800 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Title, Description, Action Button */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Striver SDE Sheet
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[rgb(255,237,213)] text-[rgb(245,124,6)] dark:bg-zinc-800 dark:text-[rgb(245,124,6)] border border-[rgb(245,124,6)]/30">
              🔥 Top Interview DSA
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Striver SDE Sheet contains very handily crafted and picked top coding interview questions from different topics of Data Structures & Algorithms. These questions are one of the most asked coding interview questions in coding interviews of companies like Google, Amazon, Microsoft, Facebook, Swiggy, Flipkart, etc, and cover almost all of the concepts related to Data Structure & Algorithms. Note: Due to legal and compliance requirements of TakeUForward (TUF), Codolio has updated the links to mirror the latest official TUF sheets. We made sure that your progress and notes remain fully intact, only the external links are updated. Source:{' '}
            <a
              href="https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(245,124,6)] font-semibold underline hover:opacity-80 transition-opacity"
            >
              TakeUForward
            </a>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePickRandom}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white btn-3d inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>🎲 Pick a Random Problem</span>
            </button>

            {pickedMessage && (
              <span className="text-xs font-bold text-[rgb(245,124,6)] bg-[rgb(255,237,213)] px-3 py-1.5 rounded-lg border border-[rgb(245,124,6)]/30 animate-fadeIn">
                {pickedMessage}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Circular Progress Ring & Difficulty Breakdown */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 bg-[rgb(255,237,213)]/30 dark:bg-zinc-800/40 p-4 rounded-xl border border-[rgb(255,237,213)]/70 dark:border-zinc-700/50">
          {/* Concentric Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Tracks */}
              <circle cx={center} cy={center} r={rEasy} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-200 dark:text-zinc-700" />
              <circle cx={center} cy={center} r={rMed} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-200 dark:text-zinc-700" />
              <circle cx={center} cy={center} r={rHard} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-200 dark:text-zinc-700" />

              {/* Progress Arcs */}
              <circle
                cx={center}
                cy={center}
                r={rEasy}
                stroke="#22c55e"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={cEasy}
                strokeDashoffset={cEasy - strokeEasy}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <circle
                cx={center}
                cy={center}
                r={rMed}
                stroke="#f59e0b"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={cMed}
                strokeDashoffset={cMed - strokeMed}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <circle
                cx={center}
                cy={center}
                r={rHard}
                stroke="#ef4444"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={cHard}
                strokeDashoffset={cHard - strokeHard}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                {solved}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 mt-0.5">
                / {total} Solved
              </span>
            </div>
          </div>

          {/* Breakdown Legend Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-3 gap-2 w-full text-center">
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Easy</div>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200">{easySolved}/{easyTotal}</div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-amber-200 dark:border-amber-900/60 shadow-xs">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Med</div>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200">{medSolved}/{medTotal}</div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-rose-200 dark:border-rose-900/60 shadow-xs">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Hard</div>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200">{hardSolved}/{hardTotal}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
