import { useEffect } from 'react'

export function useTitle(title: string): void {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — EduVerse` : 'EduVerse — Learn Programming, Math & Physics'
    return () => {
      document.title = prev
    }
  }, [title])
}
