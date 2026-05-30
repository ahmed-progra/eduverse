import { create } from 'zustand'
import type { ChatMessage } from '../types'
import * as aiApi from '../api/ai'

interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  currentLessonId: string | null
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  setLesson: (lessonId: string) => void
}

let messageCounter = 0

function makeId(): string {
  messageCounter += 1
  return `msg_${Date.now()}_${messageCounter}`
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  currentLessonId: null,

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, userMessage], isLoading: true }))

    try {
      const res = await aiApi.sendMessage(content, get().currentLessonId ?? undefined)
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
      }
      set((s) => ({ messages: [...s.messages, assistantMessage], isLoading: false }))
    } catch {
      const errorMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      set((s) => ({ messages: [...s.messages, errorMessage], isLoading: false }))
    }
  },

  clearChat: () => {
    set({ messages: [], currentLessonId: null })
  },

  setLesson: (lessonId: string) => {
    set({ currentLessonId: lessonId, messages: [] })
  },
}))
